import React, { useState } from 'react';
import { SUBJECTS_DATA } from './data/subjectsData';
import { INITIAL_STUDENTS, generateInitialStudents } from './data/studentsData';
import { SubjectId, SubjectConfig, StudentRecord } from './types';
import { Header, ActiveTab } from './components/Header';
import { MasterDashboard } from './components/MasterDashboard';
import { SubjectAgentView } from './components/SubjectAgentView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SyllabusManager } from './components/SyllabusManager';
import { AcademicCalendarView } from './components/AcademicCalendarView';
import { ClinicalPostingModule } from './components/ClinicalPostingModule';
import { InternalAssessmentModule } from './components/InternalAssessmentModule';
import { FacultyDashboard } from './components/FacultyDashboard';
import { KnowledgeDatabaseView } from './components/KnowledgeDatabaseView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [subjects, setSubjects] = useState<SubjectConfig[]>(SUBJECTS_DATA);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(102);
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('ortho');
  const [userRole, setUserRole] = useState<'student' | 'faculty'>('student');

  // Global search modal state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleSelectSubject = (id: SubjectId) => {
    setSelectedSubjectId(id);
    setActiveTab('agents');
  };

  const handleOpenSearchWithQuery = (query: string) => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  const handleUpdateStudentCohort = (newCount: number) => {
    setTotalStudentsCount(newCount);
    const updated = generateInitialStudents(newCount);
    setStudents(updated);
  };

  const handleOpenTopicInAgent = (subId: SubjectId, topicName: string) => {
    setSelectedSubjectId(subId);
    setActiveTab('agents');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSubjectId={selectedSubjectId}
        onOpenSearch={() => {
          setSearchInitialQuery('');
          setIsSearchOpen(true);
        }}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: MASTER HUB (CENTRAL COMMAND CENTER) */}
        {activeTab === 'dashboard' && (
          <MasterDashboard
            subjects={subjects}
            students={students}
            onSelectSubject={handleSelectSubject}
            onOpenSearchWithQuery={handleOpenSearchWithQuery}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            totalStudentsCount={totalStudentsCount}
            onUpdateStudentsCount={handleUpdateStudentCohort}
          />
        )}

        {/* TAB 2: SIX SUBJECT-WISE AI AGENTS */}
        {activeTab === 'agents' && (
          <SubjectAgentView
            subject={currentSubject}
            allSubjects={subjects}
            onSelectAnotherSubject={(id) => setSelectedSubjectId(id as SubjectId)}
            onOpenCrossSubjectSearch={(topic) => handleOpenSearchWithQuery(topic)}
          />
        )}

        {/* TAB 3: SYLLABUS & LESSON PLAN MANAGEMENT */}
        {activeTab === 'syllabus' && (
          <SyllabusManager
            subjects={subjects}
            onUpdateSubjects={setSubjects}
            userRole={userRole}
          />
        )}

        {/* TAB 4: ACADEMIC CALENDAR & TIMETABLE */}
        {activeTab === 'calendar' && <AcademicCalendarView />}

        {/* TAB 5: CLINICAL POSTINGS & PATIENT CASE INTELLIGENCE */}
        {activeTab === 'clinical' && <ClinicalPostingModule />}

        {/* TAB 6: INTERNAL ASSESSMENT MODULE */}
        {activeTab === 'assessment' && (
          <InternalAssessmentModule
            students={students}
            onUpdateStudents={setStudents}
            userRole={userRole}
          />
        )}

        {/* TAB 7: FACULTY MANAGEMENT DASHBOARD */}
        {activeTab === 'faculty' && (
          <FacultyDashboard
            subjects={subjects}
            students={students}
            onUpdateStudents={setStudents}
            totalStudentsCount={totalStudentsCount}
            onUpdateStudentsCount={handleUpdateStudentCohort}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB 8: KNOWLEDGE DATABASE & TEXTBOOK REFERENCES */}
        {activeTab === 'knowledge' && (
          <KnowledgeDatabaseView onOpenTopicInAgent={handleOpenTopicInAgent} />
        )}
      </main>

      {/* Global AI Search Modal with Cross-Subject Synthesis */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchInitialQuery}
        subjects={subjects}
        onSelectSubject={handleSelectSubject}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">ClinicaAI · PIPTR Master Hub</span>
            <span className="mx-2">·</span>
            <span>Parul Institute of Physiotherapy and Research, Parul University (2026–27)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Bachelor of Physiotherapy (BPT) · 5th Semester</span>
            <span>·</span>
            <span className="text-teal-800 font-semibold">6 AI Subject Agents Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
