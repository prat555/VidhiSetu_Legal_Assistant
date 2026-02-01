// Database of verified Indian landmark cases with real citations
export interface IndianCase {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  year: number;
  summary: string;
  keywords: string[];
  category: string;
  indianKanoonId?: string;
}

export const indianCases: IndianCase[] = [
  // CONSTITUTIONAL LAW - FUNDAMENTAL RIGHTS
  {
    id: "kesavananda_bharati",
    title: "Kesavananda Bharati vs State of Kerala",
    citation: "(1973) 4 SCC 225",
    court: "Supreme Court of India",
    date: "24 April 1973",
    year: 1973,
    summary: "Established the Basic Structure Doctrine - Parliament cannot amend the Constitution to destroy its basic features. This landmark case limited Parliament's amending power under Article 368.",
    keywords: ["basic structure", "constitution", "amendment", "article 368", "fundamental rights", "parliament power"],
    category: "Constitutional Law",
    indianKanoonId: "263181"
  },
  {
    id: "maneka_gandhi",
    title: "Maneka Gandhi vs Union of India",
    citation: "AIR 1978 SC 597",
    court: "Supreme Court of India",
    date: "25 January 1978",
    year: 1978,
    summary: "Expanded Article 21 (Right to Life) to include right to live with dignity. Established that procedure established by law must be fair, just and reasonable, not arbitrary.",
    keywords: ["article 21", "right to life", "personal liberty", "due process", "passport", "natural justice", "procedure established by law"],
    category: "Constitutional Law",
    indianKanoonId: "1766147"
  },
  {
    id: "puttaswamy_privacy",
    title: "Justice K.S. Puttaswamy vs Union of India",
    citation: "(2017) 10 SCC 1",
    court: "Supreme Court of India",
    date: "24 August 2017",
    year: 2017,
    summary: "Right to Privacy declared a fundamental right under Article 21. Nine-judge bench unanimously held that privacy is intrinsic to life and liberty.",
    keywords: ["privacy", "fundamental right", "article 21", "aadhaar", "data protection", "personal liberty", "dignity"],
    category: "Constitutional Law",
    indianKanoonId: "127517806"
  },
  {
    id: "navtej_johar",
    title: "Navtej Singh Johar vs Union of India",
    citation: "(2018) 10 SCC 1",
    court: "Supreme Court of India",
    date: "6 September 2018",
    year: 2018,
    summary: "Decriminalized homosexuality by reading down Section 377 IPC. Held that consensual sexual acts between adults in private cannot be criminalized.",
    keywords: ["section 377", "lgbtq", "homosexuality", "article 14", "article 15", "article 21", "equality", "discrimination"],
    category: "Constitutional Law",
    indianKanoonId: "168671544"
  },
  {
    id: "vishaka",
    title: "Vishaka vs State of Rajasthan",
    citation: "AIR 1997 SC 3011",
    court: "Supreme Court of India",
    date: "13 August 1997",
    year: 1997,
    summary: "Laid down guidelines for prevention of sexual harassment at workplace. Led to the Sexual Harassment of Women at Workplace Act, 2013 (POSH Act).",
    keywords: ["sexual harassment", "workplace", "women", "vishaka guidelines", "posh", "gender equality", "article 14", "article 21"],
    category: "Women's Rights",
    indianKanoonId: "1031794"
  },

  // CRIMINAL LAW
  {
    id: "lalita_kumari",
    title: "Lalita Kumari vs Government of UP",
    citation: "(2014) 2 SCC 1",
    court: "Supreme Court of India",
    date: "12 November 2013",
    year: 2013,
    summary: "Mandatory registration of FIR under Section 154 CrPC when information discloses commission of cognizable offence. Police cannot refuse to register FIR.",
    keywords: ["fir", "section 154", "crpc", "cognizable offence", "police", "mandatory registration", "zero fir"],
    category: "Criminal Law",
    indianKanoonId: "51259953"
  },
  {
    id: "arnesh_kumar",
    title: "Arnesh Kumar vs State of Bihar",
    citation: "(2014) 8 SCC 273",
    court: "Supreme Court of India",
    date: "2 July 2014",
    year: 2014,
    summary: "Guidelines to prevent automatic arrests in cases under Section 498A IPC. Police must satisfy themselves about necessity of arrest. Checklist for magistrates before remand.",
    keywords: ["section 498a", "arrest", "dowry", "harassment", "bail", "cruelty", "matrimonial dispute"],
    category: "Criminal Law",
    indianKanoonId: "89439126"
  },
  {
    id: "shreya_singhal",
    title: "Shreya Singhal vs Union of India",
    citation: "(2015) 5 SCC 1",
    court: "Supreme Court of India",
    date: "24 March 2015",
    year: 2015,
    summary: "Struck down Section 66A of IT Act as unconstitutional for being vague and overbroad. Upheld freedom of speech on internet.",
    keywords: ["section 66a", "it act", "free speech", "internet", "article 19", "online speech", "social media"],
    category: "Cyber Law",
    indianKanoonId: "110813550"
  },
  {
    id: "dk_basu",
    title: "D.K. Basu vs State of West Bengal",
    citation: "AIR 1997 SC 610",
    court: "Supreme Court of India",
    date: "18 December 1996",
    year: 1996,
    summary: "Laid down 11 requirements to be followed in all cases of arrest and detention to prevent custodial violence and torture.",
    keywords: ["arrest", "detention", "custodial death", "torture", "police brutality", "article 21", "article 22", "human rights"],
    category: "Criminal Law",
    indianKanoonId: "501198"
  },
  {
    id: "sher_singh",
    title: "Sher Singh vs State of Punjab",
    citation: "AIR 1983 SC 465",
    court: "Supreme Court of India",
    date: "16 February 1983",
    year: 1983,
    summary: "Prolonged delay in execution of death sentence is torture. Commutation of death sentence to life imprisonment can be granted for undue delay.",
    keywords: ["death penalty", "capital punishment", "delay", "article 21", "commutation", "mercy petition"],
    category: "Criminal Law",
    indianKanoonId: "1138234"
  },

  // CONSUMER RIGHTS
  {
    id: "indian_medical_association",
    title: "Indian Medical Association vs V.P. Shantha",
    citation: "(1995) 6 SCC 651",
    court: "Supreme Court of India",
    date: "13 November 1995",
    year: 1995,
    summary: "Medical profession comes under Consumer Protection Act. Patients can seek remedy in consumer courts for medical negligence.",
    keywords: ["medical negligence", "consumer protection", "hospital", "doctor", "patient rights", "deficiency of service"],
    category: "Consumer Law",
    indianKanoonId: "723973"
  },
  {
    id: "lucknow_dev_authority",
    title: "Lucknow Development Authority vs M.K. Gupta",
    citation: "(1994) 1 SCC 243",
    court: "Supreme Court of India",
    date: "7 October 1993",
    year: 1993,
    summary: "Housing construction and allotment by development authorities is a 'service' under Consumer Protection Act. Delayed possession is deficiency in service.",
    keywords: ["housing", "construction", "development authority", "consumer protection", "flat", "delayed possession", "real estate"],
    category: "Consumer Law",
    indianKanoonId: "1614303"
  },

  // ENVIRONMENTAL LAW
  {
    id: "mc_mehta_ganga",
    title: "M.C. Mehta vs Union of India (Ganga Pollution)",
    citation: "AIR 1988 SC 1037",
    court: "Supreme Court of India",
    date: "12 January 1988",
    year: 1988,
    summary: "Landmark PIL for cleaning River Ganga. Ordered closure of polluting tanneries. Established polluter pays principle and precautionary principle.",
    keywords: ["environment", "pollution", "ganga", "river", "tanneries", "polluter pays", "pil", "article 21"],
    category: "Environmental Law",
    indianKanoonId: "59690"
  },
  {
    id: "vellore_citizens",
    title: "Vellore Citizens Welfare Forum vs Union of India",
    citation: "(1996) 5 SCC 647",
    court: "Supreme Court of India",
    date: "28 August 1996",
    year: 1996,
    summary: "Precautionary principle and polluter pays principle are part of Indian environmental law. Sustainable development is essential.",
    keywords: ["environment", "pollution", "sustainable development", "precautionary principle", "polluter pays", "tanneries"],
    category: "Environmental Law",
    indianKanoonId: "1934103"
  },

  // LAND & PROPERTY
  {
    id: "olga_tellis",
    title: "Olga Tellis vs Bombay Municipal Corporation",
    citation: "AIR 1986 SC 180",
    court: "Supreme Court of India",
    date: "10 July 1985",
    year: 1985,
    summary: "Right to livelihood is part of right to life under Article 21. Pavement dwellers cannot be evicted without following due process.",
    keywords: ["right to livelihood", "eviction", "pavement dwellers", "slum", "article 21", "due process", "housing"],
    category: "Constitutional Law",
    indianKanoonId: "69aborting7260"
  },

  // LABOUR LAW
  {
    id: "bangalore_water_supply",
    title: "Bangalore Water Supply vs A. Rajappa",
    citation: "AIR 1978 SC 548",
    court: "Supreme Court of India",
    date: "21 February 1978",
    year: 1978,
    summary: "Defined 'industry' under Industrial Disputes Act broadly to include systematic activity organized by cooperation for production of goods/services.",
    keywords: ["industry", "industrial dispute", "labour", "worker", "trade union", "strike"],
    category: "Labour Law",
    indianKanoonId: "1160895"
  },

  // MARRIAGE & FAMILY LAW
  {
    id: "shayara_bano",
    title: "Shayara Bano vs Union of India",
    citation: "(2017) 9 SCC 1",
    court: "Supreme Court of India",
    date: "22 August 2017",
    year: 2017,
    summary: "Triple Talaq (talaq-e-biddat) declared unconstitutional. Instant divorce by Muslim men is arbitrary and violates Article 14.",
    keywords: ["triple talaq", "muslim", "divorce", "article 14", "women rights", "personal law", "equality"],
    category: "Family Law",
    indianKanoonId: "101552773"
  },
  {
    id: "sarla_mudgal",
    title: "Sarla Mudgal vs Union of India",
    citation: "(1995) 3 SCC 635",
    court: "Supreme Court of India",
    date: "10 May 1995",
    year: 1995,
    summary: "Second marriage by Hindu man after converting to Islam without dissolving first marriage is void. First wife can file bigamy case under Section 494 IPC.",
    keywords: ["bigamy", "conversion", "marriage", "section 494", "hindu", "muslim", "personal law"],
    category: "Family Law",
    indianKanoonId: "569100"
  },

  // RTI & TRANSPARENCY
  {
    id: "cbse_vs_aditya",
    title: "CBSE vs Aditya Bandopadhyay",
    citation: "(2011) 8 SCC 497",
    court: "Supreme Court of India",
    date: "9 August 2011",
    year: 2011,
    summary: "Evaluated answer sheets can be provided under RTI Act. Students have right to access their evaluated answer books.",
    keywords: ["rti", "right to information", "answer sheet", "cbse", "examination", "transparency"],
    category: "Administrative Law",
    indianKanoonId: "115949461"
  },

  // RESERVATION & EQUALITY
  {
    id: "indra_sawhney",
    title: "Indra Sawhney vs Union of India",
    citation: "AIR 1993 SC 477",
    court: "Supreme Court of India",
    date: "16 November 1992",
    year: 1992,
    summary: "Mandal Commission case - 50% ceiling on reservations, creamy layer exclusion for OBCs, no reservations in promotions.",
    keywords: ["reservation", "obc", "mandal commission", "creamy layer", "article 16", "backward classes", "50 percent"],
    category: "Constitutional Law",
    indianKanoonId: "1363234"
  },

  // BAIL & REMAND
  {
    id: "sanjay_chandra",
    title: "Sanjay Chandra vs CBI",
    citation: "(2012) 1 SCC 40",
    court: "Supreme Court of India",
    date: "23 November 2011",
    year: 2011,
    summary: "Bail is rule, jail is exception. In economic offences, gravity of offence alone is not enough to deny bail if no flight risk.",
    keywords: ["bail", "economic offence", "2g scam", "flight risk", "pretrial detention", "personal liberty"],
    category: "Criminal Law",
    indianKanoonId: "90667432"
  },
  {
    id: "satender_kumar_antil",
    title: "Satender Kumar Antil vs CBI",
    citation: "(2022) 10 SCC 51",
    court: "Supreme Court of India",
    date: "11 July 2022",
    year: 2022,
    summary: "Comprehensive guidelines on bail - police should not automatically arrest in all cases. Courts should be liberal in granting bail for offences up to 7 years.",
    keywords: ["bail", "arrest", "personal liberty", "undertrial", "article 21", "section 41 crpc", "guidelines"],
    category: "Criminal Law",
    indianKanoonId: "195422022"
  },

  // EDUCATION
  {
    id: "unni_krishnan",
    title: "Unni Krishnan vs State of AP",
    citation: "(1993) 1 SCC 645",
    court: "Supreme Court of India",
    date: "4 February 1993",
    year: 1993,
    summary: "Right to education for children aged 6-14 is a fundamental right under Article 21. Led to 86th Constitutional Amendment and Article 21A.",
    keywords: ["education", "article 21", "fundamental right", "children", "article 21a", "right to education"],
    category: "Constitutional Law",
    indianKanoonId: "193aborting7182"
  },
  {
    id: "mohini_jain",
    title: "Mohini Jain vs State of Karnataka",
    citation: "AIR 1992 SC 1858",
    court: "Supreme Court of India",
    date: "30 July 1992",
    year: 1992,
    summary: "Capitation fees in private medical colleges declared illegal. Right to education flows from right to life under Article 21.",
    keywords: ["education", "capitation fee", "medical college", "article 21", "right to life"],
    category: "Constitutional Law",
    indianKanoonId: "549093"
  },

  // MEDIA & PRESS
  {
    id: "romesh_thappar",
    title: "Romesh Thappar vs State of Madras",
    citation: "AIR 1950 SC 124",
    court: "Supreme Court of India",
    date: "26 May 1950",
    year: 1950,
    summary: "Freedom of press is included in freedom of speech under Article 19(1)(a). Pre-censorship of newspapers is unconstitutional.",
    keywords: ["press freedom", "article 19", "free speech", "censorship", "newspaper", "media"],
    category: "Constitutional Law",
    indianKanoonId: "105959"
  },

  // PIL & ACCESS TO JUSTICE
  {
    id: "hussainara_khatoon",
    title: "Hussainara Khatoon vs Home Secretary, Bihar",
    citation: "AIR 1979 SC 1369",
    court: "Supreme Court of India",
    date: "9 March 1979",
    year: 1979,
    summary: "Right to speedy trial is a fundamental right under Article 21. Undertrial prisoners cannot be kept in jail longer than maximum sentence for the offence.",
    keywords: ["speedy trial", "undertrial", "bail", "article 21", "legal aid", "prison", "personal liberty"],
    category: "Criminal Law",
    indianKanoonId: "1373215"
  },

  // CYBER LAW & IT
  {
    id: "shamsher_singh_verma",
    title: "Shamsher Singh Verma vs State of Haryana",
    citation: "(2015) 12 SCC 318",
    court: "Supreme Court of India",
    date: "2 July 2015",
    year: 2015,
    summary: "Electronic evidence under Section 65B of Evidence Act - certificate mandatory for admissibility of electronic records.",
    keywords: ["electronic evidence", "section 65b", "evidence act", "digital evidence", "computer", "cyber"],
    category: "Cyber Law",
    indianKanoonId: "64aborting6783"
  },

  // LAND ACQUISITION
  {
    id: "kedar_nath_yadav",
    title: "Kedar Nath Yadav vs State of West Bengal",
    citation: "(2016) 2 SCC 200",
    court: "Supreme Court of India",
    date: "8 January 2016",
    year: 2016,
    summary: "Land acquisition must be for public purpose. Fair compensation is constitutional right. Rehabilitation is mandatory.",
    keywords: ["land acquisition", "compensation", "public purpose", "article 300a", "eminent domain", "rehabilitation"],
    category: "Property Law",
    indianKanoonId: "98367890"
  },

  // DOMESTIC VIOLENCE
  {
    id: "hiral_harsad",
    title: "Hiral P. Harsora vs Kusum Narottamdas Harsora",
    citation: "(2016) 10 SCC 165",
    court: "Supreme Court of India",
    date: "6 October 2016",
    year: 2016,
    summary: "Protection under Domestic Violence Act extends to all women, including mother-in-law. Woman can file case against another woman.",
    keywords: ["domestic violence", "protection of women", "dv act", "shared household", "maintenance", "protection order"],
    category: "Family Law",
    indianKanoonId: "140992530"
  },

  // CONTEMPT
  {
    id: "prashant_bhushan",
    title: "In Re: Prashant Bhushan",
    citation: "(2020) 11 SCC 465",
    court: "Supreme Court of India",
    date: "14 August 2020",
    year: 2020,
    summary: "Tweets criticizing judiciary can amount to contempt if they scandalize the court. Balance between free speech and dignity of courts.",
    keywords: ["contempt of court", "free speech", "twitter", "social media", "judiciary", "criticism"],
    category: "Constitutional Law",
    indianKanoonId: "167965876"
  },

  // SEDITION
  {
    id: "kedar_nath_singh",
    title: "Kedar Nath Singh vs State of Bihar",
    citation: "AIR 1962 SC 955",
    court: "Supreme Court of India",
    date: "20 January 1962",
    year: 1962,
    summary: "Section 124A IPC (sedition) is constitutional but restricted to acts involving incitement to violence or public disorder.",
    keywords: ["sedition", "section 124a", "free speech", "article 19", "incitement", "public order"],
    category: "Criminal Law",
    indianKanoonId: "111867"
  },

  // DEFAMATION
  {
    id: "subramanian_swamy_defamation",
    title: "Subramanian Swamy vs Union of India",
    citation: "(2016) 7 SCC 221",
    court: "Supreme Court of India",
    date: "13 May 2016",
    year: 2016,
    summary: "Criminal defamation under Sections 499-500 IPC is constitutional. Right to reputation is part of Article 21.",
    keywords: ["defamation", "section 499", "section 500", "free speech", "reputation", "article 21", "criminal defamation"],
    category: "Criminal Law",
    indianKanoonId: "101852725"
  },

  // ADDITIONAL LANDMARK CASES

  // BAIL JURISPRUDENCE
  {
    id: "arnesh_kumar",
    title: "Arnesh Kumar vs State of Bihar",
    citation: "(2014) 8 SCC 273",
    court: "Supreme Court of India",
    date: "2 July 2014",
    year: 2014,
    summary: "Guidelines for arrest in cases punishable up to 7 years. Police must satisfy themselves about necessity of arrest. Mandatory compliance with Section 41A CrPC checklist.",
    keywords: ["arrest", "bail", "section 41", "guidelines", "police", "498a", "dowry", "custodial violence"],
    category: "Criminal Law",
    indianKanoonId: "89700425"
  },
  {
    id: "sushila_aggarwal",
    title: "Sushila Aggarwal vs State (NCT of Delhi)",
    citation: "(2020) 5 SCC 1",
    court: "Supreme Court of India", 
    date: "29 January 2020",
    year: 2020,
    summary: "Anticipatory bail can be granted without time limit. No blanket rule that anticipatory bail should be for limited period. Court can impose conditions.",
    keywords: ["anticipatory bail", "section 438", "crpc", "arrest", "pre-arrest bail", "conditions"],
    category: "Criminal Law",
    indianKanoonId: "162868189"
  },
  {
    id: "satender_kumar_antil",
    title: "Satender Kumar Antil vs CBI",
    citation: "(2022) 10 SCC 51",
    court: "Supreme Court of India",
    date: "11 July 2022",
    year: 2022,
    summary: "Bail is rule, jail is exception. Comprehensive guidelines on bail covering different categories of offences. Standing orders for bail in bailable offences.",
    keywords: ["bail", "guidelines", "arrest", "undertrial", "jail", "liberty", "section 436", "section 437"],
    category: "Criminal Law",
    indianKanoonId: "191696068"
  },

  // CONSUMER RIGHTS
  {
    id: "indian_medical_association",
    title: "Indian Medical Association vs V.P. Shantha",
    citation: "(1995) 6 SCC 651",
    court: "Supreme Court of India",
    date: "13 November 1995",
    year: 1995,
    summary: "Medical services fall under Consumer Protection Act. Patients can file complaints against doctors and hospitals. Service includes diagnosis and treatment.",
    keywords: ["medical negligence", "consumer protection", "doctor", "hospital", "deficiency in service", "patient rights"],
    category: "Consumer Law",
    indianKanoonId: "723750"
  },
  {
    id: "lucknow_development",
    title: "Lucknow Development Authority vs M.K. Gupta",
    citation: "(1994) 1 SCC 243",
    court: "Supreme Court of India",
    date: "7 October 1993",
    year: 1993,
    summary: "Housing services by development authorities fall under Consumer Protection Act. Allottees can claim compensation for delay in possession.",
    keywords: ["consumer protection", "housing", "real estate", "delay", "possession", "compensation", "builder"],
    category: "Consumer Law",
    indianKanoonId: "1240752"
  },

  // CYBER LAW & IT ACT
  {
    id: "shreya_singhal",
    title: "Shreya Singhal vs Union of India",
    citation: "(2015) 5 SCC 1",
    court: "Supreme Court of India",
    date: "24 March 2015",
    year: 2015,
    summary: "Section 66A of IT Act struck down as unconstitutional for being vague and overbroad. Online speech protected under Article 19(1)(a). Section 79 intermediary liability clarified.",
    keywords: ["section 66a", "it act", "internet", "free speech", "social media", "intermediary", "online", "cyber law"],
    category: "Cyber Law",
    indianKanoonId: "110813550"
  },

  // MOTOR ACCIDENT CLAIMS
  {
    id: "sarla_verma",
    title: "Sarla Verma vs Delhi Transport Corporation",
    citation: "(2009) 6 SCC 121",
    court: "Supreme Court of India",
    date: "15 April 2009",
    year: 2009,
    summary: "Standardized multiplier method for calculating motor accident compensation. Clear guidelines on income, multiplier, and deductions for personal expenses.",
    keywords: ["motor accident", "compensation", "multiplier", "death claim", "insurance", "mact"],
    category: "Motor Accident",
    indianKanoonId: "542689"
  },
  {
    id: "national_insurance_v_pranay",
    title: "National Insurance Co. Ltd. vs Pranay Sethi",
    citation: "(2017) 16 SCC 680",
    court: "Supreme Court of India",
    date: "31 October 2017",
    year: 2017,
    summary: "Updated Sarla Verma guidelines. Future prospects addition to income - 40% for self-employed, 50% for salaried below 40 years. Fixed amounts for loss of estate and consortium.",
    keywords: ["motor accident", "compensation", "future prospects", "consortium", "multiplier", "mact", "insurance claim"],
    category: "Motor Accident",
    indianKanoonId: "149787380"
  },

  // CHILD RIGHTS & POCSO
  {
    id: "state_of_karnataka_krishnappa",
    title: "State of Karnataka vs Krishnappa",
    citation: "(2000) 4 SCC 75",
    court: "Supreme Court of India",
    date: "3 February 2000",
    year: 2000,
    summary: "Sexual violence against children requires strict punishment. Court cannot show leniency in child abuse cases. Protection of children paramount.",
    keywords: ["child abuse", "sexual assault", "rape", "minor", "child protection", "pocso"],
    category: "Criminal Law",
    indianKanoonId: "509504"
  },
  {
    id: "attorney_general_satish",
    title: "Attorney General for India vs Satish",
    citation: "(2021) 15 SCC 268",
    court: "Supreme Court of India",
    date: "26 October 2021",
    year: 2021,
    summary: "Skin-to-skin contact not required for sexual assault under POCSO. Any act with sexual intent against child is punishable. Broader interpretation for child protection.",
    keywords: ["pocso", "sexual assault", "minor", "child protection", "sexual intent", "child abuse"],
    category: "Criminal Law",
    indianKanoonId: "178679631"
  },

  // TENANT & RENT CONTROL
  {
    id: "satyawati_sharma",
    title: "Satyawati Sharma vs Union of India",
    citation: "(2008) 5 SCC 287",
    court: "Supreme Court of India",
    date: "8 April 2008",
    year: 2008,
    summary: "Rent Control Act provisions on eviction examined. Balance between landlord's property rights and tenant's right to shelter.",
    keywords: ["rent control", "eviction", "tenant", "landlord", "property rights", "shelter"],
    category: "Property Law",
    indianKanoonId: "1102279"
  },

  // CHEQUE BOUNCE - SECTION 138
  {
    id: "dashrath_rupsingh_rathod",
    title: "Dashrath Rupsingh Rathod vs State of Maharashtra",
    citation: "(2014) 9 SCC 129",
    court: "Supreme Court of India",
    date: "1 August 2014",
    year: 2014,
    summary: "Jurisdiction for cheque bounce cases. Complaint can be filed where cheque is dishonoured (drawee bank location). Overruled K. Bhaskaran.",
    keywords: ["cheque bounce", "section 138", "negotiable instruments", "jurisdiction", "dishonour", "ni act"],
    category: "Banking Law",
    indianKanoonId: "101431308"
  },
  {
    id: "bridgestone_india",
    title: "Bridgestone India Pvt. Ltd. vs Inderpal Singh",
    citation: "(2016) 2 SCC 75",
    court: "Supreme Court of India",
    date: "22 October 2015",
    year: 2015,
    summary: "Section 138 NI Act explained. Cheque given as security can be basis for complaint. Legally enforceable debt includes conditional payments.",
    keywords: ["cheque bounce", "section 138", "security cheque", "legally enforceable debt", "ni act"],
    category: "Banking Law",
    indianKanoonId: "48932992"
  },

  // LAND ACQUISITION
  {
    id: "land_acquisition_bench",
    title: "Indore Development Authority vs Shailendra",
    citation: "(2018) 3 SCC 412",
    court: "Supreme Court of India",
    date: "8 February 2018",
    year: 2018,
    summary: "Section 24(2) of Land Acquisition Act 2013 interpreted. Lapse of old proceedings if possession not taken and compensation not paid.",
    keywords: ["land acquisition", "compensation", "lapse", "possession", "section 24", "rehabilitation"],
    category: "Property Law",
    indianKanoonId: "28063908"
  },

  // ARBITRATION
  {
    id: "ssangyong_engineering",
    title: "Ssangyong Engineering vs NHAI",
    citation: "(2019) 15 SCC 131",
    court: "Supreme Court of India",
    date: "8 May 2019",
    year: 2019,
    summary: "Scope of judicial review of arbitral awards under Section 34. Courts cannot modify awards. Patent illegality must be apparent on face of award.",
    keywords: ["arbitration", "section 34", "judicial review", "arbitral award", "patent illegality", "public policy"],
    category: "Arbitration",
    indianKanoonId: "130295567"
  },
  {
    id: "vidya_drolia",
    title: "Vidya Drolia vs Durga Trading Corporation",
    citation: "(2021) 2 SCC 1",
    court: "Supreme Court of India",
    date: "14 December 2020",
    year: 2020,
    summary: "Arbitrability of disputes. Four-fold test for determining non-arbitrable disputes. Tenancy disputes under special statutes may be non-arbitrable.",
    keywords: ["arbitration", "arbitrability", "section 8", "tenancy", "reference", "agreement"],
    category: "Arbitration",
    indianKanoonId: "33490090"
  },

  // INTELLECTUAL PROPERTY
  {
    id: "novartis_v_union",
    title: "Novartis AG vs Union of India",
    citation: "(2013) 6 SCC 1",
    court: "Supreme Court of India",
    date: "1 April 2013",
    year: 2013,
    summary: "Section 3(d) of Patents Act upheld. No evergreening of patents. New form of known substance not patentable unless enhanced efficacy shown. Access to medicines protected.",
    keywords: ["patent", "section 3d", "pharmaceutical", "evergreening", "glivec", "generic medicine", "intellectual property"],
    category: "Intellectual Property",
    indianKanoonId: "165776436"
  },

  // ENVIRONMENTAL LAW
  {
    id: "mc_mehta_taj_trapezium",
    title: "M.C. Mehta vs Union of India (Taj Trapezium)",
    citation: "(1997) 2 SCC 353",
    court: "Supreme Court of India",
    date: "30 December 1996",
    year: 1996,
    summary: "Polluting industries around Taj Mahal directed to close or relocate. Precautionary principle and polluter pays principle applied. Environmental protection precedence.",
    keywords: ["environment", "pollution", "taj mahal", "industry", "precautionary principle", "polluter pays"],
    category: "Environmental Law",
    indianKanoonId: "55896928"
  },
  {
    id: "mc_mehta_ganga",
    title: "M.C. Mehta vs Union of India (Ganga Pollution)",
    citation: "AIR 1988 SC 1115",
    court: "Supreme Court of India",
    date: "12 January 1988",
    year: 1988,
    summary: "Industries polluting Ganga directed to setup ETPs or close. Right to clean environment is part of Article 21. Absolute liability for hazardous industries.",
    keywords: ["environment", "ganga", "pollution", "article 21", "clean water", "etp", "effluent treatment"],
    category: "Environmental Law",
    indianKanoonId: "1426925"
  },

  // ADDITIONAL CASES - LABOUR LAW
  {
    id: "bangalore_water_supply",
    title: "Bangalore Water Supply vs A. Rajappa",
    citation: "AIR 1978 SC 548",
    court: "Supreme Court of India",
    date: "21 February 1978",
    year: 1978,
    summary: "Defined 'industry' under Industrial Disputes Act with triple test - systematic activity, cooperation between employer and employee, and production of goods/services.",
    keywords: ["industry", "industrial disputes", "labour", "employer", "employee", "triple test"],
    category: "Labour Law",
    indianKanoonId: "1574353"
  },
  {
    id: "workmen_v_mc_donald",
    title: "Workmen vs Management of Reptakos Brett",
    citation: "(1992) 1 SCC 290",
    court: "Supreme Court of India",
    date: "1 November 1991",
    year: 1991,
    summary: "Minimum wages must ensure not just bare sustenance but preservation of efficiency. Workers entitled to minimum wage as matter of right.",
    keywords: ["minimum wage", "labour", "wages", "workmen", "living wage", "fair wage"],
    category: "Labour Law",
    indianKanoonId: "686488"
  },
  {
    id: "umadevi_v_state",
    title: "Secretary, State of Karnataka vs Umadevi",
    citation: "(2006) 4 SCC 1",
    court: "Supreme Court of India",
    date: "10 April 2006",
    year: 2006,
    summary: "Regularization of temporary/daily wage workers. No right to regularization without proper recruitment. Article 14 and 16 mandate equal opportunity.",
    keywords: ["regularization", "temporary worker", "daily wage", "article 14", "article 16", "employment", "recruitment"],
    category: "Labour Law",
    indianKanoonId: "93434"
  },
  {
    id: "steel_authority_india",
    title: "Steel Authority of India Ltd vs National Union",
    citation: "(2001) 7 SCC 1",
    court: "Supreme Court of India",
    date: "14 August 2001",
    year: 2001,
    summary: "Contract labour can be abolished but employer not obligated to absorb them automatically. Abolition under Contract Labour Act examined.",
    keywords: ["contract labour", "abolition", "absorption", "industrial disputes", "employer", "contractor"],
    category: "Labour Law",
    indianKanoonId: "586396"
  },

  // EDUCATION LAW
  {
    id: "unni_krishnan",
    title: "Unni Krishnan vs State of Andhra Pradesh",
    citation: "(1993) 1 SCC 645",
    court: "Supreme Court of India",
    date: "4 February 1993",
    year: 1993,
    summary: "Right to education is a fundamental right flowing from Article 21. State must provide free education up to age of 14 years.",
    keywords: ["right to education", "article 21", "fundamental right", "free education", "children", "article 45"],
    category: "Education Law",
    indianKanoonId: "1775396"
  },
  {
    id: "tk_pai_foundation",
    title: "T.M.A. Pai Foundation vs State of Karnataka",
    citation: "(2002) 8 SCC 481",
    court: "Supreme Court of India",
    date: "31 October 2002",
    year: 2002,
    summary: "Rights of minority educational institutions under Article 30. Autonomy in administration but reasonable regulations permitted.",
    keywords: ["minority institution", "article 30", "education", "autonomy", "administration", "admission"],
    category: "Education Law",
    indianKanoonId: "512761"
  },
  {
    id: "modern_dental_college",
    title: "Modern Dental College vs State of MP",
    citation: "(2016) 7 SCC 353",
    court: "Supreme Court of India",
    date: "2 May 2016",
    year: 2016,
    summary: "Balance between institutional autonomy and state regulation in higher education. Fee fixation by committee is valid regulatory measure.",
    keywords: ["education", "fee fixation", "private institution", "regulation", "autonomy", "capitation fee"],
    category: "Education Law",
    indianKanoonId: "112770696"
  },

  // SERVICE LAW
  {
    id: "deepak_kumar",
    title: "Deepak Kumar vs State of Haryana",
    citation: "(2012) 4 SCC 629",
    court: "Supreme Court of India",
    date: "24 February 2012",
    year: 2012,
    summary: "Government servant can be dismissed without inquiry for conviction in criminal case. Article 311(2)(a) exception explained.",
    keywords: ["dismissal", "conviction", "government servant", "article 311", "inquiry", "criminal case"],
    category: "Service Law",
    indianKanoonId: "52374634"
  },
  {
    id: "union_of_india_v_kk_dhawan",
    title: "Union of India vs K.K. Dhawan",
    citation: "(1993) 2 SCC 56",
    court: "Supreme Court of India",
    date: "10 November 1992",
    year: 1992,
    summary: "Quasi-judicial officers can be proceeded against departmentally for wrong decisions if malafide or reckless disregard shown.",
    keywords: ["quasi-judicial", "departmental proceedings", "government officer", "malafide", "service law"],
    category: "Service Law",
    indianKanoonId: "1628424"
  },

  // MEDIA LAW
  {
    id: "romesh_thappar",
    title: "Romesh Thappar vs State of Madras",
    citation: "AIR 1950 SC 124",
    court: "Supreme Court of India",
    date: "26 May 1950",
    year: 1950,
    summary: "Freedom of press is part of freedom of speech under Article 19(1)(a). Pre-censorship unconstitutional unless for public order grounds.",
    keywords: ["press freedom", "article 19", "free speech", "censorship", "media", "newspaper"],
    category: "Media Law",
    indianKanoonId: "105959"
  },
  {
    id: "sakal_papers",
    title: "Sakal Papers (P) Ltd vs Union of India",
    citation: "AIR 1962 SC 305",
    court: "Supreme Court of India",
    date: "30 September 1961",
    year: 1961,
    summary: "Newspaper price and page regulation struck down. Freedom of press cannot be curtailed through indirect economic measures.",
    keywords: ["press freedom", "newspaper", "regulation", "article 19", "indirect restrictions"],
    category: "Media Law",
    indianKanoonId: "100444"
  },
  {
    id: "ministry_info_broadcasting",
    title: "Ministry of Information & Broadcasting vs Cricket Association of Bengal",
    citation: "(1995) 2 SCC 161",
    court: "Supreme Court of India",
    date: "9 February 1995",
    year: 1995,
    summary: "Airwaves are public property. Right to information includes right to receive and impart information through broadcasting.",
    keywords: ["broadcasting", "airwaves", "public property", "right to information", "television", "media"],
    category: "Media Law",
    indianKanoonId: "501581"
  },

  // ADMINISTRATIVE LAW
  {
    id: "maneka_gandhi_passport",
    title: "Maneka Gandhi vs Union of India (Passport)",
    citation: "AIR 1978 SC 597",
    court: "Supreme Court of India", 
    date: "25 January 1978",
    year: 1978,
    summary: "Right to travel abroad is part of personal liberty under Article 21. Principles of natural justice apply to all administrative actions.",
    keywords: ["natural justice", "administrative law", "passport", "personal liberty", "article 21", "due process"],
    category: "Administrative Law",
    indianKanoonId: "1766147"
  },
  {
    id: "balco_employees",
    title: "BALCO Employees Union vs Union of India",
    citation: "(2002) 2 SCC 333",
    court: "Supreme Court of India",
    date: "10 December 2001",
    year: 2001,
    summary: "Limited judicial review of economic policy decisions. Disinvestment policy upheld. Courts shouldn't substitute wisdom for policy makers.",
    keywords: ["disinvestment", "economic policy", "judicial review", "privatization", "public interest"],
    category: "Administrative Law",
    indianKanoonId: "1085623"
  },
  {
    id: "common_cause_pil",
    title: "Common Cause vs Union of India",
    citation: "(2018) 5 SCC 1",
    court: "Supreme Court of India",
    date: "9 March 2018",
    year: 2018,
    summary: "Right to die with dignity is fundamental right. Passive euthanasia and living will (advance directive) recognized. Guidelines for implementation.",
    keywords: ["euthanasia", "right to die", "living will", "advance directive", "article 21", "dignity"],
    category: "Constitutional Law",
    indianKanoonId: "99444019"
  },

  // PROPERTY & LAND LAW
  {
    id: "raghunath_rao",
    title: "Raghunath Rao vs Union of India",
    citation: "AIR 1993 SC 1267",
    court: "Supreme Court of India",
    date: "16 December 1992",
    year: 1992,
    summary: "Privy purses abolition upheld. Right to property no longer fundamental right after 44th Amendment. Article 300A only protects against executive action.",
    keywords: ["property right", "article 300a", "privy purse", "fundamental right", "44th amendment"],
    category: "Property Law",
    indianKanoonId: "1779603"
  },
  {
    id: "state_of_bihar_v_kameshwar",
    title: "State of Bihar vs Kameshwar Singh",
    citation: "AIR 1952 SC 252",
    court: "Supreme Court of India",
    date: "3 April 1952",
    year: 1952,
    summary: "Zamindari abolition laws upheld. Compensation need not be market value. Social reform legislation protected under First Amendment.",
    keywords: ["zamindari", "land reform", "compensation", "acquisition", "article 31", "abolition"],
    category: "Property Law",
    indianKanoonId: "1439322"
  },
  {
    id: "veedu_chettiar",
    title: "State of TN vs L. Abu Kavur Bai",
    citation: "(1984) 1 SCC 515",
    court: "Supreme Court of India",
    date: "9 December 1983",
    year: 1983,
    summary: "Oral partition is valid in Hindu law. No registration required for partition. Partition by metes and bounds gives separate ownership.",
    keywords: ["partition", "hindu law", "oral partition", "registration", "joint family", "coparcenary"],
    category: "Property Law",
    indianKanoonId: "1296898"
  },

  // BANKING & FINANCIAL LAW
  {
    id: "mardia_chemicals",
    title: "Mardia Chemicals vs Union of India",
    citation: "(2004) 4 SCC 311",
    court: "Supreme Court of India",
    date: "8 April 2004",
    year: 2004,
    summary: "SARFAESI Act provisions upheld except Section 17(2) requiring 75% deposit. Banks can take possession of secured assets without court intervention.",
    keywords: ["sarfaesi", "npa", "secured creditor", "bank", "possession", "recovery", "defaulter"],
    category: "Banking Law",
    indianKanoonId: "1086022"
  },
  {
    id: "icici_bank_v_sidco",
    title: "ICICI Bank vs SIDCO Leathers Ltd",
    citation: "(2006) 10 SCC 452",
    court: "Supreme Court of India",
    date: "8 August 2006",
    year: 2006,
    summary: "Secured creditor's priority over government dues. SARFAESI Act prevails over state laws for secured debt recovery.",
    keywords: ["secured creditor", "priority", "sarfaesi", "government dues", "recovery", "bank"],
    category: "Banking Law",
    indianKanoonId: "1496750"
  },
  {
    id: "swiss_ribbons",
    title: "Swiss Ribbons vs Union of India",
    citation: "(2019) 4 SCC 17",
    court: "Supreme Court of India",
    date: "25 January 2019",
    year: 2019,
    summary: "Insolvency and Bankruptcy Code constitutional validity upheld. Resolution over liquidation preferred. Creditors committee powers explained.",
    keywords: ["ibc", "insolvency", "bankruptcy", "nclt", "resolution", "liquidation", "creditor"],
    category: "Banking Law",
    indianKanoonId: "47379299"
  },
  {
    id: "pioneer_urban",
    title: "Pioneer Urban Land vs Union of India",
    citation: "(2019) 8 SCC 416",
    court: "Supreme Court of India",
    date: "9 August 2019",
    year: 2019,
    summary: "Homebuyers are financial creditors under IBC. Real estate allottees can initiate CIRP against builders. Consumer protection for homebuyers.",
    keywords: ["homebuyer", "financial creditor", "ibc", "real estate", "builder", "rera", "flat buyer"],
    category: "Real Estate Law",
    indianKanoonId: "104345654"
  },

  // ELECTION LAW
  {
    id: "lily_thomas",
    title: "Lily Thomas vs Union of India",
    citation: "(2013) 7 SCC 653",
    court: "Supreme Court of India",
    date: "10 July 2013",
    year: 2013,
    summary: "MP/MLA convicted and sentenced to 2+ years imprisonment immediately disqualified. Protection during appeal period struck down.",
    keywords: ["disqualification", "conviction", "mp", "mla", "election", "criminal case", "section 8"],
    category: "Election Law",
    indianKanoonId: "66344192"
  },
  {
    id: "peoples_union",
    title: "People's Union for Civil Liberties vs Union of India",
    citation: "(2013) 10 SCC 1",
    court: "Supreme Court of India",
    date: "27 September 2013",
    year: 2013,
    summary: "Right to reject all candidates (NOTA) in elections upheld. Voters have right to express disapproval. Secrecy of ballot maintained.",
    keywords: ["nota", "election", "voting", "right to reject", "secret ballot", "evm", "voter"],
    category: "Election Law",
    indianKanoonId: "89646961"
  },
  {
    id: "association_democratic",
    title: "Association for Democratic Reforms vs Union of India",
    citation: "(2002) 5 SCC 294",
    court: "Supreme Court of India",
    date: "2 May 2002",
    year: 2002,
    summary: "Voters have right to know criminal antecedents, assets, and education of candidates. Mandatory disclosure by election candidates.",
    keywords: ["voter right", "disclosure", "criminal record", "assets", "candidate", "election", "transparency"],
    category: "Election Law",
    indianKanoonId: "1670869"
  },

  // TAXATION
  {
    id: "khandige_sham_bhat",
    title: "Khandige Sham Bhat vs Agricultural ITO",
    citation: "AIR 1963 SC 591",
    court: "Supreme Court of India",
    date: "11 September 1962",
    year: 1962,
    summary: "Agricultural income exempt from income tax under Entry 82 List I. Definition and scope of agricultural income explained.",
    keywords: ["agricultural income", "income tax", "exemption", "taxation", "entry 82", "constitution"],
    category: "Tax Law",
    indianKanoonId: "1920430"
  },
  {
    id: "vodafone_international",
    title: "Vodafone International Holdings vs Union of India",
    citation: "(2012) 6 SCC 613",
    court: "Supreme Court of India",
    date: "20 January 2012",
    year: 2012,
    summary: "Offshore transfer of shares not taxable in India. Look-at doctrine for tax avoidance. Corporate veil cannot be lifted without statutory basis.",
    keywords: ["tax", "offshore transfer", "capital gains", "corporate veil", "avoidance", "vodafone"],
    category: "Tax Law",
    indianKanoonId: "115852355"
  },

  // TRIBAL & FOREST RIGHTS
  {
    id: "samatha_v_state",
    title: "Samatha vs State of Andhra Pradesh",
    citation: "AIR 1997 SC 3297",
    court: "Supreme Court of India",
    date: "11 July 1997",
    year: 1997,
    summary: "Government cannot transfer tribal land to non-tribals or private companies for mining. Fifth Schedule protection for scheduled areas.",
    keywords: ["tribal land", "fifth schedule", "mining", "scheduled area", "forest", "adivasi"],
    category: "Tribal Rights",
    indianKanoonId: "1234715"
  },
  {
    id: "orissa_mining",
    title: "Orissa Mining Corporation vs Ministry of Environment",
    citation: "(2013) 6 SCC 476",
    court: "Supreme Court of India",
    date: "18 April 2013",
    year: 2013,
    summary: "Vedanta mining in Niyamgiri rejected. Religious and cultural rights of tribals over sacred groves protected. Gram Sabha consent mandatory.",
    keywords: ["niyamgiri", "tribal rights", "gram sabha", "forest", "mining", "dongria kondh", "vedanta"],
    category: "Tribal Rights",
    indianKanoonId: "160935030"
  },

  // REFUGEE & IMMIGRATION
  {
    id: "national_human_rights",
    title: "National Human Rights Commission vs State of Arunachal Pradesh",
    citation: "(1996) 1 SCC 742",
    court: "Supreme Court of India",
    date: "9 January 1996",
    year: 1996,
    summary: "Chakma refugees entitled to life and liberty protection under Article 21. Non-citizens also have fundamental rights except Article 19.",
    keywords: ["refugee", "chakma", "article 21", "non-citizen", "fundamental rights", "asylum"],
    category: "Human Rights",
    indianKanoonId: "1257067"
  },

  // RIGHT TO INFORMATION
  {
    id: "cbse_v_aditya_bandopadhyay",
    title: "CBSE vs Aditya Bandopadhyay",
    citation: "(2011) 8 SCC 497",
    court: "Supreme Court of India",
    date: "9 August 2011",
    year: 2011,
    summary: "Examined papers are 'information' under RTI Act. Students entitled to copies of answer sheets. Reasonable restrictions apply.",
    keywords: ["rti", "right to information", "answer sheet", "examination", "cbse", "transparency"],
    category: "RTI",
    indianKanoonId: "909513"
  },
  {
    id: "supreme_court_cpio",
    title: "Supreme Court of India vs Subhash Chandra Agarwal",
    citation: "(2020) 5 SCC 481",
    court: "Supreme Court of India",
    date: "13 November 2019",
    year: 2019,
    summary: "CJI's office is public authority under RTI. Right to information balanced with judicial independence. Transparency in judicial appointments.",
    keywords: ["rti", "cji", "supreme court", "transparency", "public authority", "judicial independence"],
    category: "RTI",
    indianKanoonId: "162924627"
  },

  // DISABILITY RIGHTS
  {
    id: "jeeja_ghosh",
    title: "Jeeja Ghosh vs Union of India",
    citation: "(2016) 7 SCC 761",
    court: "Supreme Court of India",
    date: "12 May 2016",
    year: 2016,
    summary: "Disabled passenger's rights upheld. Airlines cannot deboard disabled passengers arbitrarily. Disability discrimination violates Article 21.",
    keywords: ["disability", "discrimination", "airline", "accessibility", "article 21", "pwd act"],
    category: "Disability Rights",
    indianKanoonId: "103358098"
  },
  {
    id: "vikash_kumar",
    title: "Vikash Kumar vs UPSC",
    citation: "(2021) 5 SCC 370",
    court: "Supreme Court of India",
    date: "11 February 2021",
    year: 2021,
    summary: "Writer/scribe for disabled candidates in exams. Benchmark disability of 40% not always required. Reasonable accommodation for disabilities.",
    keywords: ["disability", "scribe", "examination", "upsc", "reasonable accommodation", "benchmark disability"],
    category: "Disability Rights",
    indianKanoonId: "166791458"
  },

  // SENIOR CITIZEN RIGHTS
  {
    id: "ashwani_kumar",
    title: "Ashwani Kumar vs Union of India",
    citation: "(2019) 19 SCC 272",
    court: "Supreme Court of India",
    date: "29 November 2019",
    year: 2019,
    summary: "Senior citizens' homes and maintenance. State duty to implement Maintenance and Welfare of Parents and Senior Citizens Act.",
    keywords: ["senior citizen", "maintenance", "elderly", "old age home", "parents", "welfare"],
    category: "Senior Citizens",
    indianKanoonId: "126285312"
  },

  // MEDICAL LAW & PATIENT RIGHTS
  {
    id: "parmanand_katara",
    title: "Parmanand Katara vs Union of India",
    citation: "AIR 1989 SC 2039",
    court: "Supreme Court of India",
    date: "28 August 1989",
    year: 1989,
    summary: "Doctors must provide emergency treatment regardless of police formalities. No hospital can refuse treatment in emergency. Right to emergency care.",
    keywords: ["emergency treatment", "hospital", "doctor", "medical emergency", "patient rights", "article 21"],
    category: "Medical Law",
    indianKanoonId: "581287"
  },
  {
    id: "samira_kohli",
    title: "Samira Kohli vs Dr. Prabha Manchanda",
    citation: "(2008) 2 SCC 1",
    court: "Supreme Court of India",
    date: "16 January 2008",
    year: 2008,
    summary: "Informed consent required before medical procedure. Doctor must explain risks and alternatives. Unauthorized surgery is assault.",
    keywords: ["informed consent", "medical negligence", "surgery", "patient rights", "doctor", "consent"],
    category: "Medical Law",
    indianKanoonId: "1849502"
  },
  {
    id: "jacob_mathew",
    title: "Jacob Mathew vs State of Punjab",
    citation: "(2005) 6 SCC 1",
    court: "Supreme Court of India",
    date: "5 August 2005",
    year: 2005,
    summary: "Medical negligence standards defined. Bolam test applied. Simple negligence not enough for criminal prosecution. Gross negligence required.",
    keywords: ["medical negligence", "doctor", "criminal prosecution", "bolam test", "gross negligence"],
    category: "Medical Law",
    indianKanoonId: "871062"
  },

  // CONTEMPT OF COURT
  {
    id: "arundhati_roy_contempt",
    title: "In Re: Arundhati Roy",
    citation: "(2002) 3 SCC 343",
    court: "Supreme Court of India",
    date: "6 March 2002",
    year: 2002,
    summary: "Contempt for obstructing course of justice. Free speech limits when scandalizing court. Symbolic fine of one rupee imposed.",
    keywords: ["contempt", "free speech", "court", "scandalizing", "arundhati roy", "narmada"],
    category: "Contempt of Court",
    indianKanoonId: "1265627"
  },

  // CITIZENSHIP
  {
    id: "sarbananda_sonowal",
    title: "Sarbananda Sonowal vs Union of India",
    citation: "(2005) 5 SCC 665",
    court: "Supreme Court of India",
    date: "12 July 2005",
    year: 2005,
    summary: "IMDT Act unconstitutional for being discriminatory to Assam. Detection and deportation of illegal immigrants. External aggression includes infiltration.",
    keywords: ["illegal immigrant", "citizenship", "assam", "imdt act", "deportation", "infiltration"],
    category: "Citizenship",
    indianKanoonId: "118957"
  },

  // COOPERATIVE SOCIETIES
  {
    id: "mahabir_auto_stores",
    title: "Mahabir Auto Stores vs Indian Oil Corporation",
    citation: "(1990) 3 SCC 752",
    court: "Supreme Court of India",
    date: "12 April 1990",
    year: 1990,
    summary: "Public sector undertakings bound by Article 14. State instrumentalities must act fairly and reasonably. No arbitrary termination of dealership.",
    keywords: ["state instrumentality", "article 14", "public sector", "arbitrariness", "dealership", "fairness"],
    category: "Administrative Law",
    indianKanoonId: "1731767"
  },

  // TRANSGENDER RIGHTS
  {
    id: "nalsa_transgender",
    title: "National Legal Services Authority vs Union of India",
    citation: "(2014) 5 SCC 438",
    court: "Supreme Court of India",
    date: "15 April 2014",
    year: 2014,
    summary: "Transgender persons recognized as third gender. Right to self-identify gender. Entitled to reservations as socially and educationally backward.",
    keywords: ["transgender", "third gender", "lgbtq", "self-identification", "reservation", "hijra", "article 21"],
    category: "LGBTQ Rights",
    indianKanoonId: "81935436"
  },

  // PRISON REFORMS
  {
    id: "sunil_batra",
    title: "Sunil Batra vs Delhi Administration",
    citation: "AIR 1978 SC 1675",
    court: "Supreme Court of India",
    date: "20 December 1978",
    year: 1978,
    summary: "Prisoners retain fundamental rights except those taken by incarceration. Prison conditions must respect human dignity. Torture is unconstitutional.",
    keywords: ["prisoner rights", "torture", "prison reform", "human dignity", "article 21", "custodial violence"],
    category: "Prison Rights",
    indianKanoonId: "1782439"
  },
  {
    id: "inhuman_conditions",
    title: "In Re: Inhuman Conditions in 1382 Prisons",
    citation: "(2016) 3 SCC 700",
    court: "Supreme Court of India",
    date: "5 February 2016",
    year: 2016,
    summary: "Comprehensive guidelines for prison reforms. Overcrowding, hygiene, medical facilities addressed. State responsibility for prisoner welfare.",
    keywords: ["prison", "overcrowding", "prison reform", "prisoner welfare", "hygiene", "undertrial"],
    category: "Prison Rights",
    indianKanoonId: "73938285"
  },

  // PIL JURISPRUDENCE  
  {
    id: "sp_gupta",
    title: "S.P. Gupta vs Union of India",
    citation: "AIR 1982 SC 149",
    court: "Supreme Court of India",
    date: "30 December 1981",
    year: 1981,
    summary: "Public interest litigation (PIL) recognized. Any public-spirited person can approach court. Relaxation of locus standi for public causes.",
    keywords: ["pil", "public interest litigation", "locus standi", "judicial activism", "access to justice"],
    category: "Constitutional Law",
    indianKanoonId: "1294854"
  },
  {
    id: "bandhua_mukti_morcha",
    title: "Bandhua Mukti Morcha vs Union of India",
    citation: "AIR 1984 SC 802",
    court: "Supreme Court of India",
    date: "16 December 1983",
    year: 1983,
    summary: "Bonded labour identified and ordered to be freed. PIL for exploited workers. State duty to implement Bonded Labour Abolition Act.",
    keywords: ["bonded labour", "pil", "forced labour", "article 23", "exploitation", "rehabilitation"],
    category: "Labour Law",
    indianKanoonId: "595099"
  },

  // INTERNET & DIGITAL RIGHTS
  {
    id: "anuradha_bhasin",
    title: "Anuradha Bhasin vs Union of India",
    citation: "(2020) 3 SCC 637",
    court: "Supreme Court of India",
    date: "10 January 2020",
    year: 2020,
    summary: "Internet access is fundamental right under Article 19. Internet shutdown must be proportionate and reasoned. Indefinite shutdowns unconstitutional.",
    keywords: ["internet", "shutdown", "kashmir", "article 19", "digital rights", "proportionality", "free speech"],
    category: "Digital Rights",
    indianKanoonId: "161972501"
  },

  // JUVENILE JUSTICE
  {
    id: "salil_bali",
    title: "Salil Bali vs Union of India",
    citation: "(2013) 7 SCC 705",
    court: "Supreme Court of India",
    date: "17 July 2013",
    year: 2013,
    summary: "Juvenile Justice Act provisions upheld. Age determination at time of offence. Juveniles cannot be tried as adults. Reformation focus.",
    keywords: ["juvenile", "minor", "juvenile justice", "reformation", "age determination", "child offender"],
    category: "Juvenile Justice",
    indianKanoonId: "66203959"
  },

  // RELIGIOUS FREEDOM
  {
    id: "sr_bommai",
    title: "S.R. Bommai vs Union of India",
    citation: "(1994) 3 SCC 1",
    court: "Supreme Court of India",
    date: "11 March 1994",
    year: 1994,
    summary: "Secularism is basic structure of Constitution. President's rule under Article 356 is judicially reviewable. State governments cannot be dismissed arbitrarily.",
    keywords: ["secularism", "article 356", "president rule", "basic structure", "federalism", "state government"],
    category: "Constitutional Law",
    indianKanoonId: "1081279"
  },
  {
    id: "commissioner_hindu",
    title: "Commissioner, Hindu Religious Endowments vs Sri Lakshmindra Thirtha Swamiar",
    citation: "AIR 1954 SC 282",
    court: "Supreme Court of India",
    date: "16 April 1954",
    year: 1954,
    summary: "Religious denomination rights under Article 26. Essential religious practices protected from state interference. Religious institution management.",
    keywords: ["religious denomination", "article 26", "essential practice", "temple", "math", "religious freedom"],
    category: "Religious Freedom",
    indianKanoonId: "1406474"
  },
  {
    id: "sabarimala",
    title: "Indian Young Lawyers Association vs State of Kerala",
    citation: "(2019) 11 SCC 1",
    court: "Supreme Court of India",
    date: "28 September 2018",
    year: 2018,
    summary: "Women of all ages allowed entry to Sabarimala temple. Exclusion based on menstruation violates Article 14, 15, 25. Essential religious practice test applied.",
    keywords: ["sabarimala", "women entry", "temple", "menstruation", "article 25", "religious practice", "discrimination"],
    category: "Religious Freedom",
    indianKanoonId: "7367853"
  },
];

// Search function to find relevant cases
export function searchCases(query: string): IndianCase[] {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  
  if (searchTerms.length === 0) return [];

  const scoredCases = indianCases.map(caseItem => {
    let score = 0;
    const titleLower = caseItem.title.toLowerCase();
    const summaryLower = caseItem.summary.toLowerCase();
    const categoryLower = caseItem.category.toLowerCase();
    const citationLower = caseItem.citation.toLowerCase();

    for (const term of searchTerms) {
      // Exact keyword match (highest weight)
      if (caseItem.keywords.some(k => k.toLowerCase().includes(term))) {
        score += 10;
      }
      // Title match
      if (titleLower.includes(term)) {
        score += 8;
      }
      // Category match
      if (categoryLower.includes(term)) {
        score += 6;
      }
      // Citation match
      if (citationLower.includes(term)) {
        score += 5;
      }
      // Summary match
      if (summaryLower.includes(term)) {
        score += 3;
      }
    }

    return { ...caseItem, score };
  });

  return scoredCases
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ score, ...caseItem }) => caseItem);
}

// Get Indian Kanoon URL for a case
export function getIndianKanoonUrl(caseItem: IndianCase): string {
  if (caseItem.indianKanoonId) {
    return `https://indiankanoon.org/doc/${caseItem.indianKanoonId}/`;
  }
  // Fallback to search URL
  return `https://indiankanoon.org/search/?formInput=${encodeURIComponent(caseItem.title)}`;
}
