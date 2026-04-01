from __future__ import annotations

import argparse
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import torch
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)


SYSTEM_PROMPT = (
    "You are an Indian legal assistant. Provide clear, practical, and legally grounded answers. "
    "Cite relevant statutes/sections when available and avoid speculation."
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="LoRA SFT for legal assistant style/tone")
    parser.add_argument("--base_model", type=str, default="meta-llama/Llama-3.2-3B-Instruct")
    parser.add_argument("--dataset_path", type=str, required=True, help="Path to JSONL dataset")
    parser.add_argument("--output_dir", type=str, default="outputs/legal-lora")
    parser.add_argument("--max_seq_length", type=int, default=2048)
    parser.add_argument("--learning_rate", type=float, default=2e-4)
    parser.add_argument("--num_train_epochs", type=float, default=3.0)
    parser.add_argument("--per_device_train_batch_size", type=int, default=2)
    parser.add_argument("--gradient_accumulation_steps", type=int, default=8)
    parser.add_argument("--warmup_ratio", type=float, default=0.03)
    parser.add_argument("--weight_decay", type=float, default=0.01)
    parser.add_argument("--logging_steps", type=int, default=10)
    parser.add_argument("--save_steps", type=int, default=200)
    parser.add_argument("--lora_r", type=int, default=16)
    parser.add_argument("--lora_alpha", type=int, default=32)
    parser.add_argument("--lora_dropout", type=float, default=0.05)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--use_4bit", action="store_true", help="Enable 4-bit QLoRA loading")
    parser.add_argument(
        "--target_modules",
        nargs="+",
        default=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )
    return parser.parse_args()


def format_sample(question: str, answer: str) -> str:
    return (
        "<|system|>\n"
        f"{SYSTEM_PROMPT}\n"
        "<|user|>\n"
        f"{question.strip()}\n"
        "<|assistant|>\n"
        f"{answer.strip()}"
    )


@dataclass
class TokenizedBatch:
    input_ids: list[list[int]]
    attention_mask: list[list[int]]
    labels: list[list[int]]


def main() -> None:
    args = parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    tokenizer = AutoTokenizer.from_pretrained(args.base_model, use_fast=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    quantization_config: BitsAndBytesConfig | None = None
    model_kwargs: dict[str, Any] = {"trust_remote_code": True}

    if args.use_4bit:
        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
        )
        model_kwargs["quantization_config"] = quantization_config
        model_kwargs["device_map"] = "auto"
    else:
        model_kwargs["torch_dtype"] = torch.float16 if torch.cuda.is_available() else torch.float32

    model = AutoModelForCausalLM.from_pretrained(args.base_model, **model_kwargs)
    model.config.use_cache = False

    if args.use_4bit:
        model = prepare_model_for_kbit_training(model)

    peft_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=args.target_modules,
    )
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    raw = load_dataset("json", data_files=args.dataset_path, split="train")

    required_cols = {"question", "ideal_answer"}
    missing = required_cols - set(raw.column_names)
    if missing:
        raise ValueError(f"Dataset missing required fields: {sorted(missing)}")

    def tokenize_row(row: dict[str, str]) -> TokenizedBatch:
        text = format_sample(row["question"], row["ideal_answer"])
        encoded = tokenizer(
            text,
            truncation=True,
            max_length=args.max_seq_length,
            padding=False,
        )
        return TokenizedBatch(
            input_ids=encoded["input_ids"],
            attention_mask=encoded["attention_mask"],
            labels=list(encoded["input_ids"]),
        )

    tokenized = raw.map(tokenize_row, remove_columns=raw.column_names)

    train_args = TrainingArguments(
        output_dir=str(output_dir),
        num_train_epochs=args.num_train_epochs,
        per_device_train_batch_size=args.per_device_train_batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        learning_rate=args.learning_rate,
        warmup_ratio=args.warmup_ratio,
        weight_decay=args.weight_decay,
        logging_steps=args.logging_steps,
        save_steps=args.save_steps,
        save_total_limit=2,
        lr_scheduler_type="cosine",
        optim="paged_adamw_8bit" if args.use_4bit else "adamw_torch",
        bf16=torch.cuda.is_available() and torch.cuda.is_bf16_supported(),
        fp16=torch.cuda.is_available() and not torch.cuda.is_bf16_supported(),
        report_to="none",
        seed=args.seed,
    )

    trainer = Trainer(
        model=model,
        args=train_args,
        train_dataset=tokenized,
        tokenizer=tokenizer,
        data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
    )

    trainer.train()
    trainer.model.save_pretrained(str(output_dir))
    tokenizer.save_pretrained(str(output_dir))

    metadata = {
        "base_model": args.base_model,
        "dataset_path": args.dataset_path,
        "output_dir": str(output_dir),
        "use_4bit": args.use_4bit,
        "lora_r": args.lora_r,
        "lora_alpha": args.lora_alpha,
        "lora_dropout": args.lora_dropout,
    }
    (output_dir / "training_config.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print("Saved LoRA adapter to", output_dir)


if __name__ == "__main__":
    main()
