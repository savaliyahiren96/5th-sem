import React, { useState } from 'react';
import { SubjectConfig, SyllabusUnit, SyllabusTopic, ClinicalCaseStudy } from '../types';
import {
  BookOpen,
  GraduationCap,
  FileCheck2,
  ListTodo,
  FileSpreadsheet,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Printer,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Send,
  Loader2,
  Activity,
} from 'lucide-react';

interface SubjectAgentViewProps {
  subject: SubjectConfig;
  allSubjects: SubjectConfig[];
  onSelectAnotherSubject: (id: any) => void;
  onOpenCrossSubjectSearch: (q: string) => void;
  onOpenAnimationDemo?: (demoId: string) => void;
}

type AgentSubMode =
  | 'teach'
  | 'case'
  | 'assessment'
  | 'treatment'
  | 'exam'
  | 'syllabus';

export const SubjectAgentView: React.FC<SubjectAgentViewProps> = ({
  subject,
  allSubjects,
  onSelectAnotherSubject,
  onOpenCrossSubjectSearch,
  onOpenAnimationDemo,
}) => {
  const [activeMode, setActiveMode] = useState<AgentSubMode>('teach');

  // Selected Unit and Topic
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(subject.units[0]?.unitNumber || 1);
  const currentUnit = subject.units.find((u) => u.unitNumber === selectedUnitNumber) || subject.units[0];
  const [selectedTopic, setSelectedTopic] = useState<SyllabusTopic>(currentUnit?.topics[0] || {
    id: 'sample',
    title: 'General Clinical Condition',
    status: 'In Progress',
    highYieldExam: true,
    learningObjectives: [],
  });

  // State for AI Teaching Mode
  const [teachLevel, setTeachLevel] = useState<'simple' | 'intermediate' | 'advanced'>('intermediate');
  const [teachingContent, setTeachingContent] = useState<string>('');
  const [isTeachingLoading, setIsTeachingLoading] = useState<boolean>(false);
  const [copiedTeaching, setCopiedTeaching] = useState<boolean>(false);

  // State for Clinical Case Generator
  const [caseStudy, setCaseStudy] = useState<ClinicalCaseStudy | null>(null);
  const [isCaseLoading, setIsCaseLoading] = useState<boolean>(false);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: number]: number }>({});
  const [showCaseRationales, setShowCaseRationales] = useState<boolean>(false);

  // State for Assessment Assistant
  const [assessmentContent, setAssessmentContent] = useState<string>('');
  const [isAssessmentLoading, setIsAssessmentLoading] = useState<boolean>(false);

  // State for Treatment Planner
  const [treatmentPhase, setTreatmentPhase] = useState<'acute' | 'subacute' | 'chronic/functional'>('acute');
  const [treatmentContent, setTreatmentContent] = useState<string>('');
  const [isTreatmentLoading, setIsTreatmentLoading] = useState<boolean>(false);

  // State for Examination Generator
  const [examQuestionType, setExamQuestionType] = useState<string>('all');
  const [examContent, setExamContent] = useState<string>('');
  const [isExamLoading, setIsExamLoading] = useState<boolean>(false);

  // Trigger AI Teaching call
  const generateTeachingModule = async (topicTitle: string = selectedTopic.title, level: string = teachLevel) => {
    setIsTeachingLoading(true);
    try {
      const res = await fetch('/api/ai/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          topic: topicTitle,
          level,
          context: `BPT 5th Semester syllabus unit: ${currentUnit.unitTitle}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeachingContent(data.content);
      }
    } catch (err) {
      console.error('Failed to generate teaching module:', err);
    } finally {
      setIsTeachingLoading(false);
    }
  };

  // Trigger AI Clinical Case call
  const generateClinicalCase = async (topicTitle: string = selectedTopic.title) => {
    setIsCaseLoading(true);
    setStudentAnswers({});
    setShowCaseRationales(false);
    try {
      const res = await fetch('/api/ai/case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          topic: topicTitle,
          difficulty: 'exam-level',
        }),
      });
      const data = await res.json();
      if (data.success && data.case) {
        setCaseStudy(data.case);
      }
    } catch (err) {
      console.error('Failed to generate clinical case:', err);
    } finally {
      setIsCaseLoading(false);
    }
  };

  // Trigger AI Assessment Assistant call
  const generateAssessmentFormat = async (condition: string = selectedTopic.title) => {
    setIsAssessmentLoading(true);
    try {
      const res = await fetch('/api/ai/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          condition,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssessmentContent(data.content);
      }
    } catch (err) {
      console.error('Failed to generate assessment:', err);
    } finally {
      setIsAssessmentLoading(false);
    }
  };

  // Trigger AI Treatment Planner call
  const generateTreatmentPlan = async (condition: string = selectedTopic.title, phase: string = treatmentPhase) => {
    setIsTreatmentLoading(true);
    try {
      const res = await fetch('/api/ai/treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          condition,
          patientPhase: phase,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTreatmentContent(data.content);
      }
    } catch (err) {
      console.error('Failed to generate treatment plan:', err);
    } finally {
      setIsTreatmentLoading(false);
    }
  };

  // Trigger AI Examination Question call
  const generateExamQuestions = async (topicTitle: string = selectedTopic.title, qType: string = examQuestionType) => {
    setIsExamLoading(true);
    try {
      const res = await fetch('/api/ai/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          topic: topicTitle,
          questionType: qType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExamContent(data.content);
      }
    } catch (err) {
      console.error('Failed to generate exam questions:', err);
    } finally {
      setIsExamLoading(false);
    }
  };

  // Handle selecting a topic
  const handleSelectTopic = (topic: SyllabusTopic) => {
    setSelectedTopic(topic);
    if (activeMode === 'teach') {
      generateTeachingModule(topic.title, teachLevel);
    } else if (activeMode === 'case') {
      generateClinicalCase(topic.title);
    } else if (activeMode === 'assessment') {
      generateAssessmentFormat(topic.title);
    } else if (activeMode === 'treatment') {
      generateTreatmentPlan(topic.title, treatmentPhase);
    } else if (activeMode === 'exam') {
      generateExamQuestions(topic.title, examQuestionType);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTeaching(true);
    setTimeout(() => setCopiedTeaching(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Subject & Agent Header Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>{subject.code}</span>
              <span aria-hidden="true">·</span>
              <span>{subject.agentName}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">Official PIPTR 5th Sem Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {subject.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              {subject.agentRole} · {subject.shortDesc}
            </p>
          </div>

          {/* Quick Subject Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Switch Agent:</span>
            <select
              value={subject.id}
              onChange={(e) => onSelectAnotherSubject(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-teal-700"
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.agentName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Agent Sub-Feature Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-2">
          <button
            onClick={() => {
              setActiveMode('teach');
              if (!teachingContent) generateTeachingModule(selectedTopic.title);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'teach'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Teaching Mode (14-Points)</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('case');
              if (!caseStudy) generateClinicalCase(selectedTopic.title);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'case'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>AI Clinical Case Solver</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('assessment');
              if (!assessmentContent) generateAssessmentFormat(selectedTopic.title);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'assessment'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>AI Assessment Assistant</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('treatment');
              if (!treatmentContent) generateTreatmentPlan(selectedTopic.title);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'treatment'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>AI Treatment Planner</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('exam');
              if (!examContent) generateExamQuestions(selectedTopic.title);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'exam'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>AI Examination Generator</span>
          </button>

          <button
            onClick={() => setActiveMode('syllabus')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'syllabus'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Curriculum & Unit Browser</span>
          </button>

          {/* Animated Video & Material Kit shortcut */}
          {onOpenAnimationDemo && (
            <button
              onClick={() => onOpenAnimationDemo('demo-acl-lachman')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5"
              title="Launch animated biomechanical video simulation and material kit"
            >
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>Animated Biomechanics & Material Kit</span>
            </button>
          )}

          {/* Cross-subject shortcut */}
          <button
            onClick={() => onOpenCrossSubjectSearch(selectedTopic.title)}
            className="ml-auto px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1"
            title="Trace how this condition links to other 5 subjects"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Cross-Subject Link</span>
          </button>
        </div>
      </section>

      {/* 2. Main Two-Column Workspace: Unit/Topic Navigator on Left, Active Intelligence Tool on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Syllabus Condition Navigator */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Syllabus Units ({subject.units.length})
              </span>
              <span className="text-[10px] text-slate-500 font-medium">BPT 5th Sem</span>
            </div>

            {/* Unit Selector */}
            <div className="mt-3 space-y-1.5">
              {subject.units.map((unit) => (
                <button
                  key={unit.unitNumber}
                  onClick={() => {
                    setSelectedUnitNumber(unit.unitNumber);
                    if (unit.topics[0]) {
                      handleSelectTopic(unit.topics[0]);
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedUnitNumber === unit.unitNumber
                      ? 'bg-teal-50 text-teal-900 border border-teal-200 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">U{unit.unitNumber}: {unit.unitTitle.split(':')[1] || unit.unitTitle}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                    unit.examScope === 'Midsem & Endsem' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {unit.examScope === 'Midsem & Endsem' ? 'Midsem' : 'Endsem'}
                  </span>
                </button>
              ))}
            </div>

            {/* Condition / Topic List for the Selected Unit */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Conditions in Unit {selectedUnitNumber} ({currentUnit?.topics.length || 0})
              </span>
              <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
                {currentUnit?.topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTopic(t)}
                    className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedTopic.id === t.id
                        ? 'bg-slate-900 text-white font-medium shadow-xs'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="truncate pr-1">{t.title}</span>
                    {t.highYieldExam && (
                      <span className={`text-[9px] px-1 py-0.2 rounded shrink-0 ${
                        selectedTopic.id === t.id ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-amber-100 text-amber-800 font-medium'
                      }`}>
                        Exam
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Standard References Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-1">Standard Subject References:</span>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
              {subject.textbookReferences.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Active Intelligence Tool Workspace */}
        <div className="lg:col-span-3">
          {/* A. AI TEACHING MODE */}
          {activeMode === 'teach' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                    14-Point AI Teaching Engine · {subject.agentName}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    {selectedTopic.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Depth Level selector */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    {(['simple', 'intermediate', 'advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          setTeachLevel(lvl);
                          generateTeachingModule(selectedTopic.title, lvl);
                        }}
                        className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                          teachLevel === lvl
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(teachingContent)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                    title="Copy full 14-section notes"
                  >
                    {copiedTeaching ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Teaching Content Viewport */}
              {isTeachingLoading ? (
                <div className="py-24 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Generating 14-section comprehensive academic teaching module for {selectedTopic.title}...
                  </p>
                  <p className="text-xs text-slate-500">
                    Aligning with Parul University BPT 5th semester syllabus and clinical guidelines.
                  </p>
                </div>
              ) : teachingContent ? (
                <div className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed space-y-4">
                  <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-100 text-xs text-teal-900 flex items-center justify-between">
                    <span>
                      Standard 14 Academic Sections: Introduction, Definition, Classification, Etiology, Risk Factors, Pathophysiology, Clinical Features, Investigations, Medical Management, PT Implications, Precautions, Complications, Prognosis, and Exam Points.
                    </span>
                    <span className="font-semibold tabular-nums uppercase">Level: {teachLevel}</span>
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed bg-slate-50/50 p-6 rounded-lg border border-slate-200 font-normal">
                    {teachingContent}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Ready to Generate 14-Section Academic Notes
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click below to generate the complete teaching module for <span className="font-semibold text-slate-700">{selectedTopic.title}</span> with clinical pathophysiology flowcharts and physiotherapy precautions.
                  </p>
                  <button
                    onClick={() => generateTeachingModule(selectedTopic.title)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Teaching Module</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* B. AI CLINICAL CASE GENERATOR & INTERACTIVE SOLVER */}
          {activeMode === 'case' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                    Educational Clinical Simulator · Interactive Case Solving
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    Case Scenario: {selectedTopic.title}
                  </h2>
                </div>

                <button
                  onClick={() => generateClinicalCase(selectedTopic.title)}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Generate New Case</span>
                </button>
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Educational Simulation Notice:</span> All scenarios are synthetic patient profiles created for clinical reasoning and educational purposes at PIPTR. Never upload real identifiable patient information.
                </div>
              </div>

              {isCaseLoading ? (
                <div className="py-24 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Formulating realistic clinical scenario & assessment findings...
                  </p>
                </div>
              ) : caseStudy ? (
                <div className="space-y-6">
                  {/* Demographics Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block text-[11px]">Patient Age & Gender</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {caseStudy.patientDemographics.age} years · {caseStudy.patientDemographics.gender}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block text-[11px]">Occupation</span>
                      <span className="font-bold text-slate-900 text-sm truncate block">
                        {caseStudy.patientDemographics.occupation}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs md:col-span-2">
                      <span className="text-slate-500 block text-[11px]">Medical Diagnosis</span>
                      <span className="font-bold text-teal-900 text-sm">
                        {caseStudy.medicalDiagnosis}
                      </span>
                    </div>
                  </div>

                  {/* Chief Complaints & HPI */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                        Chief Complaints
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                        {caseStudy.chiefComplaints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                        History of Present Illness (HPI)
                      </span>
                      <p className="text-slate-700 leading-relaxed">{caseStudy.historyOfPresentIllness}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                        Past Medical / Surgical History
                      </span>
                      <p className="text-slate-700">{caseStudy.pastMedicalSurgicalHistory}</p>
                    </div>
                  </div>

                  {/* Clinical Examination & Investigations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                        Physical Examination Findings
                      </span>
                      <div>
                        <span className="font-medium text-slate-700">Vitals: </span>
                        <span className="text-slate-600">{caseStudy.clinicalExaminationFindings.vitals}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Observation: </span>
                        <span className="text-slate-600">{caseStudy.clinicalExaminationFindings.observation}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Palpation: </span>
                        <span className="text-slate-600">{caseStudy.clinicalExaminationFindings.palpation}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Functional Assessment: </span>
                        <span className="text-slate-600">{caseStudy.clinicalExaminationFindings.functionalAssessment}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                      <div>
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                          Investigation Reports
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700">
                          {caseStudy.investigationReports.map((inv, idx) => (
                            <li key={idx}>{inv}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-1">
                          Problem List (ICF Framework)
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700">
                          {caseStudy.problemList.map((pr, idx) => (
                            <li key={idx}>{pr}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Goals & Prescribed Plan */}
                  <div className="p-4 bg-teal-50/40 rounded-lg border border-teal-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-teal-950 uppercase tracking-wider text-[11px] block mb-1">
                          Short-Term Goals (1-2 Weeks)
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-800">
                          {caseStudy.treatmentGoals.shortTerm.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-teal-950 uppercase tracking-wider text-[11px] block mb-1">
                          Long-Term Goals (4-6 Weeks)
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-800">
                          {caseStudy.treatmentGoals.longTerm.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Case Solver Mode */}
                  <div className="p-5 bg-slate-900 text-white rounded-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Interactive Case Reasoning Solver</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Test your bedside diagnostic & treatment decision-making on this case.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowCaseRationales(!showCaseRationales)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-amber-300 border border-slate-700 transition-colors"
                      >
                        {showCaseRationales ? 'Hide Rationales' : 'Reveal Model Answers'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {caseStudy.interactiveQuestions?.map((q, qIndex) => {
                        const selectedOpt = studentAnswers[q.id];
                        const isCorrect = selectedOpt === q.correctOptionIndex;

                        return (
                          <div key={q.id} className="p-4 bg-slate-800/80 rounded-lg space-y-3 border border-slate-700">
                            <div className="text-xs font-semibold text-slate-200">
                              Question {qIndex + 1}: {q.question}
                            </div>

                            <div className="space-y-2">
                              {q.options.map((opt, optIndex) => {
                                const isOptionSelected = selectedOpt === optIndex;
                                return (
                                  <button
                                    key={optIndex}
                                    onClick={() => setStudentAnswers({ ...studentAnswers, [q.id]: optIndex })}
                                    className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                                      isOptionSelected
                                        ? 'bg-teal-600 text-white font-medium'
                                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {showCaseRationales && optIndex === q.correctOptionIndex && (
                                      <span className="text-[10px] bg-emerald-500 text-slate-900 font-bold px-1.5 py-0.5 rounded">
                                        Correct
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Rationale feedback */}
                            {(showCaseRationales || selectedOpt !== undefined) && (
                              <div className={`p-3 rounded text-xs mt-2 ${
                                isCorrect
                                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                                  : 'bg-slate-950 border border-slate-800 text-slate-300'
                              }`}>
                                <span className="font-bold block mb-0.5 text-amber-300">
                                  Clinical Rationale:
                                </span>
                                {q.clinicalRationale}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No Case Generated Yet</h3>
                  <button
                    onClick={() => generateClinicalCase(selectedTopic.title)}
                    className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
                  >
                    Generate Clinical Case for {selectedTopic.title}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* C. AI ASSESSMENT ASSISTANT */}
          {activeMode === 'assessment' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                    Standardized Assessment Protocol Formatter
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    Clinical Assessment: {selectedTopic.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateAssessmentFormat(selectedTopic.title)}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate Protocol</span>
                  </button>
                  <button
                    onClick={() => handleCopy(assessmentContent)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isAssessmentLoading ? (
                <div className="py-24 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Structuring subjective, objective, special tests, and red flags for {selectedTopic.title}...
                  </p>
                </div>
              ) : assessmentContent ? (
                <div className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200">
                  {assessmentContent}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Generate the complete clinical examination checklist and red-flag screening format.
                  </p>
                  <button
                    onClick={() => generateAssessmentFormat(selectedTopic.title)}
                    className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
                  >
                    Generate Assessment Format
                  </button>
                </div>
              )}
            </div>
          )}

          {/* D. AI TREATMENT PLANNER */}
          {activeMode === 'treatment' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                    Evidence-Informed Rehabilitation Protocol
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    Treatment Plan: {selectedTopic.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Phase selector */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    {(['acute', 'subacute', 'chronic/functional'] as const).map((ph) => (
                      <button
                        key={ph}
                        onClick={() => {
                          setTreatmentPhase(ph);
                          generateTreatmentPlan(selectedTopic.title, ph);
                        }}
                        className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                          treatmentPhase === ph
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {ph.split('/')[0]} Phase
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(treatmentContent)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clinical Verification Disclaimer */}
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-start gap-2 text-xs text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Clinical Safety Protocol:</span> Never apply blanket treatments. All physiotherapy interventions require baseline vitals verification, individual structural assessment, and supervising faculty approval at Parul Sevashram Hospital.
                </div>
              </div>

              {isTreatmentLoading ? (
                <div className="py-24 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Formulating phase-wise exercise dosage, progression criteria, and home regimen...
                  </p>
                </div>
              ) : treatmentContent ? (
                <div className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200">
                  {treatmentContent}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <ListTodo className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Generate the short-term and long-term goals, exercise prescriptions, and home program for {selectedTopic.title}.
                  </p>
                  <button
                    onClick={() => generateTreatmentPlan(selectedTopic.title)}
                    className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
                  >
                    Generate Treatment Plan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* E. AI EXAMINATION GENERATOR */}
          {activeMode === 'exam' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                    University Examination Blueprint & Bloom's Taxonomy Tagging
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    Exam Question Bank: {selectedTopic.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={examQuestionType}
                    onChange={(e) => {
                      setExamQuestionType(e.target.value);
                      generateExamQuestions(selectedTopic.title, e.target.value);
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-teal-700"
                  >
                    <option value="all">All Question Types (2M, 5M, 10M, MCQ, OSCE)</option>
                    <option value="2-marks">2-Mark Short Answers</option>
                    <option value="5-marks">5-Mark Short Essays</option>
                    <option value="10-marks">10-Mark Long Clinical Essays</option>
                    <option value="mcqs">Multiple Choice Questions (MCQs)</option>
                    <option value="viva">Viva Voce Questions</option>
                    <option value="osce">Practical OSCE Station Rubric</option>
                  </select>

                  <button
                    onClick={() => handleCopy(examContent)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isExamLoading ? (
                <div className="py-24 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Compiling university examination questions with model marking schemes and Bloom's taxonomy tags...
                  </p>
                </div>
              ) : examContent ? (
                <div className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200">
                  {examContent}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Generate university board exam questions, MCQs, and OSCE scoring rubrics for {selectedTopic.title}.
                  </p>
                  <button
                    onClick={() => generateExamQuestions(selectedTopic.title)}
                    className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
                  >
                    Generate Exam Questions
                  </button>
                </div>
              )}
            </div>
          )}

          {/* F. CURRICULUM & SYLLABUS BROWSER */}
          {activeMode === 'syllabus' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">
                  Official BPT 5th Semester Syllabus Mapping · {subject.code}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Complete Curriculum Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Parul Institute of Physiotherapy and Research · Academic Year 2026–27
                </p>
              </div>

              <div className="space-y-4">
                {subject.units.map((unit) => (
                  <div key={unit.unitNumber} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{unit.unitTitle}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{unit.topics.length} Conditions / Topics</span>
                          <span aria-hidden="true">·</span>
                          <span>{unit.lecturesTaken} of {unit.lecturesPlanned} Lectures Taken</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          unit.examScope === 'Midsem & Endsem' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {unit.examScope}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          unit.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {unit.topics.map((tp) => (
                        <div
                          key={tp.id}
                          className="p-2.5 bg-white rounded border border-slate-200 text-xs flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-800">{tp.title}</span>
                            {tp.highYieldExam && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-1 rounded shrink-0">
                                High Yield
                              </span>
                            )}
                          </div>
                          {tp.learningObjectives.length > 0 && (
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {tp.learningObjectives.join(', ')}
                            </p>
                          )}
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{tp.status}</span>
                            <button
                              onClick={() => {
                                handleSelectTopic(tp);
                                setActiveMode('teach');
                              }}
                              className="text-[11px] text-teal-700 hover:text-teal-900 font-medium"
                            >
                              Open in AI Teacher &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
