export type SubjectId =
  | 'gen-med'
  | 'neuro-med'
  | 'surgery'
  | 'ortho'
  | 'pfd-neuro'
  | 'pfd-ptms';

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  code: string;
  agentName: string;
  agentRole: string;
  shortDesc: string;
  color: string;
  totalUnits: number;
  completedUnits: number;
  totalTopics: number;
  completedTopics: number;
  syllabusExamSplit: {
    midsemUnits: number[];
    endsemUnits: number[];
  };
  units: SyllabusUnit[];
  textbookReferences: string[];
}

export interface SyllabusUnit {
  unitNumber: number;
  unitTitle: string;
  examScope: 'Midsem & Endsem' | 'Endsem Only';
  status: 'Completed' | 'In Progress' | 'Pending';
  lecturesPlanned: number;
  lecturesTaken: number;
  topics: SyllabusTopic[];
}

export interface SyllabusTopic {
  id: string;
  title: string;
  category?: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  highYieldExam: boolean;
  learningObjectives: string[];
}

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  gender: 'Male' | 'Female';
  email: string;
  postingWard: string;
  attendancePercent: number;
  weeklyTestAvg: number; // out of 20
  midsemRaw: number; // out of 60
  midsemConverted: number; // out of 20 = (raw / 60) * 20
  otherAssessmentMarks: {
    assignments: number; // default 5
    tests: number; // default 5
    clinicalLogbook: number; // default 5
    attendance: number; // default 5
  };
  totalInternal: number; // out of 40
  practicalScore: number; // out of 50
  clinicalLogbookEntriesCount: number;
}

export interface AssessmentSchemeConfig {
  midsemMaxRaw: number; // 60
  midsemWeight: number; // 20
  otherComponentsWeight: number; // 20
  otherComponents: {
    assignments: number; // 5
    weeklyTests: number; // 5
    clinicalLogbook: number; // 5
    attendance: number; // 5
  };
  totalMax: number; // 40
}

export interface ClinicalPostingRotation {
  id: string;
  hospitalName: string;
  department: string;
  supervisorName: string;
  supervisorDesignation: string;
  startDate: string;
  endDate: string;
  studentsAssignedCount: number;
  shiftTiming: string;
  competenciesRequired: string[];
}

export interface ClinicalLogbookEntry {
  id: string;
  studentRollNo: string;
  studentName: string;
  date: string;
  department: string;
  patientAgeGender: string;
  diagnosis: string;
  chiefComplaints: string;
  physiotherapyIntervention: string;
  supervisorSignStatus: 'Approved & Signed' | 'Pending Review' | 'Revision Requested';
  supervisorNotes?: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  type: 'Lecture' | 'Clinical Posting' | 'Weekly Test' | 'Mid-Semester Exam' | 'End-Semester Exam' | 'Practical Exam' | 'Assignment' | 'Holiday' | 'Seminar';
  date: string;
  time: string;
  subjectId?: SubjectId;
  location: string;
  description: string;
}

export interface ClinicalCaseStudy {
  caseTitle: string;
  patientDemographics: {
    age: number;
    gender: string;
    occupation: string;
  };
  chiefComplaints: string[];
  historyOfPresentIllness: string;
  pastMedicalSurgicalHistory: string;
  clinicalExaminationFindings: {
    vitals: string;
    observation: string;
    palpation: string;
    functionalAssessment: string;
  };
  investigationReports: string[];
  medicalDiagnosis: string;
  physiotherapyAssessment: {
    impairments: string[];
    activityLimitations: string[];
    participationRestrictions: string[];
  };
  problemList: string[];
  treatmentGoals: {
    shortTerm: string[];
    longTerm: string[];
  };
  treatmentPlan: string[];
  interactiveQuestions: {
    id: number;
    question: string;
    options: string[];
    correctOptionIndex: number;
    clinicalRationale: string;
  }[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  authorOrSource: string;
  subjectId: SubjectId | 'all';
  type: 'Textbook' | 'Clinical Guideline' | 'Lecture Notes' | 'OSCE Checklist' | 'Research Paper';
  editionYear: string;
  topicsCovered: string[];
  downloadUrl?: string;
  summary: string;
}
