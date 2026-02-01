// PDF Generation for Legal Forms
import jsPDF from 'jspdf';
import { FormData, FormTemplate, FormType } from './types';

interface PDFOptions {
  title: string;
  formType: FormType;
  formData: FormData;
  template: FormTemplate;
}

function formatValue(value: string | boolean | number | undefined): string {
  if (value === undefined || value === null || value === '') return '[Not Provided]';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '[Date]';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount: string | number, currency: string = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '[Amount]';
  
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹'
  };
  
  return `${symbols[currency] || '$'}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// NDA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateNDAContent(data: FormData): string {
  const ndaType = data.ndaType === 'bilateral' ? 'MUTUAL ' : '';
  
  return `${ndaType}NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of ${formatDate(data.effectiveDate as string)} ("Effective Date") by and between:

DISCLOSING PARTY:
${formatValue(data.disclosingPartyName)}
${formatValue(data.disclosingPartyAddress)}
Email: ${formatValue(data.disclosingPartyEmail)}

AND

RECEIVING PARTY:
${formatValue(data.receivingPartyName)}
${formatValue(data.receivingPartyAddress)}
Email: ${formatValue(data.receivingPartyEmail)}

${data.ndaType === 'bilateral' ? '(Collectively referred to as the "Parties" and individually as a "Party")' : ''}

RECITALS

WHEREAS, ${formatValue(data.disclosingPartyName)} ("Disclosing Party") possesses certain confidential and proprietary information; and

WHEREAS, the Receiving Party desires to receive certain Confidential Information for the purpose of ${formatValue(data.purpose)};

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all information or data, whether oral, written, electronic, or visual, disclosed by the Disclosing Party to the Receiving Party, including but not limited to:

${formatValue(data.confidentialInfo)}

${data.exclusions ? `
The following shall NOT be considered Confidential Information:
${formatValue(data.exclusions)}
` : ''}

Additionally, Confidential Information shall not include information that:
(a) Is or becomes publicly available through no fault of the Receiving Party;
(b) Was rightfully in the Receiving Party's possession prior to disclosure;
(c) Is rightfully obtained by the Receiving Party from a third party without restriction;
(d) Is independently developed by the Receiving Party without use of Confidential Information.

2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to:
(a) Hold the Confidential Information in strict confidence;
(b) Not disclose the Confidential Information to any third parties without prior written consent;
(c) Use the Confidential Information solely for the Purpose stated herein;
(d) Limit access to Confidential Information to employees and agents with a need to know;
(e) Protect the Confidential Information using the same degree of care used to protect its own confidential information, but no less than reasonable care.

3. TERM AND DURATION

This Agreement shall commence on the Effective Date and shall remain in effect for ${data.duration === 'perpetual' ? 'perpetuity' : `a period of ${formatValue(data.duration)} year(s)`}.

The confidentiality obligations shall survive termination of this Agreement for a period of ${data.duration === 'perpetual' ? 'perpetuity' : `${formatValue(data.duration)} year(s)`}.

${data.returnOfMaterials ? `
4. RETURN OF MATERIALS

Upon termination of this Agreement or upon request by the Disclosing Party, the Receiving Party shall promptly:
(a) Return all Confidential Information and any copies thereof; or
(b) Destroy all Confidential Information and certify such destruction in writing.
` : ''}

${data.nonSolicitation ? `
${data.returnOfMaterials ? '5' : '4'}. NON-SOLICITATION

During the term of this Agreement and for a period of one (1) year thereafter, the Receiving Party agrees not to directly or indirectly solicit, hire, or engage any employees, contractors, or clients of the Disclosing Party.
` : ''}

${data.nonCompete ? `
${data.returnOfMaterials && data.nonSolicitation ? '6' : data.returnOfMaterials || data.nonSolicitation ? '5' : '4'}. NON-COMPETE

During the term of this Agreement, the Receiving Party agrees not to engage in any business that directly competes with the Disclosing Party's business activities related to the Confidential Information disclosed hereunder.
` : ''}

${data.injunctiveRelief ? `
INJUNCTIVE RELIEF

The Parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be inadequate. Therefore, the Disclosing Party shall be entitled to seek injunctive relief, in addition to any other remedies available at law or equity.
` : ''}

GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of ${formatValue(data.governingLaw)}, without regard to its conflict of laws principles.

DISPUTE RESOLUTION

Any disputes arising out of or relating to this Agreement shall be resolved in the courts of ${formatValue(data.jurisdiction)}.

${data.additionalTerms ? `
ADDITIONAL TERMS

${formatValue(data.additionalTerms)}
` : ''}

ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written.

AMENDMENTS

This Agreement may not be amended except by a written instrument signed by both Parties.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

DISCLOSING PARTY:

_________________________________
Name: ${formatValue(data.disclosingPartyName)}
Date: _____________________________


RECEIVING PARTY:

_________________________________
Name: ${formatValue(data.receivingPartyName)}
Date: _____________________________
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTRACTOR AGREEMENT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateContractorContent(data: FormData): string {
  return `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into as of ${formatDate(data.startDate as string)} by and between:

COMPANY/CLIENT:
${formatValue(data.companyName)}
${formatValue(data.companyAddress)}
Email: ${formatValue(data.companyEmail)}

AND

CONTRACTOR:
${formatValue(data.contractorName)}
${formatValue(data.contractorAddress)}
Email: ${formatValue(data.contractorEmail)}
${data.contractorTaxId ? `Tax ID: ${formatValue(data.contractorTaxId)}` : ''}

1. ENGAGEMENT OF SERVICES

The Company hereby engages the Contractor to perform the following services ("Services"):

${formatValue(data.serviceDescription)}

2. DELIVERABLES

The Contractor shall provide the following deliverables:

${formatValue(data.deliverables)}

3. TERM

This Agreement shall commence on ${formatDate(data.startDate as string)}${data.endDate ? ` and shall terminate on ${formatDate(data.endDate as string)}` : ' and shall continue until terminated by either party'}.

4. WORK LOCATION

The Contractor shall perform services: ${formatValue(data.workLocation)}

5. COMPENSATION

Payment Type: ${formatValue(data.paymentType)}
Rate/Amount: ${formatCurrency(data.rate as string, data.currency as string)}
Payment Schedule: ${formatValue(data.paymentSchedule)}
Payment Method: ${formatValue(data.paymentMethod)}

${data.invoiceRequirements ? `
Invoice Requirements:
${formatValue(data.invoiceRequirements)}
` : ''}

6. INDEPENDENT CONTRACTOR STATUS

The Contractor is an independent contractor and not an employee of the Company. The Contractor shall be solely responsible for:
(a) All taxes, including self-employment tax
(b) Own equipment and supplies
(c) Own insurance coverage
(d) Determining the manner and means of performing the Services

The Company will not provide employee benefits to the Contractor.

7. INTELLECTUAL PROPERTY

${data.ipOwnership === 'client' 
  ? 'All work product, inventions, and intellectual property created by the Contractor in connection with this Agreement shall be the sole and exclusive property of the Company. The Contractor hereby assigns all rights, title, and interest in such work product to the Company.'
  : data.ipOwnership === 'contractor'
  ? 'The Contractor shall retain ownership of all work product and intellectual property. The Contractor grants the Company a non-exclusive, perpetual license to use the work product.'
  : 'All work product created under this Agreement shall be jointly owned by both parties, with each party having equal rights to use and license the work product.'}

${data.confidentiality ? `
8. CONFIDENTIALITY

The Contractor agrees to maintain the confidentiality of all proprietary information disclosed by the Company and shall not disclose such information to any third party without prior written consent.
` : ''}

${data.nonCompete ? `
9. NON-COMPETE

During the term of this Agreement and for a period of [specify] months thereafter, the Contractor agrees not to engage in any business that directly competes with the Company's business.
` : ''}

10. TERMINATION

Either party may terminate this Agreement with ${formatValue(data.terminationNotice)} days' written notice. Upon termination:
(a) The Contractor shall deliver all completed work
(b) The Company shall pay for all Services rendered through the termination date

11. GOVERNING LAW

This Agreement shall be governed by the laws of ${formatValue(data.governingLaw)}.

12. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements and understandings.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY:

_________________________________
Name: ${formatValue(data.companyName)}
Title: _____________________________
Date: _____________________________


CONTRACTOR:

_________________________________
Name: ${formatValue(data.contractorName)}
Date: _____________________________
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// LEASE AGREEMENT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateLeaseContent(data: FormData): string {
  return `RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Lease") is entered into as of ${formatDate(data.startDate as string)} by and between:

LANDLORD:
${formatValue(data.landlordName)}
${formatValue(data.landlordAddress)}
Phone: ${formatValue(data.landlordPhone)}
Email: ${formatValue(data.landlordEmail)}

AND

TENANT(S):
${formatValue(data.tenantName)}
Phone: ${formatValue(data.tenantPhone)}
Email: ${formatValue(data.tenantEmail)}
${data.additionalTenants ? `\nAdditional Tenants:\n${formatValue(data.additionalTenants)}` : ''}

1. PREMISES

Landlord hereby leases to Tenant the property located at:

${formatValue(data.propertyAddress)}

Property Type: ${formatValue(data.propertyType)}
Bedrooms: ${formatValue(data.bedrooms)}
Bathrooms: ${formatValue(data.bathrooms)}
${data.squareFootage ? `Square Footage: ${formatValue(data.squareFootage)} sq ft` : ''}
Furnished Status: ${formatValue(data.furnished)}
${data.parkingSpaces ? `Parking Spaces: ${formatValue(data.parkingSpaces)}` : ''}

2. TERM

Lease Type: ${formatValue(data.leaseType)}
Start Date: ${formatDate(data.startDate as string)}
${data.leaseType === 'fixed' && data.endDate ? `End Date: ${formatDate(data.endDate as string)}` : ''}

3. RENT

Monthly Rent: ${formatCurrency(data.monthlyRent as string, 'USD')}
Due Date: ${formatValue(data.rentDueDate)} of each month
${data.lateFee ? `Late Fee: ${formatCurrency(data.lateFee as string, 'USD')}` : ''}
${data.gracePeriod ? `Grace Period: ${formatValue(data.gracePeriod)} days` : ''}

Rent shall be paid by [specify payment method] to:
[Payment details to be provided by Landlord]

4. SECURITY DEPOSIT

Security Deposit: ${formatCurrency(data.securityDeposit as string, 'USD')}
${data.petDeposit ? `Pet Deposit: ${formatCurrency(data.petDeposit as string, 'USD')}` : ''}

The security deposit shall be held by Landlord and returned within [state-specific timeframe] after Tenant vacates the premises, less any deductions for unpaid rent, damages beyond normal wear and tear, or cleaning costs.

5. PETS

${data.petsAllowed === 'no' 
  ? 'No pets are allowed on the premises without prior written consent from Landlord.'
  : `Pets Allowed: ${formatValue(data.petsAllowed)}
${data.petRestrictions ? `Restrictions: ${formatValue(data.petRestrictions)}` : ''}`}

6. UTILITIES

Utilities Included in Rent:
${formatValue(data.utilitiesIncluded) || 'None'}

Tenant Responsible For:
${formatValue(data.tenantUtilities) || 'All utilities not listed above'}

7. MAINTENANCE

Yard/Exterior Maintenance Responsibility: ${formatValue(data.maintenanceResponsibility)}

Tenant agrees to:
- Keep the premises clean and sanitary
- Dispose of garbage properly
- Not damage the property
- Report any maintenance issues promptly

Landlord agrees to:
- Maintain the property in habitable condition
- Make necessary repairs in a timely manner
- Comply with all applicable housing codes

8. OCCUPANCY

Maximum Occupants: ${formatValue(data.maxOccupants)}

Only the named Tenant(s) and approved occupants may reside at the premises.

9. RULES AND RESTRICTIONS

Smoking: ${data.smokingAllowed ? 'Allowed' : 'Not Allowed'}
Subletting: ${data.sublettingAllowed ? 'Allowed with Landlord approval' : 'Not Allowed'}
${data.quietHours ? `Quiet Hours: ${formatValue(data.quietHours)}` : ''}

${data.additionalRules ? `
Additional Rules:
${formatValue(data.additionalRules)}
` : ''}

10. ENTRY BY LANDLORD

Landlord may enter the premises with reasonable notice (typically 24-48 hours) for:
- Inspections
- Repairs and maintenance
- Showing the property to prospective tenants/buyers
- Emergencies (no notice required)

11. TERMINATION

${data.leaseType === 'fixed' 
  ? 'This lease shall terminate on the end date specified above unless renewed by mutual agreement.'
  : 'Either party may terminate this month-to-month tenancy with 30 days written notice.'}

Upon termination, Tenant shall:
- Remove all personal belongings
- Return all keys
- Leave the premises in clean condition
- Provide forwarding address for security deposit return

12. GOVERNING LAW

This Lease shall be governed by the laws of ${formatValue(data.governingLaw)}.

13. ENTIRE AGREEMENT

This Lease constitutes the entire agreement between the parties. Any modifications must be in writing and signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Lease as of the date first written above.

LANDLORD:

_________________________________
Name: ${formatValue(data.landlordName)}
Date: _____________________________


TENANT:

_________________________________
Name: ${formatValue(data.tenantName)}
Date: _____________________________

${data.additionalTenants ? `
ADDITIONAL TENANT(S):

_________________________________
Name: _____________________________
Date: _____________________________
` : ''}
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BILL OF SALE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateBillOfSaleContent(data: FormData): string {
  return `BILL OF SALE

This Bill of Sale ("Agreement") is made and entered into as of ${formatDate(data.saleDate as string)} by and between:

SELLER:
${formatValue(data.sellerName)}
${formatValue(data.sellerAddress)}
${data.sellerPhone ? `Phone: ${formatValue(data.sellerPhone)}` : ''}

AND

BUYER:
${formatValue(data.buyerName)}
${formatValue(data.buyerAddress)}
${data.buyerPhone ? `Phone: ${formatValue(data.buyerPhone)}` : ''}

1. DESCRIPTION OF PROPERTY

The Seller hereby sells, transfers, and conveys to the Buyer the following described property ("Property"):

Item Type: ${formatValue(data.itemType)}

Description:
${formatValue(data.itemDescription)}

${data.itemType === 'vehicle' ? `
Make: ${formatValue(data.make)}
Model: ${formatValue(data.model)}
Year: ${formatValue(data.year)}
` : ''}
${data.vin ? `VIN/Serial Number: ${formatValue(data.vin)}` : ''}
${data.color ? `Color: ${formatValue(data.color)}` : ''}
Condition: ${formatValue(data.condition)}
${data.conditionDetails ? `\nCondition Details:\n${formatValue(data.conditionDetails)}` : ''}

2. PURCHASE PRICE

The Buyer agrees to pay the Seller the total sum of:

${formatCurrency(data.salePrice as string, data.currency as string)}

Payment Method: ${formatValue(data.paymentMethod)}

3. WARRANTY

${data.warranty === 'as_is' 
  ? 'THE PROPERTY IS SOLD "AS IS" WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED. The Seller makes no representations or warranties of any kind concerning the condition of the Property. The Buyer acknowledges that they have inspected the Property and accepts it in its current condition.'
  : data.warranty === 'manufacturer'
  ? 'Any existing manufacturer warranty shall transfer to the Buyer. The Seller makes no additional warranties beyond the manufacturer warranty.'
  : `The Seller warrants that the Property shall be free from defects for a period of ${data.warranty === '30_days' ? '30 days' : '90 days'} from the date of sale.`}

4. TITLE AND OWNERSHIP

The Seller represents and warrants that:
(a) Seller is the lawful owner of the Property
(b) The Property is free and clear of all liens, encumbrances, and claims
(c) Seller has the legal right to sell the Property
(d) Seller will defend the Buyer's title against all claims

5. TRANSFER OF OWNERSHIP

Upon receipt of the full purchase price, the Seller transfers all right, title, and interest in the Property to the Buyer.

${data.itemType === 'vehicle' ? `
6. VEHICLE-SPECIFIC PROVISIONS

The Seller agrees to:
- Sign over the vehicle title to the Buyer
- Provide any necessary documents for title transfer
- Remove license plates (if required by state law)

The Buyer acknowledges responsibility for:
- Registering the vehicle in their name
- Obtaining insurance
- Paying any applicable taxes and fees

Odometer Reading: _____________ miles
` : ''}

7. GOVERNING LAW

This Bill of Sale shall be governed by the laws of ${formatValue(data.governingLaw)}.

8. ENTIRE AGREEMENT

This Bill of Sale constitutes the entire agreement between the parties and supersedes all prior agreements and understandings.

IN WITNESS WHEREOF, the parties have executed this Bill of Sale as of the date first written above.

SELLER:

_________________________________
Signature

${formatValue(data.sellerName)}
Printed Name

Date: _____________________________


BUYER:

_________________________________
Signature

${formatValue(data.buyerName)}
Printed Name

Date: _____________________________


WITNESS (Optional but Recommended):

_________________________________
Signature

_________________________________
Printed Name

Date: _____________________________
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// POWER OF ATTORNEY GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generatePOAContent(data: FormData): string {
  const poaTypeTitle = {
    'general': 'GENERAL POWER OF ATTORNEY',
    'limited': 'LIMITED POWER OF ATTORNEY',
    'healthcare': 'HEALTHCARE POWER OF ATTORNEY',
    'financial': 'FINANCIAL POWER OF ATTORNEY'
  }[data.poaType as string] || 'POWER OF ATTORNEY';

  return `${poaTypeTitle}

STATE OF ${formatValue(data.governingLaw).toUpperCase()}

KNOW ALL PERSONS BY THESE PRESENTS:

I, ${formatValue(data.principalName)}, residing at:
${formatValue(data.principalAddress)}
Date of Birth: ${formatDate(data.principalDOB as string)}
Phone: ${formatValue(data.principalPhone)}
${data.principalEmail ? `Email: ${formatValue(data.principalEmail)}` : ''}

(hereinafter referred to as "Principal")

do hereby appoint:

${formatValue(data.agentName)}, residing at:
${formatValue(data.agentAddress)}
Phone: ${formatValue(data.agentPhone)}
${data.agentEmail ? `Email: ${formatValue(data.agentEmail)}` : ''}
Relationship: ${formatValue(data.agentRelationship)}

(hereinafter referred to as "Agent" or "Attorney-in-Fact")

${data.alternateAgent ? `
If the above-named Agent is unable or unwilling to serve, I appoint as alternate:

${formatValue(data.alternateAgent)}
${data.alternateAgentAddress ? formatValue(data.alternateAgentAddress) : ''}
` : ''}

to act as my true and lawful Attorney-in-Fact with the powers specified herein.

1. GRANT OF AUTHORITY

I grant my Agent the authority to act on my behalf in the following matters:

${data.bankingPower ? '☑' : '☐'} Banking and Financial Transactions
${data.realEstatePower ? '☑' : '☐'} Real Estate Transactions
${data.taxPower ? '☑' : '☐'} Tax Matters
${data.investmentPower ? '☑' : '☐'} Investment Decisions
${data.insurancePower ? '☑' : '☐'} Insurance Matters
${data.legalPower ? '☑' : '☐'} Legal Proceedings
${data.businessPower ? '☑' : '☐'} Business Operations
${data.governmentPower ? '☑' : '☐'} Government Benefits

${data.poaType === 'limited' && data.specificPowers ? `
Specific Powers Granted:
${formatValue(data.specificPowers)}
` : ''}

2. EFFECTIVE DATE

This Power of Attorney shall become effective on ${formatDate(data.effectiveDate as string)}${
  data.durability === 'springing' 
    ? ' OR upon my incapacity as certified by my attending physician, whichever occurs first.' 
    : '.'
}

3. DURABILITY

${data.durability === 'durable' 
  ? 'This is a DURABLE Power of Attorney. This Power of Attorney shall not be affected by my subsequent disability or incapacity.'
  : data.durability === 'springing'
  ? 'This is a SPRINGING Power of Attorney. This Power of Attorney shall only become effective upon my incapacity as certified by my attending physician.'
  : 'This is a NON-DURABLE Power of Attorney. This Power of Attorney shall terminate upon my disability or incapacity.'}

${data.expirationDate ? `
4. TERMINATION DATE

This Power of Attorney shall expire on ${formatDate(data.expirationDate as string)}, unless revoked earlier.
` : ''}

5. REVOCATION

I reserve the right to revoke this Power of Attorney at any time by providing written notice to my Agent.

${data.revocationTerms ? `
Additional Revocation Terms:
${formatValue(data.revocationTerms)}
` : ''}

6. THIRD-PARTY RELIANCE

Any third party who receives a copy of this Power of Attorney may rely upon it. Third parties may rely on the Agent's authority until they receive actual notice of revocation or termination.

7. AGENT'S DUTIES

My Agent shall:
(a) Act in my best interest
(b) Act in good faith
(c) Keep my affairs confidential
(d) Keep accurate records of all transactions
(e) Avoid conflicts of interest

8. COMPENSATION

My Agent shall serve [without compensation / with reasonable compensation for services rendered].

9. GOVERNING LAW

This Power of Attorney shall be governed by the laws of ${formatValue(data.governingLaw)}.

IN WITNESS WHEREOF, I have executed this Power of Attorney on this _____ day of _____________, 20____.

PRINCIPAL:

_________________________________
Signature

${formatValue(data.principalName)}
Printed Name


ACCEPTANCE BY AGENT:

I, ${formatValue(data.agentName)}, have read the foregoing Power of Attorney and agree to act as Agent for the Principal in accordance with its terms.

_________________________________
Agent Signature

Date: _____________________________


STATE OF _________________________
COUNTY OF _______________________

Before me, the undersigned notary public, on this _____ day of _____________, 20____, personally appeared ${formatValue(data.principalName)}, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to this instrument, and acknowledged that they executed it.

_________________________________
Notary Public Signature

My Commission Expires: _____________

[NOTARY SEAL]
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPLOYMENT CONTRACT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateEmploymentContent(data: FormData): string {
  return `EMPLOYMENT CONTRACT

This Employment Contract ("Agreement") is entered into as of ${formatDate(data.startDate as string)} by and between:

EMPLOYER:
${formatValue(data.employerName)}
${formatValue(data.employerAddress)}
${data.employerContact ? `HR Contact: ${formatValue(data.employerContact)}` : ''}
${data.employerEmail ? `Email: ${formatValue(data.employerEmail)}` : ''}

AND

EMPLOYEE:
${formatValue(data.employeeName)}
${formatValue(data.employeeAddress)}
Email: ${formatValue(data.employeeEmail)}
${data.employeePhone ? `Phone: ${formatValue(data.employeePhone)}` : ''}

1. POSITION AND DUTIES

Job Title: ${formatValue(data.jobTitle)}
${data.department ? `Department: ${formatValue(data.department)}` : ''}
${data.reportsTo ? `Reports To: ${formatValue(data.reportsTo)}` : ''}

Job Description:
${formatValue(data.jobDescription)}

Work Location: ${formatValue(data.workLocation)}
Remote Work: ${formatValue(data.remoteWork)}

2. TERM OF EMPLOYMENT

Start Date: ${formatDate(data.startDate as string)}
Employment Type: ${formatValue(data.employmentType)}

${data.probationPeriod ? `
Probationary Period: ${formatValue(data.probationPeriod)} months

During the probationary period, either party may terminate this Agreement with [one week's] written notice.
` : ''}

3. COMPENSATION

${data.salaryType === 'hourly' 
  ? `Hourly Wage: ${formatCurrency(data.salaryAmount as string, data.currency as string)} per hour`
  : `Annual Salary: ${formatCurrency(data.salaryAmount as string, data.currency as string)}`}

Pay Frequency: ${formatValue(data.payFrequency)}

${data.bonus ? `
Bonus Structure:
${formatValue(data.bonus)}
` : ''}

4. BENEFITS

${formatValue(data.benefits) || 'Benefits will be provided in accordance with Company policy.'}

5. WORK SCHEDULE

Weekly Hours: ${formatValue(data.workHours)} hours
Schedule: ${formatValue(data.workSchedule)}

${data.overtime ? `
Overtime:
${formatValue(data.overtime)}
` : ''}

6. PAID TIME OFF

Vacation/PTO: ${formatValue(data.ptoPolicy)}
${data.sickLeave ? `Sick Leave: ${formatValue(data.sickLeave)}` : ''}

${data.holidays ? `
Paid Holidays:
${formatValue(data.holidays)}
` : ''}

7. DUTIES AND RESPONSIBILITIES

The Employee agrees to:
(a) Perform all duties associated with the position
(b) Comply with all Company policies and procedures
(c) Devote full working time and attention to the job
(d) Report to work on time and maintain good attendance
(e) Maintain professional conduct at all times

${data.confidentiality ? `
8. CONFIDENTIALITY

The Employee agrees to maintain the confidentiality of all proprietary and confidential information of the Employer. This obligation shall survive termination of employment.
` : ''}

${data.nonCompete ? `
9. NON-COMPETE

During employment and for ${formatValue(data.nonCompetePeriod)} months following termination, the Employee agrees not to:
(a) Work for a direct competitor
(b) Solicit Employer's clients or customers
(c) Recruit Employer's employees

This provision shall be limited to a reasonable geographic area.
` : ''}

${data.ipAssignment ? `
10. INTELLECTUAL PROPERTY

All inventions, designs, and works created by the Employee during employment and related to the Employer's business shall be the sole property of the Employer. The Employee hereby assigns all rights to such intellectual property to the Employer.
` : ''}

11. TERMINATION

This Agreement may be terminated:

By Employer:
- For cause, immediately upon written notice
- Without cause, with ${formatValue(data.terminationNotice)} days' written notice

By Employee:
- With ${formatValue(data.terminationNotice)} days' written notice

Upon termination, Employee shall:
- Return all Company property
- Complete all pending work
- Provide transition assistance as reasonably requested

12. GOVERNING LAW

This Agreement shall be governed by the laws of ${formatValue(data.governingLaw)}.

13. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements and understandings. This Agreement may only be modified in writing signed by both parties.

14. SEVERABILITY

If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

EMPLOYER:

_________________________________
Authorized Signature

_________________________________
Printed Name and Title

Date: _____________________________


EMPLOYEE:

_________________________________
Signature

${formatValue(data.employeeName)}
Printed Name

Date: _____________________________
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// LLC OPERATING AGREEMENT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateLLCContent(data: FormData): string {
  return `OPERATING AGREEMENT
OF
${formatValue(data.companyName).toUpperCase()}
A ${formatValue(data.stateOfFormation).toUpperCase()} LIMITED LIABILITY COMPANY

This Operating Agreement ("Agreement") of ${formatValue(data.companyName)} (the "Company") is entered into as of ${formatDate(data.formationDate as string)} by and among the Members identified herein.

ARTICLE 1: FORMATION AND NAME

1.1 Formation. The Company was formed as a Limited Liability Company under the laws of ${formatValue(data.stateOfFormation)} on ${formatDate(data.formationDate as string)}.

1.2 Name. The name of the Company is: ${formatValue(data.companyName)}

1.3 Principal Place of Business:
${formatValue(data.companyAddress)}

${data.einNumber ? `1.4 Employer Identification Number: ${formatValue(data.einNumber)}` : ''}

ARTICLE 2: PURPOSE

The purpose of the Company is to engage in:
${formatValue(data.businessPurpose)}

and any other lawful business permitted under the laws of ${formatValue(data.stateOfFormation)}.

ARTICLE 3: MEMBERS AND CAPITAL CONTRIBUTIONS

3.1 Initial Members

The initial Members of the Company and their respective ownership interests are:

Member 1:
Name: ${formatValue(data.member1Name)}
Address: ${formatValue(data.member1Address)}
Ownership Percentage: ${formatValue(data.member1Ownership)}%
${data.member1Contribution ? `Initial Capital Contribution: ${formatCurrency(data.member1Contribution as string, 'USD')}` : ''}

${data.member2Name ? `
Member 2:
Name: ${formatValue(data.member2Name)}
Address: ${formatValue(data.member2Address)}
Ownership Percentage: ${formatValue(data.member2Ownership)}%
${data.member2Contribution ? `Initial Capital Contribution: ${formatCurrency(data.member2Contribution as string, 'USD')}` : ''}
` : ''}

${data.additionalMembers ? `
Additional Members:
${formatValue(data.additionalMembers)}
` : ''}

3.2 Additional Capital Contributions

${formatValue(data.additionalCapital) || 'No Member shall be required to make additional capital contributions without unanimous consent of all Members.'}

ARTICLE 4: MANAGEMENT

4.1 Management Type

The Company shall be ${data.managementType === 'member_managed' ? 'MEMBER-MANAGED' : 'MANAGER-MANAGED'}.

${data.managementType === 'manager_managed' && data.managerName ? `
4.2 Manager

The initial Manager of the Company is: ${formatValue(data.managerName)}
` : ''}

4.3 Voting Rights

Voting rights shall be ${data.votingRights === 'ownership' ? 'based on ownership percentage' : 'equal among all Members'}.

4.4 Majority Required

The following majority is required for decisions:
- Ordinary Business Decisions: ${formatValue(data.majorityRequired)}
- Major Decisions (sale of company, adding members, etc.): ${data.majorityRequired === 'unanimous' ? 'Unanimous' : 'Supermajority (>66%)'}

4.5 Meetings

Member meetings shall be held: ${formatValue(data.meetingFrequency)}

ARTICLE 5: ALLOCATIONS AND DISTRIBUTIONS

5.1 Fiscal Year

The fiscal year of the Company shall end on ${formatValue(data.fiscalYearEnd)}.

5.2 Tax Classification

The Company has elected to be classified for federal tax purposes as: ${formatValue(data.taxClassification)}

5.3 Allocation of Profits and Losses

Profits and losses shall be allocated ${data.profitDistribution === 'ownership' ? 'in proportion to each Member\'s ownership percentage' : data.profitDistribution === 'equal' ? 'equally among all Members' : 'according to the following arrangement: [to be specified]'}.

5.4 Distributions

Distributions shall be made: ${formatValue(data.distributionFrequency)}

Distributions shall be made ${data.profitDistribution === 'ownership' ? 'in proportion to each Member\'s ownership percentage' : 'as determined by majority vote of the Members'}.

ARTICLE 6: TRANSFER OF MEMBERSHIP INTERESTS

6.1 Restrictions on Transfer

${data.transferRestrictions === 'approval' 
  ? 'No Member may transfer their membership interest without the prior written consent of all other Members.'
  : data.transferRestrictions === 'rofr'
  ? 'Before any Member may transfer their interest to a third party, the other Members shall have the right of first refusal to purchase the interest on the same terms.'
  : 'Members may freely transfer their membership interests, subject to compliance with applicable securities laws.'}

${data.buyoutProvisions ? `
6.2 Buyout Provisions

${formatValue(data.buyoutProvisions)}
` : ''}

${data.deathDisability ? `
6.3 Death or Disability

${formatValue(data.deathDisability)}
` : ''}

ARTICLE 7: DISSOLUTION

${data.dissolution ? formatValue(data.dissolution) : `
The Company shall be dissolved upon:
(a) The unanimous written consent of all Members
(b) The occurrence of any event that makes it unlawful to continue the business
(c) Any other event specified by law
`}

ARTICLE 8: INDEMNIFICATION

The Company shall indemnify and hold harmless each Member and Manager from any claims arising out of their good faith actions on behalf of the Company.

ARTICLE 9: MISCELLANEOUS

9.1 Entire Agreement

This Agreement constitutes the entire agreement among the Members and supersedes all prior agreements.

9.2 Amendments

This Agreement may be amended only by the written consent of ${data.majorityRequired === 'unanimous' ? 'all Members' : 'a majority of Members'}.

9.3 Governing Law

This Agreement shall be governed by the laws of ${formatValue(data.stateOfFormation)}.

9.4 Severability

If any provision of this Agreement is found to be invalid, the remaining provisions shall remain in full force and effect.

IN WITNESS WHEREOF, the Members have executed this Operating Agreement as of the date first written above.

MEMBER 1:

_________________________________
Signature

${formatValue(data.member1Name)}
Printed Name

Date: _____________________________

${data.member2Name ? `
MEMBER 2:

_________________________________
Signature

${formatValue(data.member2Name)}
Printed Name

Date: _____________________________
` : ''}
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// WILL GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function generateWillContent(data: FormData): string {
  return `LAST WILL AND TESTAMENT
OF
${formatValue(data.testatorName).toUpperCase()}

I, ${formatValue(data.testatorName)}, of ${formatValue(data.testatorCity)}, ${formatValue(data.testatorState)}, ${formatValue(data.testatorCountry)}, being of sound mind and memory, do hereby declare this to be my Last Will and Testament, revoking all previous wills and codicils.

ARTICLE 1: IDENTIFICATION

I declare that:
- My full legal name is: ${formatValue(data.testatorName)}
- My address is: ${formatValue(data.testatorAddress)}
- My date of birth is: ${formatDate(data.testatorDOB as string)}
- My marital status is: ${formatValue(data.maritalStatus)}
${data.maritalStatus === 'married' && data.spouseName ? `- My spouse's name is: ${formatValue(data.spouseName)}` : ''}

ARTICLE 2: EXECUTOR

I appoint ${formatValue(data.executorName)} as the Executor of this Will.

Executor Address: ${formatValue(data.executorAddress)}
${data.executorPhone ? `Executor Phone: ${formatValue(data.executorPhone)}` : ''}
${data.executorRelationship ? `Relationship: ${formatValue(data.executorRelationship)}` : ''}

${data.alternateExecutorName ? `
If ${formatValue(data.executorName)} is unable or unwilling to serve as Executor, I appoint ${formatValue(data.alternateExecutorName)} as alternate Executor.
${data.alternateExecutorAddress ? `Alternate Executor Address: ${formatValue(data.alternateExecutorAddress)}` : ''}
` : ''}

I grant my Executor full power to:
- Collect and manage my estate
- Pay my debts, taxes, and expenses
- Sell, lease, or mortgage property as needed
- Distribute assets according to this Will
- Take any other actions necessary to administer my estate

ARTICLE 3: PAYMENT OF DEBTS AND EXPENSES

I direct my Executor to pay all my legally enforceable debts, funeral expenses, and costs of administering my estate from my residuary estate.

${data.debtsHandling ? `
Special instructions regarding debts:
${formatValue(data.debtsHandling)}
` : ''}

${data.hasMinorChildren ? `
ARTICLE 4: GUARDIAN FOR MINOR CHILDREN

I appoint ${formatValue(data.guardianName)} as the guardian of my minor children.
${data.guardianAddress ? `Guardian Address: ${formatValue(data.guardianAddress)}` : ''}
${data.guardianRelationship ? `Relationship: ${formatValue(data.guardianRelationship)}` : ''}

${data.alternateGuardianName ? `
If ${formatValue(data.guardianName)} is unable or unwilling to serve as guardian, I appoint ${formatValue(data.alternateGuardianName)} as alternate guardian.
` : ''}

${data.childrenNames ? `
My minor children are:
${formatValue(data.childrenNames)}
` : ''}
` : ''}

ARTICLE ${data.hasMinorChildren ? '5' : '4'}: SPECIFIC BEQUESTS

${data.specificBequests ? formatValue(data.specificBequests) : 'I make no specific bequests at this time.'}

ARTICLE ${data.hasMinorChildren ? '6' : '5'}: RESIDUARY ESTATE

I give, devise, and bequeath all the rest, residue, and remainder of my estate, of whatever kind and wherever located (the "Residuary Estate"), to:

${formatValue(data.residuaryBeneficiary)}
${data.residuaryRelationship ? `(${formatValue(data.residuaryRelationship)})` : ''}
Percentage: ${formatValue(data.residuaryPercentage)}%

${data.alternateBeneficiary ? `
If ${formatValue(data.residuaryBeneficiary)} does not survive me, I give my Residuary Estate to:
${formatValue(data.alternateBeneficiary)}
` : ''}

${data.digitalAssets ? `
ARTICLE ${data.hasMinorChildren ? '7' : '6'}: DIGITAL ASSETS

${formatValue(data.digitalAssets)}
` : ''}

ARTICLE ${data.hasMinorChildren ? (data.digitalAssets ? '8' : '7') : (data.digitalAssets ? '7' : '6')}: FINAL WISHES

${data.funeralWishes ? `Funeral/Burial Preference: ${formatValue(data.funeralWishes)}` : ''}

${data.funeralInstructions ? `
${formatValue(data.funeralInstructions)}
` : ''}

${data.additionalWishes ? `
Additional Wishes:
${formatValue(data.additionalWishes)}
` : ''}

ARTICLE ${data.hasMinorChildren ? (data.digitalAssets ? '9' : '8') : (data.digitalAssets ? '8' : '7')}: GENERAL PROVISIONS

1. If any beneficiary does not survive me by thirty (30) days, they shall be deemed to have predeceased me.

2. If any provision of this Will is held invalid, the remaining provisions shall remain in effect.

3. This Will shall be governed by the laws of ${formatValue(data.governingLaw)}.

IN WITNESS WHEREOF, I have signed this Last Will and Testament on this _____ day of _____________, 20____, at ________________________.

_________________________________
${formatValue(data.testatorName)}
Testator


ATTESTATION CLAUSE

We, the undersigned, declare that the person who signed this Will, or asked another to sign for them, did so in our presence, and that we believe them to be of sound mind. We now sign this Will as witnesses in the presence of the Testator and of each other.

WITNESS 1:

_________________________________
Signature

_________________________________
Printed Name

_________________________________
Address

Date: _____________________________


WITNESS 2:

_________________________________
Signature

_________________________________
Printed Name

_________________________________
Address

Date: _____________________________


SELF-PROVING AFFIDAVIT
(Notarization - if required in your state)

STATE OF _________________________
COUNTY OF _______________________

Before me, the undersigned notary public, personally appeared:

${formatValue(data.testatorName)}, the Testator, and
_________________________, and
_________________________, the Witnesses,

known to me to be the Testator and Witnesses whose names are signed to this instrument, and they declared to me that the Testator signed this instrument as their Last Will and that each of the Witnesses, in the presence and at the request of the Testator, signed this Will as witness.

_________________________________
Notary Public

My Commission Expires: _____________

[NOTARY SEAL]
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CONTENT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
export function generateDocumentContent(formType: FormType, formData: FormData): string {
  switch (formType) {
    case 'nda':
      return generateNDAContent(formData);
    case 'contractor':
      return generateContractorContent(formData);
    case 'lease':
      return generateLeaseContent(formData);
    case 'bill_of_sale':
      return generateBillOfSaleContent(formData);
    case 'power_of_attorney':
      return generatePOAContent(formData);
    case 'employment':
      return generateEmploymentContent(formData);
    case 'llc_operating':
      return generateLLCContent(formData);
    case 'will':
      return generateWillContent(formData);
    default:
      throw new Error(`Unknown form type: ${formType}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PDF GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
export function generatePDF(options: PDFOptions): jsPDF {
  const { title, formType, formData, template } = options;
  const content = generateDocumentContent(formType, formData);
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 6;
  const maxWidth = pageWidth - (margin * 2);
  
  let currentY = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        addPageNumber();
      }
      doc.text(line, margin, currentY);
      currentY += lineHeight;
    });
  };

  // Add page numbers
  const addPageNumber = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Add document header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, currentY, { align: 'center' });
  currentY += lineHeight * 2;

  // Add content
  const paragraphs = content.split('\n');
  paragraphs.forEach((paragraph) => {
    if (paragraph.trim() === '') {
      currentY += lineHeight / 2;
    } else if (paragraph.startsWith('ARTICLE') || paragraph.match(/^\d+\./)) {
      currentY += lineHeight / 2;
      addText(paragraph, 11, true);
    } else {
      addText(paragraph, 10);
    }
  });

  // Add page numbers to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Add disclaimer footer on first page
  doc.setPage(1);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const disclaimerText = 'DISCLAIMER: This document is for informational purposes only and does not constitute legal advice.';
  doc.text(disclaimerText, pageWidth / 2, pageHeight - 15, { align: 'center' });

  return doc;
}
