import json
from pathlib import Path

BASE_DIR = Path(r"c:\Users\HP\OneDrive\Attachments\Desktop\NEW PROJECT")
BACKEND_FACTS_PATH = BASE_DIR / "backend" / "data" / "facts" / "academic_facts.json"

# Load existing facts
if BACKEND_FACTS_PATH.exists():
    with open(BACKEND_FACTS_PATH, "r", encoding="utf-8") as f:
        facts = json.load(f)
else:
    facts = []

existing_ids = {item["id"] for item in facts}

NEW_ACADEMIC_FACTS = [
    # --- 1. PHYSICS ---
    {
        "id": "physics-thermo-0001",
        "category": "physics_science",
        "question_variants": [
            "What is the first law of thermodynamics?",
            "First law of thermodynamics formula",
            "Conservation of energy in thermodynamics",
            "Delta U = Q - W",
            "ऊष्मागतिकी का प्रथम नियम",
            "थर्मोडायनामिक्स का पहला नियम"
        ],
        "answer": "The First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed: the change in internal energy (ΔU) of a closed system equals heat added (Q) minus work done by the system (W), expressed as ΔU = Q - W.",
        "details": "It is an adaptation of the universal Law of Conservation of Energy for thermodynamic systems. It establishes that internal energy is a state function.",
        "source": "NCERT Physics Class 11 Chapter 12; Halliday & Resnick Fundamentals of Physics",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "physics-thermo-0002",
        "category": "physics_science",
        "question_variants": [
            "What is the second law of thermodynamics?",
            "Second law of thermodynamics",
            "What is entropy in thermodynamics?",
            "Clausius and Kelvin Planck statements",
            "ऊष्मागतिकी का द्वितीय नियम"
        ],
        "answer": "The Second Law of Thermodynamics states that the total entropy of an isolated system always increases over time (ΔS ≥ 0), and heat cannot spontaneously flow from a colder body to a hotter body without external work.",
        "details": "Formulated via the Kelvin-Planck statement (no heat engine can achieve 100% thermal efficiency, η < 1) and Clausius statement (heat cannot spontaneously flow from cold to hot). Carnot cycle efficiency is η = 1 - (Tc/Th).",
        "source": "NCERT Physics Class 11 Chapter 12; Feynman Lectures on Physics Vol 1",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "physics-optics-0001",
        "category": "physics_science",
        "question_variants": [
            "What is Snell's law of refraction?",
            "Snell's law formula",
            "Law of refraction of light",
            "n1 sin theta1 = n2 sin theta2",
            "स्नेल का नियम क्या है",
            "प्रकाश के अपवर्तन का नियम"
        ],
        "answer": "Snell's Law states that the ratio of the sine of the angle of incidence (θ1) to the sine of the angle of refraction (θ2) is equal to the ratio of refractive indices: n1 * sin(θ1) = n2 * sin(θ2).",
        "details": "Named after Willebrord Snellius (1621). It governs the bending of light at the boundary between two isotropic media with different optical densities and determines the critical angle for total internal reflection: sin(θc) = n2 / n1.",
        "source": "NCERT Physics Class 12 Chapter 9; Optics by Eugene Hecht",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "physics-em-0001",
        "category": "physics_science",
        "question_variants": [
            "What is Coulomb's law?",
            "Coulomb's law formula for electrostatic force",
            "Electrostatic force between two charges",
            "F = k q1 q2 / r^2",
            "कूलॉम का नियम क्या है"
        ],
        "answer": "Coulomb's Law states that the electrostatic force of attraction or repulsion between two point electric charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them: F = (1 / 4πε₀) * (|q1 * q2| / r²).",
        "details": "Formulated by Charles-Augustin de Coulomb in 1785. The electrostatic constant k = 1 / (4πε₀) is approximately 8.98755 × 10⁹ N·m²/C² in vacuum.",
        "source": "NCERT Physics Class 12 Chapter 1; CODATA Recommended Values",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "physics-em-0002",
        "category": "physics_science",
        "question_variants": [
            "What is Faraday's law of electromagnetic induction?",
            "Faraday's law and Lenz's law",
            "Electromagnetic induction formula",
            "Induced emf formula",
            "फैराडे का विद्युत चुम्बकीय प्रेरण का नियम"
        ],
        "answer": "Faraday's Law of Electromagnetic Induction states that the magnitude of induced electromotive force (EMF) in a circuit is directly proportional to the time rate of change of magnetic flux through the circuit: ε = -N * (dΦB / dt).",
        "details": "The negative sign represents Lenz's Law (conservation of energy), stating that the direction of the induced current always opposes the change in magnetic flux that produced it.",
        "source": "NCERT Physics Class 12 Chapter 6; Griffiths Introduction to Electrodynamics",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "physics-modern-0001",
        "category": "physics_science",
        "question_variants": [
            "What is the photoelectric effect?",
            "Einstein's photoelectric equation",
            "Threshold frequency and work function",
            "E = h nu = phi + KE_max",
            "प्रकाश वैद्युत प्रभाव क्या है"
        ],
        "answer": "The Photoelectric Effect is the emission of electrons from a metallic surface when electromagnetic radiation of frequency greater than a threshold frequency (ν₀) strikes it, governed by Einstein's equation: hν = Φ + KE_max, where Φ is the metal's work function.",
        "details": "Albert Einstein won the 1921 Nobel Prize in Physics for explaining this phenomenon in 1905, establishing the particle nature of light (photons) with energy E = hν, where h is Planck's constant (6.626 × 10⁻³⁴ J·s).",
        "source": "NCERT Physics Class 12 Chapter 11; Nobel Prize in Physics 1921 Citation",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 2. CHEMISTRY ---
    {
        "id": "chem-gas-0001",
        "category": "chemistry",
        "question_variants": [
            "What is the ideal gas equation?",
            "Ideal gas law formula",
            "PV = nRT explanation",
            "Universal gas constant R value",
            "आदर्श गैस समीकरण क्या है"
        ],
        "answer": "The Ideal Gas Law is the equation of state for a hypothetical ideal gas: PV = nRT, where P is pressure, V is volume, n is moles of gas, R is the universal gas constant (8.314 J/(mol·K)), and T is absolute temperature in Kelvin.",
        "details": "It synthesizes Boyle's Law (P ∝ 1/V), Charles's Law (V ∝ T), and Avogadro's Law (V ∝ n). Real gases deviate at high pressures and low temperatures, described by the van der Waals equation.",
        "source": "NCERT Chemistry Class 11 Chapter 5; IUPAC Quantities, Units and Symbols",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "chem-thermo-0001",
        "category": "chemistry",
        "question_variants": [
            "What is Le Chatelier's principle?",
            "Le Chatelier's principle definition and examples",
            "Chemical equilibrium shift with temperature and pressure",
            "ला शातेलिए का सिद्धांत क्या है"
        ],
        "answer": "Le Chatelier's Principle states that when a chemical system at equilibrium is subjected to a disturbance in temperature, pressure, or concentration, the system shifts its equilibrium position in the direction that counteracts the change.",
        "details": "Formulated by Henri Louis Le Chatelier in 1884. For example, in an exothermic reaction (ΔH < 0), increasing temperature shifts the equilibrium towards the reactants (endothermic direction).",
        "source": "NCERT Chemistry Class 11 Chapter 7; Physical Chemistry by Atkins",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "chem-thermo-0002",
        "category": "chemistry",
        "question_variants": [
            "What is Gibbs free energy formula?",
            "Gibbs free energy and reaction spontaneity",
            "Delta G = Delta H - T Delta S",
            "Conditions for spontaneous chemical reaction",
            "गिब्स मुक्त ऊर्जा समीकरण"
        ],
        "answer": "Gibbs Free Energy is given by ΔG = ΔH - TΔS, where ΔH is change in enthalpy, T is temperature in Kelvin, and ΔS is change in entropy; a reaction is thermodynamically spontaneous at constant T and P when ΔG < 0.",
        "details": "If ΔG = 0, the system is in dynamic equilibrium. If ΔG > 0, the reaction is non-spontaneous in the forward direction. Named after American physicist Josiah Willard Gibbs.",
        "source": "NCERT Chemistry Class 11 Chapter 6; IUPAC Gold Book",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "chem-periodic-0001",
        "category": "chemistry",
        "question_variants": [
            "What are periodic table trends?",
            "Electronegativity trend across periodic table",
            "Ionization energy and atomic radius trends",
            "आवर्त सारणी के आवर्ती गुण क्या हैं"
        ],
        "answer": "In the modern periodic table: Electronegativity and Ionization Energy increase from left to right across a period and decrease down a group; Atomic Radius decreases across a period (due to increasing effective nuclear charge Z_eff) and increases down a group.",
        "details": "Fluorine is the most electronegative element (Pauling scale 3.98). Francium/Cesium have the lowest ionization energies. The table organizes elements by atomic number Z per Moseley's Law.",
        "source": "NCERT Chemistry Class 11 Chapter 3; Royal Society of Chemistry Periodic Table",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "chem-acidbase-0001",
        "category": "chemistry",
        "question_variants": [
            "What is pH and how is it calculated?",
            "pH formula",
            "Definition of acids and bases Bronsted Lewis",
            "pH scale range",
            "pH मान का सूत्र और परिभाषा"
        ],
        "answer": "pH is the negative logarithm (base 10) of hydrogen ion activity: pH = -log₁₀[H⁺]. On the standard scale at 25°C: pH < 7 is acidic, pH = 7 is neutral (pure water, [H⁺] = 10⁻⁷ M), and pH > 7 is basic/alkaline.",
        "details": "Introduced by Danish biochemist Søren Sørensen in 1909. Brønsted-Lowry defines acids as proton (H⁺) donors; Lewis defines acids as electron-pair acceptors.",
        "source": "NCERT Chemistry Class 11 Chapter 7; IUPAC Compendium of Analytical Nomenclature",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 3. MATHEMATICS ---
    {
        "id": "math-calc-0001",
        "category": "mathematics",
        "question_variants": [
            "What is the fundamental theorem of calculus?",
            "Fundamental theorem of calculus part 1 and part 2",
            "Relationship between derivative and integral",
            "कलन का मूलभूत प्रमेय"
        ],
        "answer": "The Fundamental Theorem of Calculus connects differentiation and integration: Part 1 states that if f is continuous on [a,b] and F(x) = ∫[a to x] f(t)dt, then F'(x) = f(x); Part 2 states that ∫[a to b] f(x)dx = F(b) - F(a), where F is any antiderivative of f.",
        "details": "Developed independently by Isaac Newton and Gottfried Wilhelm Leibniz in the late 17th century, showing that integration and differentiation are inverse operations.",
        "source": "NCERT Mathematics Class 12 Chapter 7; Stewart Calculus 8th Edition",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "math-calc-0002",
        "category": "mathematics",
        "question_variants": [
            "What are the derivative rules in calculus?",
            "Power rule product rule quotient rule chain rule",
            "Calculus differentiation formulas",
            "अवकलन के प्रमुख सूत्र"
        ],
        "answer": "Key calculus differentiation rules: Power Rule: d/dx(x^n) = n*x^(n-1); Product Rule: (u*v)' = u'*v + u*v'; Quotient Rule: (u/v)' = (u'*v - u*v') / v²; Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x).",
        "details": "The derivative represents the instantaneous rate of change of a function, defined formally as f'(x) = lim[h→0] (f(x+h) - f(x)) / h.",
        "source": "NCERT Mathematics Class 12 Chapter 5; Thomas' Calculus",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "math-quad-0001",
        "category": "mathematics",
        "question_variants": [
            "What is the quadratic formula?",
            "Roots of quadratic equation ax^2 + bx + c = 0",
            "Discriminant formula for quadratic equation",
            "द्विघात समीकरण का सूत्र श्रीधराचार्य नियम"
        ],
        "answer": "The roots of a standard quadratic equation ax² + bx + c = 0 (where a ≠ 0) are given by the Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a), with discriminant Δ = b² - 4ac.",
        "details": "Discriminant nature of roots: If Δ > 0, two distinct real roots exist; if Δ = 0, exactly one real repeated root exists (x = -b / (2a)); if Δ < 0, two complex conjugate roots exist. In India, historically formulated by ancient mathematician Sridhara (Sridharacharya's rule).",
        "source": "NCERT Mathematics Class 10 Chapter 4; Hall & Knight Higher Algebra",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "math-matrix-0001",
        "category": "mathematics",
        "question_variants": [
            "What is an eigenvalue and eigenvector?",
            "Characteristic equation of matrix det(A - lambda I) = 0",
            "Eigenvalues definition in linear algebra",
            "आइगेन मान और आइगेन वेक्टर क्या हैं"
        ],
        "answer": "In linear algebra, an eigenvector of a square matrix A is a non-zero vector v such that multiplying A by v yields a scalar multiple of v: A*v = λ*v, where scalar λ is the corresponding eigenvalue.",
        "details": "Eigenvalues are found by solving the characteristic polynomial det(A - λI) = 0, where I is the identity matrix. They are foundational in quantum mechanics, PCA dimensionality reduction, and dynamic stability analysis.",
        "source": "NCERT Mathematics Class 12 Chapter 4; Gilbert Strang Linear Algebra and Its Applications",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "math-prob-0001",
        "category": "mathematics",
        "question_variants": [
            "What is Bayes' theorem?",
            "Bayes theorem formula conditional probability",
            "P(A|B) = P(B|A) P(A) / P(B)",
            "बेयस प्रमेय क्या है"
        ],
        "answer": "Bayes' Theorem calculates conditional probability: P(A|B) = [P(B|A) * P(A)] / P(B), where P(A|B) is the posterior probability of event A given evidence B, P(A) is prior probability, and P(B|A) is the likelihood.",
        "details": "Named after English statistician Thomas Bayes (1763). Under the Law of Total Probability, P(B) = ∑ P(B|Ai) * P(Ai). It forms the mathematical foundation of Bayesian machine learning, medical diagnostic testing, and spam filtering.",
        "source": "NCERT Mathematics Class 12 Chapter 13; Sheldon Ross A First Course in Probability",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 4. BIOLOGY ---
    {
        "id": "bio-cell-0001",
        "category": "biology",
        "question_variants": [
            "What is the powerhouse of the cell?",
            "Mitochondria function in cell",
            "Where is ATP produced in eukaryotic cells?",
            "कोशिका का पावरहाउस किसे कहते हैं",
            "माइटोकॉन्ड्रिया का कार्य क्या है"
        ],
        "answer": "Mitochondria are the 'powerhouse of the cell' because they generate most of the chemical energy required for cellular processes in the form of Adenosine Triphosphate (ATP) via oxidative phosphorylation and the Krebs cycle.",
        "details": "Mitochondria are double-membrane organelles containing their own circular mitochondrial DNA (mtDNA) and 70S ribosomes, supporting the endosymbiotic theory of eukaryotic evolution.",
        "source": "NCERT Biology Class 11 Chapter 8; Campbell Biology 12th Edition",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "bio-photosyn-0001",
        "category": "biology",
        "question_variants": [
            "What is photosynthesis equation and stages?",
            "Chemical equation of photosynthesis",
            "Light reaction and Calvin cycle difference",
            "प्रकाश संश्लेषण की रासायनिक समीकरण और क्रियाविधि"
        ],
        "answer": "Photosynthesis converts light energy into chemical energy: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. It occurs in two stages: Light-dependent reactions (in chloroplast thylakoids, photolysis of water producing ATP and NADPH) and the Calvin cycle (in stroma, CO₂ fixation by RuBisCO into glucose).",
        "details": "Chlorophyll-a is the primary photosynthetic pigment absorbing blue and red wavelengths while reflecting green. Oxygen released during photosynthesis originates exclusively from the photolysis of water.",
        "source": "NCERT Biology Class 11 Chapter 13; Lehninger Principles of Biochemistry",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "bio-genetics-0001",
        "category": "biology",
        "question_variants": [
            "What is the central dogma of molecular biology?",
            "Central dogma DNA to RNA to protein",
            "Transcription and translation explanation",
            "आणविक जीव विज्ञान का केंद्रीय सिद्धांत सेंट्रल डोग्मा"
        ],
        "answer": "The Central Dogma of Molecular Biology states that genetic information flows in one direction: DNA is transcribed into messenger RNA (mRNA) in the nucleus, which is then translated into functional proteins by ribosomes in the cytoplasm: DNA → RNA → Protein.",
        "details": "Proposed by Francis Crick in 1958. Reverse transcription (RNA → DNA) observed in retroviruses (like HIV via reverse transcriptase) is a recognized specialized modification to the dogma.",
        "source": "NCERT Biology Class 12 Chapter 6; Nature (Crick, 1970)",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 5. COMPUTER SCIENCE & MACHINE LEARNING ---
    {
        "id": "cs-ml-0001",
        "category": "computer_science",
        "question_variants": [
            "What is overfitting and underfitting in machine learning?",
            "Overfitting vs underfitting difference",
            "How to prevent overfitting and underfitting",
            "Bias variance tradeoff in ML",
            "मशीन लर्निंग में ओवरफिटिंग और अंडरफिटिंग क्या है"
        ],
        "answer": "In Machine Learning: Underfitting (High Bias) occurs when a model is too simple to capture the underlying patterns, performing poorly on both training and test data; Overfitting (High Variance) occurs when a model memorizes training noise and outliers, performing exceptionally on training data but generalizing poorly to unseen test data.",
        "details": "To prevent underfitting: increase model capacity, add relevant features, reduce regularization. To prevent overfitting: use L1/L2 regularization, dropout, cross-validation (k-fold), early stopping, prune decision trees, and gather diverse, balanced training data.",
        "source": "Goodfellow et al. Deep Learning (MIT Press); Christopher Bishop Pattern Recognition and Machine Learning",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "cs-algo-0001",
        "category": "computer_science",
        "question_variants": [
            "What is Big-O notation?",
            "Big O time complexity of sorting algorithms",
            "Asymptotic analysis Big O definition",
            "बड़ा ओ नोटेशन और एल्गोरिथम कॉम्प्लेक्सिटी क्या है"
        ],
        "answer": "Big-O Notation describes the upper bound asymptotic time or space complexity of an algorithm as input size n grows to infinity: O(1) constant, O(log n) logarithmic (e.g. binary search), O(n) linear, O(n log n) linearithmic (e.g. mergesort, heapsort), and O(n²) quadratic (e.g. bubble sort).",
        "details": "Formal mathematical definition: f(n) = O(g(n)) if there exist positive constants c and n₀ such that 0 ≤ f(n) ≤ c * g(n) for all n ≥ n₀. It focuses on growth rate while ignoring constant multiplicative factors.",
        "source": "Cormen, Leiserson, Rivest, Stein (CLRS) Introduction to Algorithms 4th Edition",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "cs-algo-0002",
        "category": "computer_science",
        "question_variants": [
            "What is Dijkstra's algorithm?",
            "Dijkstra's shortest path algorithm",
            "Time complexity of Dijkstra algorithm",
            "डिजक्स्ट्रा एल्गोरिदम क्या है"
        ],
        "answer": "Dijkstra's Algorithm is a greedy graph search algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.",
        "details": "Conceived by Edsger W. Dijkstra in 1956. With a min-priority queue (Fibonacci heap), its time complexity is O(|E| + |V| log |V|). It does not work on graphs with negative weight edges, for which Bellman-Ford algorithm is used.",
        "source": "CLRS Introduction to Algorithms Chapter 24; Communications of the ACM",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 6. POLITY & CONSTITUTION ---
    {
        "id": "polity-rights-0001",
        "category": "polity_civics",
        "question_variants": [
            "What are the Fundamental Rights in Indian Constitution?",
            "Fundamental Rights Articles 12 to 35",
            "Which article is called heart and soul of Indian Constitution?",
            "Article 32 constitutional remedies",
            "भारतीय संविधान के मौलिक अधिकार कौन से हैं",
            "संविधान की आत्मा अनुच्छेद 32"
        ],
        "answer": "Part III (Articles 12-35) of the Constitution of India guarantees 6 Fundamental Rights: 1) Right to Equality (14-18), 2) Right to Freedom (19-22), 3) Right against Exploitation (23-24), 4) Right to Freedom of Religion (25-28), 5) Cultural and Educational Rights (29-30), and 6) Right to Constitutional Remedies (Article 32).",
        "details": "Dr. B.R. Ambedkar famously called Article 32 the 'heart and soul of the Constitution' because it empowers citizens to petition the Supreme Court directly via prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) to enforce their fundamental rights.",
        "source": "Constitution of India Part III; Supreme Court of India Historical Rulings; NCERT Civics Class 11",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "polity-basic-0001",
        "category": "polity_civics",
        "question_variants": [
            "What is the basic structure doctrine of Indian Constitution?",
            "Kesavananda Bharati case 1973 summary",
            "Can Parliament amend fundamental rights basic structure?",
            "मूल संरचना सिद्धांत और केशवानंद भारती केस 1973"
        ],
        "answer": "The Basic Structure Doctrine, established by a landmark 13-judge constitutional bench of the Supreme Court of India in Kesavananda Bharati v. State of Kerala (24 April 1973), holds that while Parliament has wide power to amend the Constitution under Article 368, it cannot alter or destroy its 'basic structure'.",
        "details": "Basic features recognized include the supremacy of the Constitution, republican and democratic form of government, secular character, separation of powers, judicial review, and federalism.",
        "source": "Supreme Court of India AIR 1973 SC 1461; Ministry of Law and Justice",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 7. HISTORY & CIVILIZATIONS ---
    {
        "id": "history-ivc-0001",
        "category": "history",
        "question_variants": [
            "What is the Indus Valley Civilization?",
            "Harappa and Mohenjo-daro features",
            "Features of Indus Valley Civilization Great Bath town planning",
            "सिंधु घाटी सभ्यता की प्रमुख विशेषताएं"
        ],
        "answer": "The Indus Valley Civilization (mature period c. 2600-1900 BCE) was a Bronze Age civilization in northwestern South Asia noted for advanced urban grid town planning, baked brick architecture, covered drainage systems, the Great Bath at Mohenjo-daro, standard weights and measures, and undeciphered script.",
        "details": "Major archaeological sites include Harappa (excavated 1921 by Daya Ram Sahni), Mohenjo-daro (1922 by R.D. Banerji), Lothal (dockyard in Gujarat), Kalibangan (ploughed field), and Dholavira (UNESCO World Heritage water management system).",
        "source": "Archaeological Survey of India (ASI); NCERT History Class 12 Chapter 1",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "history-maurya-0001",
        "category": "history",
        "question_variants": [
            "Who founded the Mauryan Empire and who was Ashoka?",
            "Chandragupta Maurya and Chanakya Arthashastra",
            "Kalinga War date 261 BCE and Ashoka edicts",
            "मौर्य साम्राज्य के संस्थापक और सम्राट अशोक कलिंग युद्ध"
        ],
        "answer": "The Mauryan Empire was founded in 322 BCE by Chandragupta Maurya with guidance from his prime minister Chanakya (Kautilya, author of the Arthashastra). His grandson Emperor Ashoka the Great embraced Buddhism and the philosophy of Dhamma following the devastating Kalinga War in 261 BCE.",
        "details": "Ashoka inscribed edicts in Prakrit (Brahmi script), Greek, and Aramaic on rock faces and pillars across the subcontinent. The Lion Capital of Ashoka at Sarnath was adopted as the State Emblem of India in 1950.",
        "source": "NCERT History Class 12 Chapter 2; Archaeological Survey of India",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "history-freedom-0001",
        "category": "history",
        "question_variants": [
            "What was the Dandi March Salt Satyagraha?",
            "Dandi March date 1930 Gandhi",
            "Civil Disobedience Movement Salt March",
            "दांडी यात्रा नमक सत्याग्रह 1930 गांधी जी"
        ],
        "answer": "The Dandi March (Salt Satyagraha) was a nonviolent civil disobedience campaign led by Mahatma Gandhi from 12 March to 6 April 1930, marching 240 miles (385 km) from Sabarmati Ashram to the coastal village of Dandi, Gujarat to produce salt from seawater in defiance of the British salt monopoly.",
        "details": "It initiated the nationwide Civil Disobedience Movement, leading to widespread mass protests, the boycott of foreign goods, and the Gandhi-Irwin Pact of March 1931.",
        "source": "National Gandhi Museum; NCERT History Class 12 Chapter 13",
        "verified_on": "2026-10-13",
        "valid_until": None
    },

    # --- 8. GEOGRAPHY & EARTH SCIENCE ---
    {
        "id": "geo-atmos-0001",
        "category": "geography",
        "question_variants": [
            "What are the layers of Earth's atmosphere?",
            "Atmosphere layers in order from ground up",
            "Where is the ozone layer located?",
            "Troposphere stratosphere mesosphere thermosphere",
            "वायुमंडल की परतें क्षोभमंडल समतापमंडल"
        ],
        "answer": "Earth's atmosphere consists of five primary layers in ascending order: 1) Troposphere (0-12 km, where weather occurs), 2) Stratosphere (12-50 km, contains the protective Ozone Layer absorbing UV radiation), 3) Mesosphere (50-85 km, where meteors burn up), 4) Thermosphere (85-600 km, contains the Ionosphere and Auroras), and 5) Exosphere (600+ km, merges with outer space).",
        "details": "Nitrogen makes up approximately 78% of dry air, Oxygen 21%, Argon 0.93%, and Carbon Dioxide 0.04% along with trace gases.",
        "source": "NASA Earth Observatory; NCERT Geography Class 11 Chapter 8",
        "verified_on": "2026-10-13",
        "valid_until": None
    },
    {
        "id": "geo-rivers-0001",
        "category": "geography",
        "question_variants": [
            "What are the major river systems of India?",
            "Difference between Himalayan and Peninsular rivers of India",
            "Ganga Indus Brahmaputra Godavari origin",
            "भारत की प्रमुख नदियां और उनके उद्गम"
        ],
        "answer": "India's drainage system is divided into: 1) Himalayan Rivers (Ganga, Indus, Brahmaputra) which are perennial, fed by both snowmelt glaciers and rainfall; and 2) Peninsular Rivers (Godavari, Krishna, Cauvery, Mahanadi, Narmada, Tapti) which are seasonal and rain-fed.",
        "details": "The Ganga originates from the Gangotri Glacier at Gaumukh as the Bhagirathi and is the longest river in India (2,525 km). The Godavari is the longest Peninsular river (1,465 km), often termed 'Dakshin Ganga'. Narmada and Tapti flow west into the Arabian Sea through rift valleys.",
        "source": "Survey of India; Central Water Commission; NCERT Geography Class 9 Chapter 3",
        "verified_on": "2026-10-13",
        "valid_until": None
    }
]

# Append only non-existing items
added_count = 0
for item in NEW_ACADEMIC_FACTS:
    if item["id"] not in existing_ids:
        facts.append(item)
        existing_ids.add(item["id"])
        added_count += 1

print(f"Adding {added_count} new academic facts to {BACKEND_FACTS_PATH}")
with open(BACKEND_FACTS_PATH, "w", encoding="utf-8") as f:
    json.dump(facts, f, indent=2, ensure_ascii=False)

print(f"Total facts now in academic_facts.json: {len(facts)}")
