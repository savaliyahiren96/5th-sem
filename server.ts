import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side initialization of Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Helper to call Gemini with timeout and fallback
async function generateGeminiContent(prompt: string, systemInstruction?: string): Promise<string> {
  if (!ai || !apiKey) {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 9000)
  );

  const apiCallPromise = ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction:
        systemInstruction ||
        'You are an expert Professor of Physiotherapy and Clinical Medicine for the Bachelor of Physiotherapy (BPT) 5th Semester at Parul Institute of Physiotherapy and Research (PIPTR), Parul University. Provide rigorous, evidence-based academic and clinical explanations adhering to Indian curriculum guidelines (MGR/MUHS/Parul University syllabus).',
    },
  }).then((res) => res.text || '');

  return Promise.race([apiCallPromise, timeoutPromise]);
}

// 1. AI Teaching Mode Endpoint
app.post('/api/ai/teach', async (req: Request, res: Response) => {
  const { subject, topic, level = 'intermediate', context = '' } = req.body;
  if (!subject || !topic) {
    return res.status(400).json({ error: 'Subject and topic are required.' });
  }

  const prompt = `
Generate a comprehensive 14-section academic teaching module for BPT 5th Semester students at PIPTR.
Subject: ${subject}
Topic: ${topic}
Depth Level: ${level} (simple = clear foundational concepts; intermediate = standard exam level; advanced = deep clinical reasoning & evidence-based practice)
Additional Context: ${context}

You MUST structure the response with these EXACT 14 numbered sections using clean Markdown formatting:
1. Introduction
2. Definition & Diagnostic Criteria
3. Classification & Staging
4. Aetiology (Etiology)
5. Risk Factors & Epidemiology
6. Pathophysiology (include clear step-by-step disease mechanism flowchart in text)
7. Clinical Manifestations (Presenting symptoms, cardinal signs, clinical course)
8. Diagnostic Investigations (Pathology, imaging, electrophysiology, biomarkers)
9. Medical & Surgical Management (Pharmacology, surgical procedures, indications)
10. Physiotherapy Implications (Indications, absolute & relative contraindications, exercise tolerance)
11. Physiotherapy Precautions & Red Flags (Safety parameters, vitals monitoring)
12. Complications & Long-term Sequelae
13. Prognosis & Recovery Timelines
14. High-Yield University Examination Points & Key References (mention standard textbooks: Davidson, Adams & Victor, Bailey & Love, Apley, O'Sullivan, Kisner & Colby).
`;

  try {
    const text = await generateGeminiContent(
      prompt,
      `You are the Senior Subject Head for ${subject} for BPT 5th Semester at Parul Institute of Physiotherapy and Research. Maintain high academic standards, clinical accuracy, and physiotherapy relevance.`
    );
    return res.json({ success: true, content: text });
  } catch (error: any) {
    console.warn('Gemini call failed, providing rich clinical curricular fallback:', error?.message);
    // Return structured curricular fallback
    return res.json({
      success: true,
      content: getCurriculumTeachingFallback(subject, topic, level),
      isFallback: true,
    });
  }
});

// 2. AI Clinical Case Generator Endpoint
app.post('/api/ai/case', async (req: Request, res: Response) => {
  const { subject, topic, difficulty = 'moderate' } = req.body;
  if (!subject || !topic) {
    return res.status(400).json({ error: 'Subject and topic are required.' });
  }

  const prompt = `
Generate a realistic educational clinical patient case scenario for BPT 5th Semester students.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY valid JSON matching this structure:
{
  "caseTitle": "string",
  "patientDemographics": {
    "age": number,
    "gender": "string",
    "occupation": "string"
  },
  "chiefComplaints": ["string"],
  "historyOfPresentIllness": "string",
  "pastMedicalSurgicalHistory": "string",
  "clinicalExaminationFindings": {
    "vitals": "string",
    "observation": "string",
    "palpation": "string",
    "functionalAssessment": "string"
  },
  "investigationReports": ["string"],
  "medicalDiagnosis": "string",
  "physiotherapyAssessment": {
    "impairments": ["string"],
    "activityLimitations": ["string"],
    "participationRestrictions": ["string"]
  },
  "problemList": ["string"],
  "treatmentGoals": {
    "shortTerm": ["string"],
    "longTerm": ["string"]
  },
  "treatmentPlan": ["string"],
  "interactiveQuestions": [
    {
      "id": 1,
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctOptionIndex": number,
      "clinicalRationale": "string"
    },
    {
      "id": 2,
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctOptionIndex": number,
      "clinicalRationale": "string"
    }
  ]
}
`;

  try {
    const text = await generateGeminiContent(
      prompt,
      'You are a Clinical Education Director at Parul Sevashram Hospital, Parul University. Create realistic, de-identified clinical cases for physiotherapy training. Always output valid JSON.'
    );
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return res.json({ success: true, case: parsed });
  } catch (error: any) {
    console.warn('Gemini case generation failed, providing rich fallback case:', error?.message);
    return res.json({
      success: true,
      case: getCurriculumCaseFallback(subject, topic),
      isFallback: true,
    });
  }
});

// 3. AI Assessment Assistant Endpoint
app.post('/api/ai/assessment', async (req: Request, res: Response) => {
  const { subject, condition } = req.body;
  const prompt = `
Generate a complete, structured clinical physiotherapy assessment protocol for condition: "${condition}" under subject "${subject}".
Include:
1. Patient Demographics & Subjective Assessment (HPI, pain NPRS/VAS, aggravating/relieving factors)
2. Objective Examination (Observation, Palpation, Range of Motion ROM, Manual Muscle Testing MMT)
3. Neurological / Special Diagnostic Tests (e.g. Lachman, Berg Balance, Modified Ashworth Scale, etc.)
4. Standardized Functional Outcome Measures
5. Red Flag Signs & Contraindications
6. Clinical Reasoning & Differential Diagnosis formulation
Output clean, organized markdown with checklists and tables where appropriate.
`;

  try {
    const text = await generateGeminiContent(prompt);
    return res.json({ success: true, content: text });
  } catch (error) {
    return res.json({
      success: true,
      content: getCurriculumAssessmentFallback(subject, condition),
      isFallback: true,
    });
  }
});

// 4. AI Treatment Planner Endpoint
app.post('/api/ai/treatment', async (req: Request, res: Response) => {
  const { subject, condition, patientPhase = 'acute' } = req.body;
  const prompt = `
Generate an evidence-informed Physiotherapy Treatment Plan for "${condition}" (${subject}) in the "${patientPhase}" stage.
Include:
1. Patient Safety, Absolute & Relative Contraindications
2. Short-Term Goals (1-2 weeks)
3. Long-Term Goals (4-8 weeks)
4. Phase-Wise Exercise Protocol (Specific exercise selection, technique, dosage, frequency, hold times)
5. Modality Prescription & Precautions (Cryo/Thermotherapy, TENS, NMES, etc.)
6. Objective Progression Criteria (When to advance to next phase)
7. Home Exercise Programme (HEP) with Ergonomic/Postural Advice
8. Reassessment Schedule and Outcome Targets
Ensure safety verification warning: "Educational protocol only. Patient assessment and clinical verification required before application."
`;

  try {
    const text = await generateGeminiContent(prompt);
    return res.json({ success: true, content: text });
  } catch (error) {
    return res.json({
      success: true,
      content: getCurriculumTreatmentFallback(subject, condition, patientPhase),
      isFallback: true,
    });
  }
});

// 5. AI Examination Question Generator Endpoint
app.post('/api/ai/exam', async (req: Request, res: Response) => {
  const { subject, topic, questionType = 'all' } = req.body;
  const prompt = `
Generate university examination questions for BPT 5th Semester at PIPTR.
Subject: ${subject}
Topic: ${topic}
Question Type: ${questionType} (2-marks, 5-marks, 10-marks, MCQs, Viva, OSCE checklist)

Tag every question with:
- Subject & Unit
- Marks (2, 5, or 10 marks)
- Bloom's Taxonomy Level (Remember, Understand, Apply, Analyze, Evaluate)
- Difficulty Level (Easy, Medium, Hard)
- Model Answer Outline / Key Marking Scheme points.
Include at least:
- 2x 2-mark brief questions
- 2x 5-mark short essay questions
- 1x 10-mark long essay / clinical case question
- 3x MCQs with 4 options, correct answer, and explanation
- 3x Viva voce questions with examiner expectations
- 1x Practical OSCE station rubric with 5 scoring steps
`;

  try {
    const text = await generateGeminiContent(prompt);
    return res.json({ success: true, content: text });
  } catch (error) {
    return res.json({
      success: true,
      content: getCurriculumExamFallback(subject, topic),
      isFallback: true,
    });
  }
});

// 6. Cross-Subject Search & Synthesis Endpoint
app.post('/api/ai/cross-search', async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const prompt = `
You are the Master Academic Coordinator for BPT 5th Semester at Parul University.
The user is searching for: "${query}".

Analyze how this topic connects across all six 5th semester subjects:
1. General Medicine-I (Pathology, systemic involvement, medical management)
2. Neuro Medicine-I (Neurological features, lesion localization, medical treatment)
3. Surgery-I (Surgical procedures, incisions, pre/post-op surgical precautions)
4. Orthopaedics (Trauma, fracture/ligament injury, biomechanics, orthopaedic surgery)
5. PFD Neuro (Physical Functional Diagnosis in Neurology: motor/sensory/balance assessment, mat exercises, gait re-education)
6. PFD PTMS (Physical Functional Diagnosis in Physiotherapy Musculoskeletal: joint play, special tests, manual therapy, mobilization)

For subjects where this topic is directly examinable, provide detailed points. For subjects where it is a relevant secondary connection or comorbidity, clearly denote the clinical linkage.
Format the output cleanly in markdown with a high-level summary followed by subject-specific cards.
`;

  try {
    const text = await generateGeminiContent(prompt);
    return res.json({ success: true, content: text });
  } catch (error) {
    return res.json({
      success: true,
      content: getCurriculumCrossSearchFallback(query),
      isFallback: true,
    });
  }
});

// 7. AI Clinical Posting Assistant Endpoint
app.post('/api/ai/posting-assist', async (req: Request, res: Response) => {
  const { department, patientAge, gender, primaryCondition, chiefProblem } = req.body;
  const prompt = `
A BPT 5th semester student at Parul Sevashram Hospital is presenting a case in the "${department}" department.
Patient Details (De-identified): Age ${patientAge}, Gender ${gender}, Condition: ${primaryCondition}, Chief Clinical Problem: ${chiefProblem}.

Provide an educational case presentation framework:
1. Ideal Case Presentation Script for Bedside Viva
2. Key Clinical Questions the Faculty / Supervisor will likely ask
3. Specific Physical Examination points to highlight for ${primaryCondition}
4. Prioritized Problem List & SMART Physiotherapy Goals
5. Step-by-Step Evidence-Based Intervention Protocol for this posting session
6. Discharge Planning & Home Ergonomics
Include strict disclaimer: "Educational simulator only. Identifiable patient data must not be logged."
`;

  try {
    const text = await generateGeminiContent(prompt);
    return res.json({ success: true, content: text });
  } catch (error) {
    return res.json({
      success: true,
      content: `### Bedside Case Presentation Guide: ${primaryCondition}\n\n**Department:** ${department} | **Patient:** ${patientAge}y ${gender}\n\n#### 1. Bedside Presentation Script\n"Good morning Sir/Madam, I am presenting the case of a ${patientAge}-year-old ${gender} diagnosed with ${primaryCondition}, presenting on Day 4 of admission with chief complaints of ${chiefProblem}. On initial assessment, vitals are stable. Primary impairments include decreased functional mobility, altered motor control, and localized functional limitations."\n\n#### 2. High-Yield Viva Questions by Clinical Supervisors\n- What is the physiological rationale for early mobilization in this condition?\n- Which standardized outcome measure will you use to track progression this week?\n- What are the red flag hemodynamic indicators to terminate exercise?\n\n#### 3. Prioritized Problem List & Treatment Protocol\n- **Impairment 1:** Pain and guarding -> Gentle active-assisted movements, cryo/thermotherapy, positioning.\n- **Impairment 2:** Restricted ROM / Muscle weakness -> Graded isometric exercises, joint play mobilization.\n- **Functional Limitation:** Impaired transfers and bed mobility -> Mat activities, bridging, rolling re-education.\n\n*Note: Privacy guidelines enforced. Ensure all clinical notes in hospital logbook are verified and signed by your PIPTR Clinical Supervisor.*`,
      isFallback: true,
    });
  }
});

// Fallback Generators based on PIPTR BPT 5th Semester Curriculum
function getCurriculumTeachingFallback(subject: string, topic: string, level: string): string {
  return `## ${topic} – Comprehensive Academic Master Module
**Subject:** ${subject} | **Curriculum:** BPT 5th Semester (PIPTR / Parul University 2026–27) | **Depth Level:** ${level.toUpperCase()}

---

### 1. Introduction
${topic} represents a high-yield clinical topic in ${subject} for 5th semester physical therapy students. A comprehensive grasp of both its systemic presentation and functional movement implications is essential for accurate clinical reasoning and physical therapy prescription.

### 2. Definition & Diagnostic Criteria
- **Definition:** Pathological or traumatic condition characterized by specific tissue disruption, physiological alteration, or biomechanical dysfunction affecting standard functional capacity.
- **Diagnostic Criteria:** Diagnosis is established through a triad of patient history, targeted clinical examination maneuvers, and confirmatory radiological or laboratory investigations.

### 3. Classification & Staging
- **Grade / Stage I:** Mild involvement, minimal structural alteration, intact functional independence with localized discomfort.
- **Grade / Stage II:** Moderate structural compromise, palpable or observable deficit, moderate impairment of functional activities.
- **Grade / Stage III:** Severe or complete disruption, significant physiological/biomechanical failure requiring intensive medical, surgical, or rehabilitative intervention.

### 4. Aetiology (Etiology)
- **Primary Causes:** Direct trauma, degenerative processes, autoimmune reactions, or acute vascular/infectious insults.
- **Secondary / Contributing Factors:** Biomechanical malalignment, metabolic derangements (e.g., uncontrolled diabetes), repetitive microtrauma, age-related tissue vulnerability.

### 5. Risk Factors & Epidemiology
- **Modifiable Risk Factors:** Physical inactivity, improper posture, ergonomic stress, obesity, smoking, uncontrolled systemic comorbidities.
- **Non-Modifiable Risk Factors:** Age, genetic predisposition, congenital anatomical variations, gender predisposition.
- **Epidemiology:** Commonly encountered in Indian tertiary care centers and outpatient physiotherapy departments across age cohorts.

### 6. Pathophysiology Flowchart
\`\`\`
[Initial Insult / Etiological Factor]
          ↓
[Acute Cellular / Tissue Stress or Mechanical Failure]
          ↓
[Inflammatory Cascade Release / Neurovascular Alteration]
          ↓
[Secondary Tissue Edema, Ischemia, or Muscle Spasm]
          ↓
[Pain Signal Transmission via Nociceptive Fibers & Central Sensitization]
          ↓
[Altered Biomechanics, Compensatory Movement Patterns & Functional Disability]
\`\`\`

### 7. Clinical Manifestations
- **Cardinal Symptoms:** Localized or radiating pain, stiffness, functional fatigue, impaired coordination or range of motion.
- **Key Physical Signs:** Tenderness upon palpation, swelling/effusion, protective muscle spasm, altered reflex or tone response, abnormal gait pattern.
- **Functional Impact:** Reduced independence in Activities of Daily Living (ADLs), transfers, vocational duties, and recreational mobility.

### 8. Diagnostic Investigations
- **Laboratory Biomarkers:** Complete blood counts (CBC), ESR, CRP, metabolic panels, or cerebrospinal fluid (CSF) analysis when clinically indicated.
- **Imaging Modalities:** Plain radiography (X-ray for bony architecture/alignment), MRI (gold standard for soft-tissue, ligamentous, and neuro-parenchymal evaluation), CT scan for complex osseous trauma.
- **Specialized Tests:** Electrodiagnostic studies (EMG/NCV), Doppler ultrasonography for peripheral vascular competence.

### 9. Medical & Surgical Management
- **Pharmacotherapy:** Analgesics, NSAIDs, muscle relaxants, disease-modifying agents, or disease-specific medical therapies.
- **Surgical Indications:** Structural instability, failure of conservative therapy, progressive neurological deficit, or severe mechanical blockage.
- **Surgical Approaches:** Decompression, open reduction and internal fixation (ORIF), reconstructive soft-tissue repairs, or excision.

### 10. Physiotherapy Implications
- **Primary Indications:** Pain modulation, restoration of physiological arthrokinematics and osteokinematics, muscle re-education, neuromuscular facilitation, and aerobic conditioning.
- **Absolute Contraindications:** Acute unreduced fracture, active untreated deep vein thrombosis (DVT), uncontrolled severe hypertension, acute intracranial hemorrhage.
- **Relative Contraindications:** Marked osteoporosis, severe acute local inflammation, fragile skin status in chronic corticosteroid therapy.

### 11. Physiotherapy Precautions & Red Flags
- Monitor baseline resting vitals (heart rate, blood pressure, SpO2) before, during, and after exercise progression.
- Discontinue treatment immediately if patient presents with dizziness, sudden chest pain, syncope, or progressive sensory loss.
- Always observe weight-bearing restrictions prescribed by orthopaedic or neurosurgical teams.

### 12. Complications & Long-Term Sequelae
- Secondary joint contractures, disuse muscle atrophy, chronic pain syndromes, complex regional pain syndrome (CRPS), deep vein thrombosis, and postural deformities.

### 13. Prognosis & Recovery Timelines
- **Acute Phase (Weeks 0–2):** Focus on tissue protection, edema control, and gentle active-assisted movements.
- **Subacute Phase (Weeks 2–6):** Progressive loading, active ROM restoration, isometric to isotonic strengthening.
- **Remodeling & Functional Phase (Weeks 6–12+):** Functional task training, endurance, proprioceptive re-education, and return to vocational/sports activities.

### 14. High-Yield Examination Points & Key References
- **2-Mark Tip:** State the exact diagnostic definition and two cardinal physical signs.
- **5-Mark Tip:** Draw the pathophysiology flowchart and write a table of physiotherapy precautions.
- **10-Mark Question:** Discuss clinical features, investigative findings, and formulate a phase-wise physical therapy rehabilitation program with short- and long-term goals.
- **Key References:**
  1. *O'Sullivan SB, Schmitz TJ.* Physical Rehabilitation. 7th Edition.
  2. *Kisner C, Colby LA.* Therapeutic Exercise: Foundations and Techniques.
  3. *Maheshwari J.* Essential Orthopaedics. 6th Edition.
  4. *Davidson's Principles and Practice of Medicine.* 24th Edition.
`;
}

function getCurriculumCaseFallback(subject: string, topic: string) {
  return {
    caseTitle: `Clinical Case Scenario: Management of ${topic}`,
    patientDemographics: {
      age: 48,
      gender: 'Male',
      occupation: 'School Administrator',
    },
    chiefComplaints: [
      `Progressive difficulty with functional movement and local pain during weight bearing for 3 weeks`,
      `Morning stiffness lasting approximately 35 minutes`,
      `Inability to participate in brisk walking and stair climbing`,
    ],
    historyOfPresentIllness: `The patient reports an insidious onset of discomfort 3 weeks ago following prolonged desk work and occasional lifting. Symptoms have steadily progressed, currently rating 6/10 on the NPRS scale during functional movement.`,
    pastMedicalSurgicalHistory: `Known case of Type 2 Diabetes Mellitus for 6 years on oral hypoglycemic agents. No previous surgical history.`,
    clinicalExaminationFindings: {
      vitals: `BP: 126/82 mmHg, HR: 74 bpm, SpO2: 98% on room air, BMI: 26.8 kg/m2`,
      observation: `Antalgic posture observed, mild compensatory trunk tilt toward the non-affected side during terminal stance`,
      palpation: `Grade II tenderness over the anatomical landmark, localized mild thermal elevation without erythema`,
      functionalAssessment: `Active movement restricted by 20 degrees compared to contralateral side due to pain and muscular guarding`,
    },
    investigationReports: [
      `Plain Radiography: Preservation of major joint space, mild subchondral sclerosis`,
      `Serum Fasting Blood Sugar: 128 mg/dL, HbA1c: 6.9%`,
    ],
    medicalDiagnosis: `Clinical presentation consistent with primary ${topic} with secondary biomechanical compensation.`,
    physiotherapyAssessment: {
      impairments: [
        `Moderate pain (NPRS 6/10 during active loading)`,
        `Restricted active and passive physiological motion`,
        `Muscular weakness (MMT Grade 3+/5 in stabilizing musculature)`,
      ],
      activityLimitations: [
        `Difficulty with transfer activities and sustained walking beyond 15 minutes`,
        `Altered stair ascent and descent mechanics`,
      ],
      participationRestrictions: [
        `Inability to manage routine community outdoor errands and recreational sports`,
      ],
    },
    problemList: [
      `Pain and tissue irritability`,
      `Joint hypomobility and soft-tissue tightness`,
      `Neuromuscular inhibition and stabilizer weakness`,
      `Altered movement kinematics and functional gait deficit`,
    ],
    treatmentGoals: {
      shortTerm: [
        `Reduce pain from NPRS 6/10 to 3/10 within 2 weeks`,
        `Restore functional range of motion by 15 degrees in primary restriction plane`,
        `Improve active stabilizer activation from Grade 3+ to 4/5`,
      ],
      longTerm: [
        `Full pain-free physiological movement restoration within 6 weeks`,
        `Independent, non-antalgic community ambulation up to 45 minutes`,
        `Independent execution of prescribed Home Exercise Program without adverse symptoms`,
      ],
    },
    treatmentPlan: [
      `Pain modulation: Cryotherapy / superficial heat combined with gentle Grade I-II joint mobilization`,
      `Active-assisted to active range of motion exercises within pain-free envelope (10 reps, 3 sets)`,
      `Graded isometric stabilization exercises transitioning to closed kinematic chain loading`,
      `Functional gait re-education and ergonomic work station correction`,
    ],
    interactiveQuestions: [
      {
        id: 1,
        question: `Which clinical objective test is most appropriate to confirm the underlying primary impairment in this patient?`,
        options: [
          `Targeted provocative orthopedic / neurological special test specific to ${topic}`,
          `Routine resting blood pressure measurement only`,
          `Immediate maximum resistance 1RM test`,
          `Passive stretching beyond maximum pain threshold`,
        ],
        correctOptionIndex: 0,
        clinicalRationale: `Targeted clinical tests combined with physiological range assessment allow exact localization of the involved structure and differentiation from referred pain patterns.`,
      },
      {
        id: 2,
        question: `What is the primary physical therapy treatment priority during the acute symptomatic phase?`,
        options: [
          `Aggressive high-velocity manipulation and heavy weightlifting`,
          `Pain relief, tissue protection, gentle mobilization, and preventing secondary disuse atrophy`,
          `Complete strict bed rest with complete immobilization for 4 weeks`,
          `Discharge without home exercise guidance`,
        ],
        correctOptionIndex: 1,
        clinicalRationale: `During the acute phase, minimizing inflammatory irritation, controlling pain, and maintaining joint play prevent arthrofibrosis and secondary muscle atrophy.`,
      },
    ],
  };
}

function getCurriculumAssessmentFallback(subject: string, condition: string): string {
  return `### Standardized Clinical Assessment Protocol: ${condition}
**Subject:** ${subject} | **Parul Institute of Physiotherapy and Research**

#### 1. Patient Demographics & Subjective Profile
- **Personal Information:** Name, Age, Gender, Occupation, Hand Dominance, PIPTR Clinical Registration Number.
- **Chief Complaint:** Onset, duration, nature of symptoms (aching, burning, sharp), 24-hour pattern.
- **Pain Rating:** Numerical Pain Rating Scale (NPRS 0–10) at rest, with movement, and peak night pain.
- **History of Present Illness (HPI):** Mechanism of onset (insidious vs traumatic), previous episodes, treatment taken.
- **Past Medical History:** Diabetes, hypertension, cardiac disorders, steroid usage, surgical history.

#### 2. Objective Physical Examination
- **Observation:** Postural alignment, deformities, swelling, muscle wasting, trophic skin changes, antalgic adaptations.
- **Palpation:** Temperature difference, localized tenderness (Grade I–IV), muscle spasm, trigger points, bony landmarks.
- **Range of Motion (ROM):** Goniometric measurement of Active (AROM) and Passive (PROM), end-feel assessment (firm, soft, hard, empty).
- **Muscle Testing (MMT):** Oxford Medical Research Council (MRC) 0–5 scale for prime movers and dynamic stabilizers.

#### 3. Condition-Specific Special Tests
- Key diagnostic orthopedic or neurological provocative tests with documented sensitivity/specificity.
- Neurodynamic testing (ULNT, Slump test, SLR) where radiculopathy is suspected.
- Joint play evaluation (accessory gliding, distraction, compression according to Maitland/Kaltenborn principles).

#### 4. Standardized Functional Outcome Measures
- Patient-Reported Outcome Measures (e.g., Berg Balance Scale, Oswestry Disability Index, DASH, LEFS, WOMAC).
- Functional movement testing (Timed Up and Go, 6-Minute Walk Test, Single Leg Stance).

#### 5. Red Flags & Contraindications
- Unexplained weight loss, history of cancer, bilateral numbness/paraesthesia, saddle anesthesia, bowel/bladder dysfunction, sudden severe unremitting nocturnal pain.
`;
}

function getCurriculumTreatmentFallback(subject: string, condition: string, phase: string): string {
  return `### Evidence-Informed Physiotherapy Treatment Plan: ${condition}
**Phase:** ${phase.toUpperCase()} STAGE | **Subject:** ${subject}

#### Clinical Safety Notice
*Strictly for BPT academic training. Treatment plans must be verified through individual clinical evaluation under PIPTR Clinical Faculty supervision.*

---

#### 1. Treatment Objectives
- **Short-Term (Weeks 1–2):** Decrease pain score by $\\ge 50\\%$, resolve periarticular edema, maintain joint arthrokinematics, activate inhibited stabilizers.
- **Long-Term (Weeks 3–6):** Achieve full symmetrical active range of motion, restore muscle strength to Grade 5/5, restore normal functional movement patterns and independence in daily activities.

#### 2. Exercise Prescription & Dosage
- **Phase I (Acute/Protection):**
  - Cryotherapy / superficial moist heat for 15 minutes post-activity.
  - Gentle active-assisted ROM exercises (10 repetitions, 2 sets, 2x daily within pain tolerance).
  - Isometric stabilization contractions (submaximal 50% effort, 5-second hold, 10 repetitions).
- **Phase II (Subacute/Restoration):**
  - Progressive closed kinematic chain exercises.
  - Dynamic stretching and joint mobilization (Maitland Grade III sustained glides).
  - Concentric-eccentric muscle re-education (12–15 reps, 3 sets at 60% 1RM).
- **Phase III (Functional/Advanced):**
  - Proprioceptive and balance perturbation training.
  - High-demand task simulation and plyometric or agility drills as indicated.

#### 3. Progression Criteria
- Transition to higher loading only when patient achieves zero resting pain, pain $\\le 2/10$ with previous phase exercises, and no reactive swelling within 24 hours.
`;
}

function getCurriculumExamFallback(subject: string, topic: string): string {
  return `### BPT 5th Semester University Examination Question Bank: ${topic}
**Subject:** ${subject} | **Parul University Examination Blueprint**

---

#### Section A: 2-Mark Short Answer Questions (Bloom's: Remember / Understand)
1. **Define ${topic} and mention two primary clinical signs.** *(2 Marks | Unit 2 | Difficulty: Easy)*
   - *Key Marking Points:* 1 mark for standardized clinical definition; 0.5 mark each for two verified clinical signs.
2. **List four absolute contraindications to vigorous physiotherapy in ${topic}.** *(2 Marks | Unit 3 | Difficulty: Medium)*
   - *Key Marking Points:* 0.5 mark for each valid contraindication (e.g. unreduced fracture, acute DVT, severe infection).

---

#### Section B: 5-Mark Short Essay Questions (Bloom's: Understand / Apply)
1. **Describe the clinical features, investigations, and medical management of ${topic}.** *(5 Marks | Unit 2 | Difficulty: Medium)*
   - *Key Marking Points:* Clinical presentation (2 marks), diagnostic investigations (1.5 marks), medical/surgical protocol (1.5 marks).
2. **Explain the step-by-step physical therapy assessment and goal formulation for a patient with ${topic}.** *(5 Marks | Unit 4 | Difficulty: Medium)*
   - *Key Marking Points:* Subjective & objective assessment breakdown (2.5 marks), short- and long-term SMART goals (2.5 marks).

---

#### Section C: 10-Mark Long Clinical Essay (Bloom's: Analyze / Evaluate)
1. **A 52-year-old patient presents with classic manifestations of ${topic}. Discuss the surgical/medical management and design a comprehensive 3-phase physiotherapy rehabilitation protocol.** *(10 Marks | Unit 3 & 5 | Difficulty: Hard)*
   - *Marking Breakdown:*
     - Aetiology & Pathophysiology: 2 Marks
     - Clinical Examination & Special Tests: 2 Marks
     - Phase 1 (Acute) Physiotherapy: 2 Marks
     - Phase 2 (Subacute) Physiotherapy: 2 Marks
     - Phase 3 (Functional Recovery) & Home Advice: 2 Marks

---

#### Section D: Multiple Choice Questions (MCQs)
1. Which of the following is considered the gold standard imaging modality for evaluating soft-tissue pathology in ${topic}?
   - A) Plain Anteroposterior Radiograph
   - B) Magnetic Resonance Imaging (MRI) *(Correct)*
   - C) B-Mode Ultrasound
   - D) Bone Densitometry (DEXA)
   - *Rationale: MRI delivers superior soft tissue contrast resolution and multiplanar visualization.*

2. During the acute stage of ${topic}, which physical therapy intervention is strictly CONTRAINDICATED?
   - A) High-velocity end-range passive joint manipulation *(Correct)*
   - B) Cryotherapy application for pain relief
   - C) Submaximal pain-free isometric contractions
   - D) Neutral resting splinting/positioning
   - *Rationale: High-velocity thrust at end-range creates mechanical stress on acutely inflamed or torn tissues.*

---

#### Section E: Practical OSCE Station Rubric (5 Scoring Steps)
- **Station:** Clinical Assessment & Special Test Demonstration for ${topic}
- **Time Allocated:** 5 Minutes
- **Scoring Rubric (10 Marks Total):**
  1. Patient communication, consent, and comfortable positioning (2 Marks)
  2. Accurate anatomical palpation and identification of landmarks (2 Marks)
  3. Correct execution of the standardized diagnostic maneuver (3 Marks)
  4. Proper interpretation of positive findings vs false positives (2 Marks)
  5. Ergonomic therapist posture and professional conduct (1 Mark)
`;
}

function getCurriculumCrossSearchFallback(query: string): string {
  return `### Cross-Subject Clinical Synthesis: "${query}"
**PIPTR BPT 5th Semester Academic Knowledge Engine (2026–27)**

---

#### 1. Neuro Medicine-I
- **Medical Pathology & Presentation:** Detailed assessment of central or peripheral neurological involvement, lesion localization, upper vs lower motor neuron signs, and diagnostic imaging (MRI/CT/EMG).
- **Medical Pharmacology:** Disease-modifying agents, anti-spasticity medications, and neuroprotective protocols.

#### 2. PFD Neuro (Physical Functional Diagnosis in Neurology)
- **Clinical Assessment:** Tone assessment via Modified Ashworth Scale (MAS), deep tendon reflexes, cranial nerve examination, coordination, Berg Balance Scale, Timed Up and Go (TUG).
- **Physiotherapy Intervention:** Mat activities, bridging, rolling, sitting/standing balance re-education, transfer training, PNF patterns, task-oriented gait training.

#### 3. Surgery-I
- **Surgical Procedures & Post-Op Considerations:** Relevant surgical interventions (e.g. decompression, excision, shunts, reconstructive procedures), incision healing, drainage monitoring, and surgical wound precautions.
- **Respiratory & Ward Care:** Post-operative chest physiotherapy, early out-of-bed mobilization, deep vein thrombosis (DVT) prophylaxis.

#### 4. Orthopaedics
- **Biomechanics & Musculoskeletal Links:** Secondary musculoskeletal deformities, joint subluxation risks, fracture risks due to altered weight-bearing or disuse osteopenia.
- **Orthopaedic Interventions:** Corrective osteotomies, soft-tissue releases, or orthotic prescription (AFO, KAFO).

#### 5. PFD PTMS (Physical Functional Diagnosis in Musculoskeletal)
- **Biomechanics & Joint Integrity:** Assessment of joint hypomobility or hypermobility, secondary postural compensations, muscle length testing, and selective tissue tension testing.
- **Manual Therapy:** Maitland peripheral joint mobilization (Grades I-IV) for contracture prevention, myofascial release, therapeutic exercise.

#### 6. General Medicine-I
- **Systemic Comorbidities:** Management of associated hypertension, diabetes mellitus, cardiovascular endurance limitations, deep infection risks, and nutritional support.
- **Monitoring:** Exercise vitals monitoring, metabolic tolerance, and hydration status during intensive rehabilitation sessions.
`;
}

// Development Vite Middleware setup or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClinicaAI BPT 5th Sem Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
