import { ConditionAnimationDemo } from '../types';

export const ANIMATION_DEMOS: ConditionAnimationDemo[] = [
  {
    id: 'demo-acl-lachman',
    conditionId: 'acl-injury',
    title: 'ACL Tear & Lachman Test Biomechanical Demonstration',
    subjectId: 'pfd-ptms',
    subjectName: 'PFD PTMS / Orthopaedics',
    category: 'Special Test',
    totalDurationSeconds: 45,
    keyAnatomicalStructures: [
      'Anterior Cruciate Ligament (Anteromedial & Posterolateral bands)',
      'Tibial Plateau & Femoral Condyles',
      'Infrapatellar Fat Pad & Joint Line',
      'Hamstrings & Quadriceps Tendons',
    ],
    clinicalSignificance:
      'Lachman test is the gold standard diagnostic maneuver for acute ACL rupture (Sensitivity 85%, Specificity 94%), evaluating anterior tibial translation with the knee placed in 20°–30° flexion.',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Patient Positioning & Femoral Stabilization',
        durationSeconds: 10,
        therapistCue: 'Patient supine, completely relaxed. Place the knee in 20° to 30° flexion. Grasp the distal femur with your stabilizing hand above the patella.',
        biomechanicalAction: 'Eliminates hamstring co-contraction, relaxes the posterior joint capsule, and aligns the anteromedial band of the ACL parallel to the plane of anterior translation.',
        visualHighlight: 'Knee at exactly 25° flexion; stabilizing hand firmly locking distal femur against table.',
        jointAngleText: '25° Flexion',
      },
      {
        stepNumber: 2,
        phaseName: 'Tibial Anterior Translation Maneuver',
        durationSeconds: 15,
        therapistCue: 'Grasp the proximal tibia with your examining hand. Apply a brisk, firm anterior translating force while palpating the joint line with your thumb.',
        biomechanicalAction: 'Translates the tibia anteriorly on the stabilized femur. In an intact ACL, a crisp, abrupt stop (firm end-feel) occurs with <3mm translation.',
        visualHighlight: 'Examining hand executing anterior translation vector; thumb palpating joint line step-off.',
        jointAngleText: 'Anterior Glide Vector: 25-30N',
      },
      {
        stepNumber: 3,
        phaseName: 'End-Feel Differentiation (Normal vs Torn)',
        durationSeconds: 12,
        therapistCue: 'Evaluate end-point: Normal = abrupt hard ligamentous stop. Torn ACL = mushy, soft, empty end-feel with anterior excursion exceeding contralateral knee by >3-5mm.',
        biomechanicalAction: 'Torn ACL allows unobstructed anterior subluxation of the tibial plateau until secondary restraints (iliotibial band, posterior horn of medial meniscus) are engaged.',
        criticalSafetyWarning: 'Avoid performing during acute hemarthrosis without gentle handling; always verify posterior sag first to rule out PCL tear (avoid false positive Lachman).',
        visualHighlight: 'Grade III Lachman shows >10mm anterior excursion with soft endpoint.',
        jointAngleText: 'End-Feel Comparison',
      },
      {
        stepNumber: 4,
        phaseName: 'Phase-Wise ACL Reconstruction Rehabilitation Timeline',
        durationSeconds: 8,
        therapistCue: 'Phase 1: Full passive extension & quad activation (Weeks 0-2). Phase 2: Closed chain loading 0-60° (Weeks 3-6). Phase 3: Proprioception & running (Months 3-4). Phase 4: Return to sport (Months 6-9).',
        biomechanicalAction: 'Protects the newly fixed hamstring or patellar tendon autograft during revascularization while preventing arthrofibrosis.',
        visualHighlight: 'Timeline from early extension board to single-leg hop test.',
        jointAngleText: 'Full Extension Target: 0°',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'Lachman Test: Knee 20-30° flexion, stabilize femur, translate tibia anteriorly. Positive: Soft end-feel with >3mm displacement vs normal contralateral side.',
      flowchartSteps: [
        'Acute Knee Trauma with Non-Contact Pivot / Pop Sensation',
        'Physical Exam: Lachman Test + Pivot Shift + Joint Line Palpation',
        'Confirmatory MRI: Disruption of ACL fibers + Lateral bone bruise',
        'Prehabilitation: Resolve effusion, achieve full 0° extension, restore quad sets',
        'Surgical Reconstruction (BPTB / Hamstring Autograft) or Conservative Protocol',
        'Phased Rehab: Protection -> Hypertrophy -> Neuromuscular -> Return to Sport (LSI >90%)',
      ],
      homeExerciseInstructions: [
        'Prone leg hangs for 5 minutes 3x/day to preserve 0° terminal extension.',
        'Quad sets: Push back of knee firmly into bed, hold 5 seconds, 20 reps x 3 sets.',
        'Straight leg raises in hinged brace locked at 0° until zero quadriceps lag.',
        'Ankle pumps: 30 reps every hour while awake for DVT prophylaxis.',
      ],
      vivaQuestions: [
        {
          question: 'Why is the Lachman test superior to the Anterior Drawer test in acute ACL injuries?',
          answer:
            'At 90° flexion (Anterior Drawer), acute hemarthrosis and protective hamstring spasm cause a false negative block. At 20-30° flexion (Lachman), hamstrings are relaxed and fluid tension is minimized.',
        },
        {
          question: 'What is the "Ligamentization" timeline of an ACL autograft?',
          answer:
            'Avascular necrosis (Weeks 0-4) -> Revascularization (Weeks 6-12) -> Cellular proliferation & Collagen Remodeling (Months 3-12). The graft is biologically weakest between weeks 6 and 12.',
        },
      ],
      examMarkingPoints: [
        'Position of patient: Supine with knee at 20-30° flexion (2 Marks)',
        'Hand placement: Femoral stabilization above patella, tibial pull below tuberosity (2 Marks)',
        'Interpretation: End-feel (firm vs soft) and displacement (>3mm) (3 Marks)',
        'Precautions and ruling out PCL false positive (Posterior Sag) (2 Marks)',
        'Professional conduct and therapist posture (1 Mark)',
      ],
    },
  },
  {
    id: 'demo-maitland-grades',
    conditionId: 'maitland-grades',
    title: 'Maitland Joint Mobilization Concept & Grades (I to V)',
    subjectId: 'pfd-ptms',
    subjectName: 'PFD PTMS',
    category: 'Manual Therapy',
    totalDurationSeconds: 50,
    keyAnatomicalStructures: [
      'Articular Cartilage Surfaces (Convex / Concave)',
      'Joint Capsule & Capsular Ligaments',
      'Synovial Membrane & Mechanoreceptors (Type I, II, III)',
      'Restricting Tissue Resistance Barrier (R1 to R2)',
    ],
    clinicalSignificance:
      'Maitland passive oscillatory mobilizations are graded from I to V to treat pain (Grades I & II via gating mechanoreceptors) and mechanical hypomobility (Grades III & IV via plastic deformation of capsular adhesions).',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Grade I: Small Amplitude at Beginning of Range',
        durationSeconds: 10,
        therapistCue: 'Rapid, small-amplitude oscillations executed strictly within the first 10-15% of joint play. Never reach the resistance barrier (R1).',
        biomechanicalAction: 'Stimulates low-threshold Type I and II articular mechanoreceptors, modulating nociceptive input via the spinal pain gate mechanism.',
        visualHighlight: 'Fine rapid wave oscillation at 0-10% range before tissue resistance.',
        jointAngleText: 'Amplitude: 5-10% | Freq: 2-3 Hz',
      },
      {
        stepNumber: 2,
        phaseName: 'Grade II: Large Amplitude within Free Range',
        durationSeconds: 10,
        therapistCue: 'Smooth, large-amplitude oscillations moving through the mid-range of available motion, stopping short of any tissue resistance (R1).',
        biomechanicalAction: 'Promotes synovial fluid circulation, decreases periarticular edema, and relieves muscular guarding without stressing inflamed structures.',
        visualHighlight: 'Wide, flowing oscillatory wave covering 10-50% range.',
        jointAngleText: 'Amplitude: 40-50% | Freq: 1-2 Hz',
      },
      {
        stepNumber: 3,
        phaseName: 'Grade III: Large Amplitude into Resistance',
        durationSeconds: 10,
        therapistCue: 'Large-amplitude oscillations starting mid-range and pushing firmly into the tissue resistance barrier (past R1 toward R2).',
        biomechanicalAction: 'Applies cyclic mechanical tensile stress to shortened collagen fibers, stimulating plastic elongation of capsular adhesions.',
        visualHighlight: 'Deep wave entering shaded resistance zone (R1 to R2).',
        jointAngleText: 'Amplitude: 50-90% | Freq: 1-2 Hz',
      },
      {
        stepNumber: 4,
        phaseName: 'Grade IV: Small Amplitude at End of Range',
        durationSeconds: 10,
        therapistCue: 'High-frequency, small-amplitude oscillations executed strictly at the end-range of available movement against the limiting resistance barrier (R2).',
        biomechanicalAction: 'Maximizes plastic tissue elongation and breaks micro-adhesions without triggering gross joint irritation.',
        visualHighlight: 'Small rapid oscillations at 90-100% maximum tissue limit.',
        jointAngleText: 'Amplitude: 10% at R2 | Freq: 2-3 Hz',
      },
      {
        stepNumber: 5,
        phaseName: 'Grade V: High-Velocity Low-Amplitude Thrust (HVLA)',
        durationSeconds: 10,
        therapistCue: 'A quick, controlled thrust executed at the physiological/anatomical limit of joint play. Often accompanied by cavitation (audible pop).',
        biomechanicalAction: 'Alters motor neuron pool excitability, releases intra-articular gas bubbles (cavitation), and resets aberrant muscle spindle activity.',
        criticalSafetyWarning: 'Strictly contraindicated in osteopenia, acute inflammation, joint hypermobility, malignancy, or vertebral basilar insufficiency.',
        visualHighlight: 'Instantaneous sharp impulse past R2 within anatomical integrity.',
        jointAngleText: 'High Velocity Impulse',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'Grades I & II = Pain Modulation (Neurological). Grades III & IV = Mechanical Stretching (Arthrokinematic Range). Grade V = Manipulation (HVLA).',
      flowchartSteps: [
        'Assess Patient Pain (VAS) vs Resistance Barrier (R1/R2) in Movement Diagram',
        'Pain Dominant (Pain before Resistance) -> Prescribe Grade I or II Gentle Oscillations',
        'Stiffness Dominant (Resistance before Pain) -> Prescribe Grade III or IV Sustained/Oscillatory Glides',
        'Dosage: 2 to 3 sets of 60 seconds per direction; reassess active physiological motion immediately',
      ],
      homeExerciseInstructions: [
        'Follow mobilization with active range of motion within the newly gained range.',
        'Apply cold pack for 10-15 minutes if mild reactive soreness occurs post-treatment.',
        'Perform prescribed active-assisted stretches at least 2 times daily.',
      ],
      vivaQuestions: [
        {
          question: 'What is the neurophysiological basis for Grade I and II mobilization in pain relief?',
          answer:
            'Oscillations activate low-threshold cutaneous and articular mechanoreceptors (Type I & II), closing the presynaptic gate in the dorsal horn (Melzack & Wall Gate Control Theory) and suppressing transmission of nociceptive A-delta and C fibers.',
        },
        {
          question: 'State four absolute contraindications to Grade V manipulation.',
          answer:
            '1. Acute bone fracture or dislocation. 2. Severe osteoporosis / bone metastasis. 3. Active joint infection or osteomyelitis. 4. Vertebrobasilar arterial insufficiency (VBI) in cervical spine.',
        },
      ],
      examMarkingPoints: [
        'Definition and purpose of each of the 5 Maitland Grades (3 Marks)',
        'Explanation of Movement Diagram (Pain P1-P2 vs Resistance R1-R2) (3 Marks)',
        'Clinical indication for Pain-dominant vs Stiffness-dominant joints (2 Marks)',
        'Safety contraindications and therapist hand stabilization (2 Marks)',
      ],
    },
  },
  {
    id: 'demo-stroke-gait',
    conditionId: 'ischemic-stroke',
    title: 'Hemiplegic Stroke Gait Deviations & Re-Education Animation',
    subjectId: 'pfd-neuro',
    subjectName: 'PFD Neuro / Neuro Medicine',
    category: 'Gait Deviation',
    totalDurationSeconds: 50,
    keyAnatomicalStructures: [
      'Upper Motor Neuron Corticospinal Tract',
      'Extensor Synergy (Gluteus Maximus, Quadriceps, Gastrocnemius/Soleus)',
      'Pelvic Stabilizers (Gluteus Medius, Quadratus Lumborum)',
      'Dorsiflexor Deficit (Tibialis Anterior, Peroneus Longus)',
    ],
    clinicalSignificance:
      'Hemiplegic circumduction gait is characterized by lack of ankle dorsiflexion, knee hyperextension (genu recurvatum) during stance, and pelvic hiking with lateral leg swing during swing phase.',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Stance Phase: Genu Recurvatum & Equinovarus Loading',
        durationSeconds: 12,
        therapistCue: 'Observe the affected limb during initial contact: Forefoot strikes first due to spastic gastro-soleus. The knee snaps backwards into hyperextension (recurvatum) to compensate for weak quadriceps.',
        biomechanicalAction: 'Plantarflextion contracture or spasticity forces the tibial plateau posteriorly relative to the femur, stressing the posterior joint capsule.',
        visualHighlight: 'Foot hits in equinovarus; knee locks into -10° hyperextension during midstance.',
        jointAngleText: 'Midstance: Genu Recurvatum -10°',
      },
      {
        stepNumber: 2,
        phaseName: 'Swing Phase: Pelvic Hiking & Circumduction',
        durationSeconds: 15,
        therapistCue: 'Observe swing phase: Inability to selectively flex the hip and dorsiflex the ankle forces the patient to elevate the pelvis (hiking) and swing the stiff leg out in a wide lateral arc.',
        biomechanicalAction: 'Extensor synergy binds hip extension, knee extension, and ankle plantarflexion. Circumduction achieves ground clearance despite the functionally lengthened limb.',
        visualHighlight: 'Pelvis hikes vertically; foot arcs outward in a semicircular trajectory.',
        jointAngleText: 'Pelvic Hike + Wide Lateral Arc',
      },
      {
        stepNumber: 3,
        phaseName: 'Therapeutic Intervention: Ankle-Foot Orthosis (AFO) Setup',
        durationSeconds: 12,
        therapistCue: 'Fit a rigid or articulated AFO set at 90° neutral. Blocks ankle plantarflexion, prevents toe-drag, promotes genuine heel-strike, and dampens stance-phase genu recurvatum.',
        biomechanicalAction: 'Shifts ground reaction force vector anterior to knee joint axis during early stance, reducing posterior capsular shear forces.',
        visualHighlight: 'AFO positioned inside shoe; immediate normalization of heel strike.',
        jointAngleText: 'AFO Neutral Hold: 90°',
      },
      {
        stepNumber: 4,
        phaseName: 'Task-Oriented Gait Re-Education at Parallel Bars',
        durationSeconds: 11,
        therapistCue: 'Guide rhythmic step-forward training with sound leg first, forcing sustained weight bearing through the hemiplegic limb. Encourage active knee unlocking with step-through.',
        biomechanicalAction: 'Facilitates motor learning, activates central pattern generators, and encourages symmetric weight transfer.',
        visualHighlight: 'Therapist providing manual pelvic stability at parallel bars.',
        jointAngleText: 'Step-Through Gait Re-Education',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'Hemiplegic Gait: Equinovarus foot strike -> Genu recurvatum stance -> Pelvic hike + Circumduction swing. Treatment: AFO at 90°, quad strengthening, task-specific stepping.',
      flowchartSteps: [
        'UMN Lesion (Cerebrovascular Infarct / Hemorrhage in MCA Territory)',
        'Loss of Fractionated Motor Control + Emergence of Primitive Extensor Synergy',
        'Impairments: Weak Tibialis Anterior, Spastic Gastro-Soleus, Weak Gluteus Medius',
        'Kinematic Deviation: Stance Knee Hyperextension + Swing Phase Circumduction',
        'Interventions: Mat bridging -> Weight shifting -> AFO fitting -> Treadmill training with body weight support',
      ],
      homeExerciseInstructions: [
        'Bridging exercises on mat: Lift pelvis, hold 5 seconds, 15 reps x 2 sets.',
        'Standing weight-shift: Shift weight from sound to affected leg at kitchen counter, hold 10 seconds.',
        'Calf stretch against wall with knee extended to combat plantarflexor tightness.',
      ],
      vivaQuestions: [
        {
          question: 'What causes genu recurvatum in hemiplegic stroke patients?',
          answer:
            '1. Spasticity of the quadriceps and/or gastrocnemius. 2. Severe weakness of quadriceps leading to mechanical locking of the knee in hyperextension. 3. Deficit in proprioception at the knee joint.',
        },
        {
          question: 'What are the criteria for selecting an Ankle-Foot Orthosis (AFO)?',
          answer:
            '1. Inadequate ankle dorsiflexion during swing causing toe drag. 2. Varus/valgus ankle instability in stance. 3. Knee hyperextension during midstance. A solid AFO provides maximal stability; an articulated AFO allows push-off if dorsiflexion control is emerging.',
        },
      ],
      examMarkingPoints: [
        'Description of Stance Phase deviations (equinovarus, recurvatum) (3 Marks)',
        'Description of Swing Phase deviations (pelvic hike, circumduction) (3 Marks)',
        'Biomechanical rationale for AFO prescription (2 Marks)',
        'Physical therapy re-education protocol with progressive exercises (2 Marks)',
      ],
    },
  },
  {
    id: 'demo-frozen-shoulder',
    conditionId: 'frozen-shoulder',
    title: 'Adhesive Capsulitis (Frozen Shoulder) Glenohumeral Glides',
    subjectId: 'pfd-ptms',
    subjectName: 'PFD PTMS',
    category: 'Manual Therapy',
    totalDurationSeconds: 45,
    keyAnatomicalStructures: [
      'Glenohumeral Joint Capsule & Coracohumeral Ligament',
      'Rotator Cuff Interval (Supraspinatus, Subscapularis)',
      'Scapulothoracic Articulation',
      'Axillary Pouch & Inferior Glenohumeral Ligament (IGHL)',
    ],
    clinicalSignificance:
      'Adhesive capsulitis presents with contracture of the axillary pouch and coracohumeral ligament. Maitland inferior glides restore abduction, while posterior glides restore flexion and internal rotation.',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Capsular Pattern Assessment: ER > ABD > IR',
        durationSeconds: 10,
        therapistCue: 'Measure passive glenohumeral ROM with scapula stabilized: External rotation is most restricted (e.g., only 15°), followed by abduction (e.g., 60°), and internal rotation.',
        biomechanicalAction: 'Thickened fibrotic capsule severely constrains humeral head roll and glide, causing early compensatory scapular elevation.',
        visualHighlight: 'Scapula stabilizes on ribcage; humeral external rotation halts at 15° with firm capsular stop.',
        jointAngleText: 'Capsular Deficit: ER Restricted',
      },
      {
        stepNumber: 2,
        phaseName: 'Inferior Glenohumeral Glide (Restoring Abduction)',
        durationSeconds: 15,
        therapistCue: 'Patient supine with arm in resting abduction (30°-45°). Place webbing of your hand over superior humeral head. Apply a sustained inferior glide perpendicular to the glenoid plane.',
        biomechanicalAction: 'Stretches the contracted axillary pouch and inferior glenohumeral ligament complex (IGHL), allowing clearance under the acromion.',
        visualHighlight: 'Inferior force vector depressing humeral head into axillary fold.',
        jointAngleText: 'Inferior Glide Vector: Grade III',
      },
      {
        stepNumber: 3,
        phaseName: 'Posterior Glenohumeral Glide (Restoring Flexion / IR)',
        durationSeconds: 12,
        therapistCue: 'Flex shoulder to 90°, slight adduction. Apply direct posterior force along the long axis of the humerus, driving the humeral head against the posterior capsule.',
        biomechanicalAction: 'Tension is placed directly on the posterior and posteroinferior capsule, restoring the posterior slide necessary for full flexion.',
        visualHighlight: 'Posterior axial thrust pushing humeral head posteriorly on glenoid cavity.',
        jointAngleText: 'Posterior Glide Vector: Grade III-IV',
      },
      {
        stepNumber: 4,
        phaseName: 'Active-Assisted Pulley & Home Sleeper Stretch',
        durationSeconds: 8,
        therapistCue: 'Patient seated under overhead pulley; sound arm gently pulls rope to elevate affected shoulder into forward flexion within pain-free threshold.',
        biomechanicalAction: 'Maintains newly gained arthrokinematic excursion and prevents overnight adhesion formation.',
        visualHighlight: 'Overhead pulley rope elevating affected arm into smooth 120° elevation.',
        jointAngleText: 'Home Pulley Range: 120°',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'Frozen Shoulder: Freezing -> Frozen -> Thawing. Capsular Pattern: ER > ABD > IR. Treatment: Maitland Inferior & Posterior glides + Pulley exercises + Sleeper stretch.',
      flowchartSteps: [
        'Insidious Shoulder Pain + Gradual Loss of Active and Passive Elevation',
        'Clinical Triad: True capsular restriction, normal plain radiograph, empty/capsular end-feel',
        'Phase 1 (Freezing): Pain relief, gentle Grade I-II glides, pendulums, avoid aggressive stretching',
        'Phase 2 (Frozen): Grade III-IV stretching, inferior/posterior glides, end-range pulley exercises',
        'Phase 3 (Thawing): Strengthening dynamic stabilizers, eccentric rotators, functional reach',
      ],
      homeExerciseInstructions: [
        'Codman’s pendulum exercises: Lean over table, let arm hang limp, swing in gentle circles (2 min 3x/day).',
        'Finger ladder / wall walking: Walk fingers up wall to mark highest reach daily.',
        'Sleeper stretch: Side-lying on affected shoulder, gently push forearm downward into internal rotation.',
      ],
      vivaQuestions: [
        {
          question: 'What is Cyriax’s capsular pattern of the glenohumeral joint?',
          answer:
            'External rotation is most restricted, followed by abduction, and then internal rotation (ER > ABD > IR in order of limitation severity).',
        },
        {
          question: 'Why do we perform an inferior glide of the humerus to increase abduction?',
          answer:
            'According to the Convex-on-Concave rule, the convex humeral head must glide inferiorly inside the concave glenoid fossa during physiological abduction to prevent subacromial impingement.',
        },
      ],
      examMarkingPoints: [
        'Stages of adhesive capsulitis with duration and clinical features (3 Marks)',
        'Biomechanical explanation of convex-concave glide rule (3 Marks)',
        'Execution of Maitland inferior and posterior glides (2 Marks)',
        'Comprehensive home exercise regimen (Codman, pulley, wand) (2 Marks)',
      ],
    },
  },
  {
    id: 'demo-nof-fracture',
    conditionId: 'nof-fracture',
    title: 'Neck of Femur (NOF) Fracture Garden Stages & Walker Ambulation',
    subjectId: 'ortho',
    subjectName: 'Orthopaedics / Surgery',
    category: 'Surgical Post-Op Protocol',
    totalDurationSeconds: 45,
    keyAnatomicalStructures: [
      'Femoral Neck & Head (Trabecular Stress Lines)',
      'Lateral Epiphyseal & Retinacular Vessels (Ascending cervical arteries)',
      'Garden Stages I to IV Alignment',
      'Gluteus Medius & Tensor Fasciae Latae',
    ],
    clinicalSignificance:
      'NOF fractures are intracapsular fractures carrying a high risk of avascular necrosis (AVN) and non-union due to disruption of retinacular blood vessels, requiring specialized post-op weight-bearing progression.',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Garden Classification Staging (Stages I to IV)',
        durationSeconds: 12,
        therapistCue: 'Stage I: Incomplete/impacted fracture. Stage II: Complete non-displaced. Stage III: Complete partially displaced. Stage IV: Complete completely displaced with loss of trabecular alignment.',
        biomechanicalAction: 'Displacement in Stage III & IV tears the medial femoral circumflex artery retinacular branches, elevating AVN risk to >30-40%.',
        visualHighlight: 'X-ray simulation showing transition from non-displaced (Stage II) to completely displaced (Stage IV).',
        jointAngleText: 'Garden Stages I - IV',
      },
      {
        stepNumber: 2,
        phaseName: 'Post-Operative Day 1 Bed Exercises & Precautions',
        durationSeconds: 12,
        therapistCue: 'Following Hemiarthroplasty: Maintain abduction wedge between legs. Absolute avoidance of hip flexion >90°, adduction across midline, and internal rotation (Posterior dislocation precautions).',
        biomechanicalAction: 'Protects the newly seated femoral prosthesis while the posterior capsule and short external rotators repair.',
        criticalSafetyWarning: 'Never allow patient to cross legs or lean forward beyond 90° while seated in chair.',
        visualHighlight: 'Abduction pillow in place; patient performing submaximal isometric quad sets.',
        jointAngleText: 'Flexion Limit: <90° strictly',
      },
      {
        stepNumber: 3,
        phaseName: '3-Point Partial Weight-Bearing Walker Gait',
        durationSeconds: 13,
        therapistCue: 'Sequence: 1. Move walker forward. 2. Step operated leg forward putting only prescribed partial weight (e.g. 20-30%). 3. Step sound leg past operated limb.',
        biomechanicalAction: 'Transfers vertical ground reaction forces through the upper extremities into the walker frame, minimizing shear across the fracture/prosthetic interface.',
        visualHighlight: 'Walker moves first -> operated leg -> sound leg steps through smoothly.',
        jointAngleText: '3-Point Walker Ambulation',
      },
      {
        stepNumber: 4,
        phaseName: 'Gluteus Medius Strengthening & Anti-Trendelenburg Training',
        durationSeconds: 8,
        therapistCue: 'Progress to side-lying clamshells and standing hip abduction with elastic band to abolish Trendelenburg gait lurch.',
        biomechanicalAction: 'Restores coronal pelvic stability during single-limb support phase of community ambulation.',
        visualHighlight: 'Standing hip abduction against light resistance band.',
        jointAngleText: 'Gluteus Medius: Grade 4/5 Target',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'Neck of Femur: Intracapsular = high AVN risk. Garden I-IV. Posterior Hip Precautions: No flexion >90°, no adduction past midline, no internal rotation.',
      flowchartSteps: [
        'Elderly Fall -> Inability to Bear Weight, Shortened & Externally Rotated Limb',
        'AP Pelvis with Both Hips Radiograph -> Determine Garden Stage & Pauwels Angle',
        'Surgical Fixation: Cannulated screws (Young/Garden I-II) vs Hemi/Total Arthroplasty (Elderly/Garden III-IV)',
        'Day 1: Ankle pumps, isometric quads/gluteal sets, transfer to high chair with abduction pillow',
        'Day 2-3: Ambulation with walker (3-point partial loading), stair climbing (Up with Good, Down with Bad)',
      ],
      homeExerciseInstructions: [
        'Maintain abduction pillow between knees while sleeping in bed.',
        'Use raised toilet seat and firm high armchair with armrests.',
        'Stair climbing rule: "The good goes to heaven, the bad goes to hell" (Sound leg first going up, operated leg first going down).',
      ],
      vivaQuestions: [
        {
          question: 'What is the vascular supply of the femoral head and why is NOF fracture prone to AVN?',
          answer:
            'The primary blood supply comes from the ascending cervical branches (retinacular arteries) of the medial femoral circumflex artery. Because the neck is intracapsular, fractures shear these vessels, cutting off circulation to the proximal pole.',
        },
        {
          question: 'State the three classic posterior hip dislocation precautions post-arthroplasty.',
          answer:
            '1. Do not bend hip beyond 90 degrees. 2. Do not cross legs or ankles (no adduction). 3. Do not internally rotate the operated leg (keep toes pointing straight or slightly outwards).',
        },
      ],
      examMarkingPoints: [
        'Garden classification description of Stages I, II, III, and IV (3 Marks)',
        'Anatomical blood supply and mechanism of avascular necrosis (2 Marks)',
        'Post-operative Day 1 to Day 3 physical therapy protocol (3 Marks)',
        'Posterior dislocation precautions and gait re-education with walker (2 Marks)',
      ],
    },
  },
  {
    id: 'demo-mastectomy-pt',
    conditionId: 'mastectomy',
    title: 'Modified Radical Mastectomy Post-Op Shoulder Protocol & Lymphedema',
    subjectId: 'surgery',
    subjectName: 'Surgery-I',
    category: 'Surgical Post-Op Protocol',
    totalDurationSeconds: 45,
    keyAnatomicalStructures: [
      'Pectoralis Major & Serratus Anterior Musculature',
      'Axillary Lymph Node Drainage Basin (Level I, II, III)',
      'Thoracodorsal & Long Thoracic Nerves',
      'Axillary Surgical Closed-Suction Drain',
    ],
    clinicalSignificance:
      'Following Modified Radical Mastectomy (MRM) and axillary lymph node dissection, phased physical therapy prevents frozen shoulder and chest wall tightness while minimizing secondary arm lymphedema.',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Phase 1 (Days 1–3): Distal Mobility & Drain Safety',
        durationSeconds: 12,
        therapistCue: 'With suction drain in situ: Active squeeze ball hand pumps, wrist flexion/extension, and gentle elbow bending. Shoulder elevation must NOT exceed 90° to protect skin flap adhesion.',
        biomechanicalAction: 'Encourages venous and lymphatic return via distal muscle pumps without generating mechanical tension across the healing axillary wound flap.',
        criticalSafetyWarning: 'Strict limit: Shoulder abduction and flexion limited to <90° until surgical drain output is <30mL/24h and drain is removed.',
        visualHighlight: 'Hand squeeze ball and forearm pumps with drain safety clip visible.',
        jointAngleText: 'Shoulder Angle: <90° Max',
      },
      {
        stepNumber: 2,
        phaseName: 'Phase 2 (Days 4–7): Post-Drain Removal Range Restoration',
        durationSeconds: 12,
        therapistCue: 'Following drain removal: Initiate active-assisted wand exercises in supine, progressing to gentle wall climbing and shoulder shrugs/rolls.',
        biomechanicalAction: 'Gradually stretches healing pectoralis fascia and prevents soft-tissue cross-linking in the axillary space.',
        visualHighlight: 'Two-handed wand exercise gently lifting arm up to 120° in pain-free range.',
        jointAngleText: 'Wand Elevation: 120°',
      },
      {
        stepNumber: 3,
        phaseName: 'Phase 3 (Weeks 2–6): Full Range, Corner Stretch & Scapular Control',
        durationSeconds: 11,
        therapistCue: 'Corner chest wall stretch to restore pectoralis length, overhead pulley exercises, and progressive resistance tubing for serratus anterior and rhomboids.',
        biomechanicalAction: 'Realigns scapulothoracic rhythm, counters postoperative rounded-shoulder posture, and promotes functional reach.',
        visualHighlight: 'Corner stretch with forearms on doorframe restoring full chest expansion.',
        jointAngleText: 'Full Active Elevation: 160-180°',
      },
      {
        stepNumber: 4,
        phaseName: 'Complete Decongestive Therapy (CDT) & Arm Care',
        durationSeconds: 10,
        therapistCue: 'Manual Lymphatic Drainage (MLD) directed toward contralateral axillary and ipsilateral inguinal lymph nodes. Measure arm circumferences at 4 standardized landmarks.',
        biomechanicalAction: 'Bypasses obstructed axillary lymphatic basin via superficial anastomoses, minimizing interstitial protein accumulation.',
        visualHighlight: 'MLD directional arrows sweeping fluid across chest watershed toward healthy axilla.',
        jointAngleText: 'Lymphatic Watershed Clearance',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'MRM Post-Op: Days 1-3 distal pumping (<90° shoulder). Drain out -> wall climbing & wand. Weeks 2-6 -> corner stretch & strength. Lymphedema prevention: no BP/injections on operated arm.',
      flowchartSteps: [
        'MRM with Axillary Lymph Node Dissection Performed',
        'Day 1-3: Deep breathing, hand/wrist/elbow pumps, keep shoulder <90° with drain in situ',
        'Day 4-7: Drain removed, active-assisted wand flexion, wall ladder, shoulder circles',
        'Weeks 2-6: Pectoralis stretching, serratus anterior strengthening, full overhead reach',
        'Long-term Surveillance: Lymphedema screening (limb circumference every 3 months)',
      ],
      homeExerciseInstructions: [
        'Wand exercises: Hold walking stick with both hands, gently push operated arm overhead.',
        'Wall climbing: Stand facing wall, walk fingers upward, mark height with pencil.',
        'Strict Lifetime Arm Care: No blood pressure cuffs, blood draws, IV lines, or heavy bag carrying (>5kg) on the operated arm.',
      ],
      vivaQuestions: [
        {
          question: 'Why must shoulder abduction be limited to 90 degrees while the axillary drain is in place?',
          answer:
            'Elevation above 90 degrees pulls on the fresh surgical skin flap, creates dead space in the axillary hollow, increases seroma formation, and delays surgical flap adhesion to the chest wall.',
        },
        {
          question: 'What are the 4 pillars of Complete Decongestive Therapy (CDT) for lymphedema?',
          answer:
            '1. Manual Lymphatic Drainage (MLD). 2. Multi-layer short-stretch compression bandaging. 3. Decongestive remedial exercises while wearing bandaging. 4. Meticulous skin and nail hygiene.',
        },
      ],
      examMarkingPoints: [
        'Phase-wise exercise timeline (Day 1-3, Day 4-7, Weeks 2-6) (3 Marks)',
        'Biomechanical reason for drain precautions (2 Marks)',
        'Complete Decongestive Therapy (CDT) protocol and lymphatic watersheds (3 Marks)',
        'Patient education rules for lymphedema prevention (2 Marks)',
      ],
    },
  },
  {
    id: 'demo-chest-pt-drainage',
    conditionId: 'pneumonia',
    title: 'Postural Drainage Positioning & Chest PT Percussion Protocol',
    subjectId: 'gen-med',
    subjectName: 'General Medicine-I / Surgery-I',
    category: 'Chest Physiotherapy',
    totalDurationSeconds: 45,
    keyAnatomicalStructures: [
      'Tracheobronchial Tree & Segmental Bronchi',
      'Right & Left Lungs (Apical, Posterior, Anterior, Middle/Lingula, Basal Segments)',
      'Diaphragm & Intercostal Musculature',
      'Thoracic Cage Resonance Chambers',
    ],
    clinicalSignificance:
      'Postural drainage positions specific bronchopulmonary segments vertically so gravity assists secretions into primary bronchi, where rhythmic chest percussion (100–120 bpm) and vibrations clear mucus plugs.',
    phases: [
      {
        stepNumber: 1,
        phaseName: 'Auscultation & Segmental Localization',
        durationSeconds: 10,
        therapistCue: 'Auscultate all lung fields with stethoscope. Identify localized coarse crackles or decreased breath sounds (e.g. right lower lobe posterior basal segment consolidation).',
        biomechanicalAction: 'Identifies the precise bronchopulmonary segment requiring elevation above the carina.',
        visualHighlight: 'Stethoscope placed at lower lung base; lung segment highlights in amber.',
        jointAngleText: 'Auscultation: Crackles Localized',
      },
      {
        stepNumber: 2,
        phaseName: 'Postural Drainage Tilt & Positioning',
        durationSeconds: 13,
        therapistCue: 'Position patient: For lower lobe basal segments, place bed in 15° to 30° Trendelenburg tilt (head down, foot of bed elevated 30-45 cm). Patient prone with pillows under abdomen.',
        biomechanicalAction: 'Aligns the segmental bronchus perpendicular to the horizontal plane, utilizing gravitational force vectors to dislodge pooled secretions.',
        visualHighlight: 'Bed tilted 20° head-down; gravity arrow directing drainage toward trachea.',
        jointAngleText: 'Bed Tilt: 20° Trendelenburg',
      },
      {
        stepNumber: 3,
        phaseName: 'Chest Percussion (Clapping) & Vibration Technique',
        durationSeconds: 12,
        therapistCue: 'Cup hands with wrists relaxed. Clapping rhythmically at 100-120 bpm over affected thoracic segment for 3-5 minutes, followed by fine vibrations during expiration.',
        biomechanicalAction: 'Generates mechanical energy waves across chest wall through lung parenchyma, loosening viscous mucus from bronchial epithelium.',
        criticalSafetyWarning: 'Never percuss over bare skin, spine, kidneys, sternum, or fractured ribs; strictly contraindicated in pulmonary embolism or severe hemoptysis.',
        visualHighlight: 'Cupped hands creating acoustic energy waves through ribs into bronchi.',
        jointAngleText: 'Percussion Rhythm: 100-120 bpm',
      },
      {
        stepNumber: 4,
        phaseName: 'Active Cycle of Breathing (ACBT) & Splinted Cough',
        durationSeconds: 10,
        therapistCue: 'Have patient take 3 deep breaths with 3-second holds, then 2 forced expiratory huffs with mouth open ("O" shape), followed by splinted cough into tissue.',
        biomechanicalAction: 'Equal Pressure Point (EPP) moves progressively upstream, shearing sputum toward the pharynx for expectoration without bronchial collapse.',
        visualHighlight: 'Patient huffing with pillow splint held firmly across chest wall.',
        jointAngleText: 'ACBT: Breathing Control -> Huff',
      },
    ],
    materialKit: {
      pocketCardSummary:
        'Chest PT: Trendelenburg tilt for basal segments. Cupped hand percussion 100-120 bpm -> vibration on exhalation -> ACBT huffing & cough. Contraindicated in hemoptysis & head injury.',
      flowchartSteps: [
        'Chest Assessment: Auscultation crackles + Chest X-ray consolidation',
        'Positioning: Tilt segment vertically so branch drains downward toward main bronchus',
        'Percussion: 3-5 minutes cupped hands rhythm over thin cloth (100-120 claps/min)',
        'Vibration: Fine isometric manual shaking exclusively during patient expiration',
        'ACBT Clearing: Breathing control -> Thoracic expansion -> Forced Expiratory Technique (Huffing)',
      ],
      homeExerciseInstructions: [
        'Incentive spirometry: Inhale slowly to elevate all 3 balls, hold 3-5 seconds, 10 reps every hour.',
        'Deep diaphragmatic breathing with hand over belly.',
        'Huff coughing: Take medium breath, force air out saying "HUFF" twice like fogging a mirror.',
      ],
      vivaQuestions: [
        {
          question: 'What is the physical mechanism of cupping/percussion in chest physiotherapy?',
          answer:
            'Cupped hands trap an air cushion between the hand and chest wall. The resulting kinetic compression wave travels into the lung parenchyma without bruising skin, creating energy that shears mucus from bronchial walls.',
        },
        {
          question: 'Name four absolute contraindications to head-down (Trendelenburg) postural drainage.',
          answer:
            '1. Elevated intracranial pressure (ICP >20 mmHg). 2. Uncontrolled severe hypertension. 3. Recent meal / gastroesophageal reflux (aspiration risk). 4. Acute congestive heart failure / pulmonary edema.',
        },
      ],
      examMarkingPoints: [
        'Anatomical drainage positions for upper, middle, and lower lobes (3 Marks)',
        'Proper cupping and vibration hand techniques with physiological mechanism (3 Marks)',
        'Active Cycle of Breathing Technique (ACBT) step-by-step description (2 Marks)',
        'Contraindications and vital sign monitoring parameters (2 Marks)',
      ],
    },
  },
];
