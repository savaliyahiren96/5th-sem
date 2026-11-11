import React from 'react';
import { SubjectId } from '../types';
import { Search, GraduationCap, BookOpen, Calendar, Stethoscope, Award, Users } from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'agents'
  | 'syllabus'
  | 'calendar'
  | 'clinical'
  | 'assessment'
  | 'knowledge'
  | 'faculty';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSubjectId: SubjectId | null;
  onOpenSearch: () => void;
  userRole: 'student' | 'faculty';
  setUserRole: (role: 'student' | 'faculty') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  userRole,
  setUserRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                CA
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors whitespace-nowrap">
                  ClinicaAI
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 font-normal ml-2">
                  BPT 5th Sem Master Hub (2026–27)
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Master Hub
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'agents'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent'
              }`}
            >
              6 Subject AI Agents
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'syllabus'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Syllabus & Calendar
            </button>

            <button
              onClick={() => setActiveTab('clinical')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'clinical'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Clinical Postings
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'assessment'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Internal Assessment
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'knowledge'
                  ? 'border-teal-700 text-teal-800 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Knowledge Database
            </button>
          </nav>

          {/* Zone 3: Primary Action & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Global Search trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors border border-slate-200"
              title="Global Cross-Subject AI Search"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline whitespace-nowrap">Global AI Search</span>
              <kbd className="hidden md:inline text-[10px] bg-white border border-slate-300 rounded px-1 text-slate-500">
                /
              </kbd>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setUserRole('student')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  userRole === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => {
                  setUserRole('faculty');
                  setActiveTab('faculty');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  userRole === 'faculty'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faculty View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 overflow-x-auto flex items-center gap-4 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`whitespace-nowrap ${activeTab === 'dashboard' ? 'text-teal-700 font-semibold' : ''}`}
        >
          Master Hub
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`whitespace-nowrap ${activeTab === 'agents' ? 'text-teal-700 font-semibold' : ''}`}
        >
          6 AI Agents
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`whitespace-nowrap ${activeTab === 'syllabus' ? 'text-teal-700 font-semibold' : ''}`}
        >
          Syllabus
        </button>
        <button
          onClick={() => setActiveTab('clinical')}
          className={`whitespace-nowrap ${activeTab === 'clinical' ? 'text-teal-700 font-semibold' : ''}`}
        >
          Clinical Postings
        </button>
        <button
          onClick={() => setActiveTab('assessment')}
          className={`whitespace-nowrap ${activeTab === 'assessment' ? 'text-teal-700 font-semibold' : ''}`}
        >
          Internal Marks
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`whitespace-nowrap ${activeTab === 'knowledge' ? 'text-teal-700 font-semibold' : ''}`}
        >
          Knowledge Base
        </button>
      </div>
    </header>
  );
};
