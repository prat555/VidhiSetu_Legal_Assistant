from __future__ import annotations

import argparse
from pathlib import Path

import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Merge LoRA adapter into base model and prepare export artifacts")
    parser.add_argument("--base_model", type=str, required=True)
    parser.add_argument("--adapter_dir", type=str, required=True)
    parser.add_argument("--out_dir", type=str, required=True)
    parser.add_argument("--torch_dtype", type=str, default="float16", choices=["float16", "bfloat16", "float32"])
    return parser.parse_args()


def resolve_dtype(name: str) -> torch.dtype:
    if name == "bfloat16":
        return torch.bfloat16
    if name == "float32":
        return torch.float32
    return torch.float16


def main() -> None:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    dtype = resolve_dtype(args.torch_dtype)

    tokenizer = AutoTokenizer.from_pretrained(args.base_model, use_fast=True)
    base_model = AutoModelForCausalLM.from_pretrained(
        args.base_model,
        torch_dtype=dtype,
        device_map="auto" if torch.cuda.is_available() else None,
        trust_remote_code=True,
    )

    model = PeftModel.from_pretrained(base_model, args.adapter_dir)
    merged = model.merge_and_unload()
    merged.save_pretrained(str(out_dir), safe_serialization=True)
    tokenizer.save_pretrained(str(out_dir))

    modelfile = (
        "# Edit FROM to your local base/merged model path in Ollama format\n"
        "# If you convert merged weights to GGUF, update this file accordingly.\n"
        "FROM llama3.2:3b\n"
        "SYSTEM \"You are an Indian legal assistant. Answer clearly, cite relevant sections, and avoid speculation.\"\n"
    )
    (out_dir / "Modelfile").write_text(modelfile, encoding="utf-8")

    print("Merged model written to", out_dir)
    print("Modelfile scaffold written to", out_dir / "Modelfile")


if __name__ == "__main__":
    main()
