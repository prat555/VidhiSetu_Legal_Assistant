// Legal Form Templates for India
// These templates follow standard Indian legal formats

export interface FormData {
  [key: string]: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function generateFIR(data: FormData): string {
  return `
═══════════════════════════════════════════════════════════════════════════════
                           FIRST INFORMATION REPORT
                       (Under Section 154 Cr.P.C. / BNSS)
═══════════════════════════════════════════════════════════════════════════════

To,
The Station House Officer,
${data.station || '[Police Station Name]'}
[District, State]

Date: ${getCurrentDate()}

Subject: First Information Report regarding ${data.details?.substring(0, 50) || 'criminal incident'}...

═══════════════════════════════════════════════════════════════════════════════
                              COMPLAINANT DETAILS
═══════════════════════════════════════════════════════════════════════════════

Name:           ${data.name || '[Complainant Name]'}
Address:        ${data.address || '[Complete Address]'}
Phone:          ${data.phone || '[Contact Number]'}

═══════════════════════════════════════════════════════════════════════════════
                              INCIDENT DETAILS
═══════════════════════════════════════════════════════════════════════════════

Date of Incident:       ${formatDate(data.date)}
Time of Incident:       ${data.time || '[Approximate Time]'}
Place of Occurrence:    ${data.location || '[Location]'}

═══════════════════════════════════════════════════════════════════════════════
                          DESCRIPTION OF INCIDENT
═══════════════════════════════════════════════════════════════════════════════

I, ${data.name || '[Complainant Name]'}, do hereby state on oath as follows:

${data.details || '[Detailed description of the incident]'}

═══════════════════════════════════════════════════════════════════════════════
                    DETAILS OF ACCUSED (If Known)
═══════════════════════════════════════════════════════════════════════════════

${data.accused || 'Unknown / To be investigated'}

═══════════════════════════════════════════════════════════════════════════════
                    LIST OF STOLEN/DAMAGED PROPERTY
═══════════════════════════════════════════════════════════════════════════════

${data.items || 'N/A'}

═══════════════════════════════════════════════════════════════════════════════
                              PRAYER / REQUEST
═══════════════════════════════════════════════════════════════════════════════

In view of the above facts and circumstances, I request you to:

1. Register this FIR and investigate the matter
2. Take appropriate legal action against the accused person(s)
3. Recover the stolen property (if applicable)
4. Provide me with a copy of this FIR

═══════════════════════════════════════════════════════════════════════════════
                              DECLARATION
═══════════════════════════════════════════════════════════════════════════════

I hereby declare that the above statement is true and correct to the best of my 
knowledge and belief. I understand that making a false statement is punishable 
under Section 182/211 of the Indian Penal Code / relevant BNSS sections.

Place: ${data.location?.split(',')[0] || '[City]'}
Date:  ${getCurrentDate()}


                                            ____________________________
                                            Signature of Complainant
                                            (${data.name || 'Complainant Name'})

═══════════════════════════════════════════════════════════════════════════════
                         FOR OFFICIAL USE ONLY
═══════════════════════════════════════════════════════════════════════════════

FIR No.:           ________________
Date/Time:         ________________
Sections Applied:  ________________
IO Assigned:       ________________

Station Seal                              Signature of SHO
═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

export function generateLegalNotice(data: FormData): string {
  return `
═══════════════════════════════════════════════════════════════════════════════
                              LEGAL NOTICE
                  (Under Section 80 C.P.C. / General Notice)
═══════════════════════════════════════════════════════════════════════════════

Date: ${getCurrentDate()}

THROUGH REGISTERED POST / SPEED POST / COURIER / EMAIL

═══════════════════════════════════════════════════════════════════════════════
                                  FROM
═══════════════════════════════════════════════════════════════════════════════

${data.sender || '[Sender Name]'}
${data.sender_address || '[Sender Address]'}
Contact: ${data.sender_contact || '[Phone/Email]'}

═══════════════════════════════════════════════════════════════════════════════
                                   TO
═══════════════════════════════════════════════════════════════════════════════

${data.recipient || '[Recipient Name]'}
${data.address || '[Recipient Address]'}

═══════════════════════════════════════════════════════════════════════════════
                    SUBJECT: ${(data.subject || 'LEGAL NOTICE').toUpperCase()}
═══════════════════════════════════════════════════════════════════════════════

Dear Sir/Madam,

Under instructions from and on behalf of my client, ${data.sender || '[Client Name]'}, 
I do hereby serve upon you this Legal Notice as follows:

───────────────────────────────────────────────────────────────────────────────
                           FACTS OF THE MATTER
───────────────────────────────────────────────────────────────────────────────

${data.background || '[Background and facts of the matter]'}

───────────────────────────────────────────────────────────────────────────────
                            LEGAL GROUNDS
───────────────────────────────────────────────────────────────────────────────

${data.grounds || '[Legal basis for the claim - agreements violated, applicable laws, etc.]'}

───────────────────────────────────────────────────────────────────────────────
                               DEMAND
───────────────────────────────────────────────────────────────────────────────

In view of the above facts and circumstances, my client hereby demands:

${data.demand || '[Specific demands/actions required]'}

───────────────────────────────────────────────────────────────────────────────
                         TIME LIMIT & WARNING
───────────────────────────────────────────────────────────────────────────────

You are hereby called upon to comply with the above demand within 
${data.deadline || '15 (Fifteen) days'} from the receipt of this notice.

PLEASE TAKE NOTICE that in case of your failure to comply with the above 
demand within the stipulated time, my client shall be constrained to initiate 
appropriate civil/criminal legal proceedings against you at your risk, cost, 
and consequences, which please note.

This notice is issued without prejudice to any other rights and remedies 
available to my client under law.

A copy of this notice is retained in my office for further action.


                                            Yours faithfully,


                                            ____________________________
                                            ${data.sender || '[Sender Name]'}
                                            (or Advocate, if applicable)

═══════════════════════════════════════════════════════════════════════════════
                         ACKNOWLEDGMENT RECEIPT
═══════════════════════════════════════════════════════════════════════════════

Received on: ________________    Signature: ____________________

═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

export function generateRTI(data: FormData): string {
  return `
═══════════════════════════════════════════════════════════════════════════════
           APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005
                        (Section 6(1) of RTI Act)
═══════════════════════════════════════════════════════════════════════════════

Date: ${getCurrentDate()}

To,
The Public Information Officer (PIO),
${data.department || '[Name of Public Authority/Department]'}
${data.dept_address || '[Address of Public Authority]'}

═══════════════════════════════════════════════════════════════════════════════
                           APPLICANT DETAILS
═══════════════════════════════════════════════════════════════════════════════

Name:           ${data.name || '[Applicant Name]'}
Address:        ${data.address || '[Complete Address]'}
Contact:        ${data.contact || '[Phone/Email]'}
BPL Status:     ${data.bpl || 'No'}

═══════════════════════════════════════════════════════════════════════════════
                              SUBJECT
═══════════════════════════════════════════════════════════════════════════════

Application for information under RTI Act, 2005

═══════════════════════════════════════════════════════════════════════════════
                         INFORMATION SOUGHT
═══════════════════════════════════════════════════════════════════════════════

Sir/Madam,

I, ${data.name || '[Applicant Name]'}, a citizen of India, hereby request 
the following information under the Right to Information Act, 2005:

${data.information || '[Clearly describe the information you need]'}

${data.period ? `Period: ${data.period}` : ''}

═══════════════════════════════════════════════════════════════════════════════
                          SPECIFIC QUERIES
═══════════════════════════════════════════════════════════════════════════════

1. ${data.information?.split('\n')[0] || 'Please provide the requested information'}

2. Please provide certified copies of relevant documents, if any.

3. If the information is held by another public authority, please transfer 
   this application to the concerned authority under Section 6(3) of the 
   RTI Act, 2005.

═══════════════════════════════════════════════════════════════════════════════
                         FEE PAYMENT DETAILS
═══════════════════════════════════════════════════════════════════════════════

${data.bpl?.toLowerCase() === 'yes' 
  ? 'I am a Below Poverty Line (BPL) card holder and hence exempt from payment of fee as per Section 7(5) of RTI Act, 2005. (BPL card copy attached)' 
  : 'I am enclosing the prescribed fee of Rs. 10/- (Rupees Ten only) through:\n[ ] Indian Postal Order No.: ____________\n[ ] Demand Draft No.: ____________\n[ ] Cash Receipt No.: ____________\n[ ] Online Payment Reference: ____________'}

═══════════════════════════════════════════════════════════════════════════════
                             DECLARATION
═══════════════════════════════════════════════════════════════════════════════

I hereby declare that:
1. I am a citizen of India
2. The information sought does not fall under the exemptions listed in 
   Section 8 and 9 of the RTI Act, 2005
3. The information is required for lawful purposes

═══════════════════════════════════════════════════════════════════════════════
                           PREFERRED MODE
═══════════════════════════════════════════════════════════════════════════════

Please provide the information through:
[ ] Physical copies by post
[ ] Email at: ${data.contact || '____________'}
[ ] Inspection of records

Place: [City]
Date:  ${getCurrentDate()}


                                            ____________________________
                                            Signature of Applicant
                                            (${data.name || 'Applicant Name'})

═══════════════════════════════════════════════════════════════════════════════
                         FOR OFFICIAL USE ONLY
═══════════════════════════════════════════════════════════════════════════════

Registration No.:    ________________
Date of Receipt:     ________________
Fee Received:        ________________
Due Date (30 days):  ________________
PIO Signature:       ________________

═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

export function generateBailApplication(data: FormData): string {
  return `
═══════════════════════════════════════════════════════════════════════════════
                          BAIL APPLICATION
           (Under Section 437/438/439 Cr.P.C. / Relevant BNSS Sections)
═══════════════════════════════════════════════════════════════════════════════

IN THE COURT OF ${(data.court || 'SESSIONS JUDGE / MAGISTRATE').toUpperCase()}

                                                    Case No.: ${data.caseNumber || '____________'}
                                                    FIR No.:  ${data.caseNumber || '____________'}

═══════════════════════════════════════════════════════════════════════════════

IN THE MATTER OF:

${data.accused || '[Name of Accused]'}
S/o ${data.father || '[Father\'s Name]'}
Age: ${data.age || '____'} years
R/o ${data.address || '[Complete Address]'}
                                                          ... APPLICANT/ACCUSED

                                    VERSUS

State of ____________
Through: Station House Officer
${data.custody || '[Police Station]'}
                                                          ... RESPONDENT/STATE

═══════════════════════════════════════════════════════════════════════════════
             APPLICATION FOR GRANT OF REGULAR BAIL / ANTICIPATORY BAIL
═══════════════════════════════════════════════════════════════════════════════

MOST RESPECTFULLY SHOWETH:

1. That the applicant is named as accused in FIR No. ${data.caseNumber || '____________'} 
   registered at ${data.custody || '[Police Station]'} for the alleged offence 
   under ${data.offense || '[Sections of IPC/BNS/Special Laws]'}.

2. That the applicant was arrested on ${formatDate(data.arrest_date)} and is 
   presently lodged at ${data.custody || '[Place of Custody]'}.

═══════════════════════════════════════════════════════════════════════════════
                         GROUNDS FOR BAIL
═══════════════════════════════════════════════════════════════════════════════

3. The applicant seeks bail on the following grounds:

${data.grounds || `   a) The applicant is innocent and has been falsely implicated in this case.
   
   b) The applicant has deep roots in the community and is not a flight risk.
   
   c) The applicant is ready to cooperate with the investigation.
   
   d) The applicant undertakes to appear before the Court/IO as and when required.
   
   e) No useful purpose will be served by keeping the applicant in custody.
   
   f) The applicant has no previous criminal antecedents.`}

4. That investigation in the matter, if any, is complete and the applicant's 
   further custody is not required.

5. That the applicant is ready and willing to furnish bail bond and surety 
   to the satisfaction of this Hon'ble Court.

${data.surety ? `\n6. SURETY DETAILS:\n${data.surety}` : ''}

═══════════════════════════════════════════════════════════════════════════════
                              PRAYER
═══════════════════════════════════════════════════════════════════════════════

In view of the above facts and circumstances, it is most respectfully prayed 
that this Hon'ble Court may graciously be pleased to:

   a) Grant Regular Bail / Anticipatory Bail to the applicant in connection 
      with FIR No. ${data.caseNumber || '____________'};

   b) Direct the applicant's release on furnishing personal bond and surety 
      to the satisfaction of this Hon'ble Court;

   c) Pass any other order(s) as this Hon'ble Court may deem fit and proper 
      in the interest of justice.

                                        AND FOR THIS ACT OF KINDNESS, THE
                                        APPLICANT AS IN DUTY BOUND SHALL
                                        EVER PRAY.

Place: [City]
Date:  ${getCurrentDate()}

                                            ____________________________
                                            Applicant/Accused
                                            Through Counsel (if applicable)

═══════════════════════════════════════════════════════════════════════════════
                              VERIFICATION
═══════════════════════════════════════════════════════════════════════════════

I, ${data.accused || '[Name of Applicant]'}, do hereby verify that the contents 
of the above application are true and correct to the best of my knowledge and 
belief, and nothing material has been concealed therefrom.

Verified at [City] on ${getCurrentDate()}.

                                            ____________________________
                                            Applicant

═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

export function generateConsumerComplaint(data: FormData): string {
  const amount = parseFloat(data.amount?.replace(/[^0-9.]/g, '') || '0');
  let forum = 'District Consumer Disputes Redressal Commission';
  if (amount > 10000000) forum = 'National Consumer Disputes Redressal Commission';
  else if (amount > 100000) forum = 'State Consumer Disputes Redressal Commission';

  return `
═══════════════════════════════════════════════════════════════════════════════
                         CONSUMER COMPLAINT
            (Under Section 35 of Consumer Protection Act, 2019)
═══════════════════════════════════════════════════════════════════════════════

BEFORE THE HON'BLE ${forum.toUpperCase()}
[State/District]

                                            Complaint No.: ________________

═══════════════════════════════════════════════════════════════════════════════

IN THE MATTER OF:

${data.name || '[Complainant Name]'}
${data.address || '[Complete Address]'}
Contact: ${data.contact || '[Phone/Email]'}
                                                          ... COMPLAINANT

                                    VERSUS

${data.seller || '[Seller/Service Provider Name]'}
${data.seller_address || '[Address of Opposite Party]'}
                                                          ... OPPOSITE PARTY

═══════════════════════════════════════════════════════════════════════════════
                    COMPLAINT UNDER CONSUMER PROTECTION ACT, 2019
═══════════════════════════════════════════════════════════════════════════════

MOST RESPECTFULLY SHOWETH:

═══════════════════════════════════════════════════════════════════════════════
                           FACTS OF THE CASE
═══════════════════════════════════════════════════════════════════════════════

1. That the Complainant is a consumer within the meaning of Section 2(7) of 
   the Consumer Protection Act, 2019.

2. That the Complainant purchased the following product/service from the 
   Opposite Party:
   
   Product/Service:    ${data.product || '[Product/Service Name]'}
   Date of Purchase:   ${formatDate(data.purchase_date)}
   Amount Paid:        ₹${data.amount || '____________'}
   Invoice/Receipt No: ${data.invoice || '[Invoice Number]'}

3. DETAILS OF THE ISSUE:

${data.issue || '[Detailed description of the problem - defects, non-delivery, deficiency in service, etc.]'}

4. PREVIOUS COMPLAINTS MADE:

${data.previous || 'The Complainant brought this issue to the notice of the Opposite Party but no satisfactory resolution was provided.'}

═══════════════════════════════════════════════════════════════════════════════
                         DEFICIENCY / UNFAIR TRADE PRACTICE
═══════════════════════════════════════════════════════════════════════════════

5. The above acts of the Opposite Party constitute:
   
   [ ] Defect in goods (Section 2(10) of CP Act, 2019)
   [ ] Deficiency in service (Section 2(11) of CP Act, 2019)  
   [ ] Unfair trade practice (Section 2(47) of CP Act, 2019)
   [ ] Restrictive trade practice

═══════════════════════════════════════════════════════════════════════════════
                            RELIEF SOUGHT
═══════════════════════════════════════════════════════════════════════════════

6. The Complainant prays for the following relief:

${data.relief || `   a) Replacement of the defective product / Re-performance of service
   
   b) Refund of the amount of ₹${data.amount || '____________'} paid
   
   c) Compensation for mental agony and harassment
   
   d) Cost of filing this complaint`}

═══════════════════════════════════════════════════════════════════════════════
                          CAUSE OF ACTION
═══════════════════════════════════════════════════════════════════════════════

7. The cause of action arose on ${formatDate(data.purchase_date)} when the 
   Complainant purchased the product/service and continues to subsist as the 
   defect/deficiency has not been rectified.

═══════════════════════════════════════════════════════════════════════════════
                           JURISDICTION
═══════════════════════════════════════════════════════════════════════════════

8. This Hon'ble Commission has the jurisdiction to try this complaint as:
   
   a) The value of goods/services and compensation claimed is within the 
      pecuniary jurisdiction of this Commission.
   
   b) The Opposite Party carries on business within the territorial 
      jurisdiction of this Commission.

═══════════════════════════════════════════════════════════════════════════════
                              PRAYER
═══════════════════════════════════════════════════════════════════════════════

In view of the above facts and circumstances, it is most respectfully prayed 
that this Hon'ble Commission may graciously be pleased to:

   a) Direct the Opposite Party to replace/repair the defective product or 
      re-perform the service;
   
   b) Direct the Opposite Party to refund the sum of ₹${data.amount || '____________'};
   
   c) Award suitable compensation for mental agony, harassment, and 
      inconvenience caused to the Complainant;
   
   d) Award costs of this complaint;
   
   e) Pass any other order(s) as this Hon'ble Commission may deem fit and 
      proper in the interest of justice.

                                        AND FOR THIS ACT OF KINDNESS, THE
                                        COMPLAINANT AS IN DUTY BOUND SHALL
                                        EVER PRAY.

Place: [City]
Date:  ${getCurrentDate()}

                                            ____________________________
                                            Complainant
                                            (${data.name || 'Complainant Name'})

═══════════════════════════════════════════════════════════════════════════════
                              VERIFICATION
═══════════════════════════════════════════════════════════════════════════════

I, ${data.name || '[Complainant Name]'}, do hereby verify that the contents of 
the above complaint are true and correct to the best of my knowledge and 
belief. No part of this complaint is false and nothing material has been 
concealed therefrom.

Verified at [City] on ${getCurrentDate()}.

                                            ____________________________
                                            Complainant

═══════════════════════════════════════════════════════════════════════════════
                          LIST OF DOCUMENTS
═══════════════════════════════════════════════════════════════════════════════

1. Copy of Invoice/Receipt
2. Copy of Product Warranty Card (if applicable)
3. Photographs of defective product (if applicable)
4. Copy of correspondence with Opposite Party
5. Any other relevant documents

═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

// Main generator function
export function generateLegalForm(formType: string, data: FormData): string {
  switch (formType) {
    case 'fir':
      return generateFIR(data);
    case 'legal_notice':
      return generateLegalNotice(data);
    case 'rti':
      return generateRTI(data);
    case 'bail':
      return generateBailApplication(data);
    case 'consumer_complaint':
      return generateConsumerComplaint(data);
    default:
      throw new Error(`Unknown form type: ${formType}`);
  }
}
