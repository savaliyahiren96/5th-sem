import React, { useState } from 'react';
import { SubjectConfig, SubjectId, StudentRecord } from '../types';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Search,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  Activity,
  Award,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface MasterDashboardProps {
  subjects: SubjectConfig[];
  students: StudentRecord[];
  onSelectSubject: (id: SubjectId) => void;
  onOpenSearchWithQuery: (q: string) => void;
  onNavigateToTab: (tab: any) => void;
  totalStudentsCount: number;
  onUpdateStudentsCount: (newCount: number) => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  subjects,
  students,
  onSelectSubject,
  onOpenSearchWithQuery,
  onNavigateToTab,
  totalStudentsCount,
  onUpdateStudentsCount,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isEditingStudents, setIsEditingStudents] = useState(false);
  const [tempStudentCount, setTempStudentCount] = useState(totalStudentsCount.toString());

  // Metrics calculations
  const totalUnits = subjects.reduce((sum, s) => sum + s.totalUnits, 0);
  const completedUnits = subjects.reduce((sum, s) => sum + s.completedUnits, 0);
  const totalTopics = subjects.reduce((sum, s) => sum + s.totalTopics, 0);
  const completedTopics = subjects.reduce((sum, s) => sum + s.completedTopics, 0);
  const completedPercent = Math.round((completedTopics / totalTopics) * 100);
  const pendingPercent = 100 - completedPercent;

  const avgAttendance = (
    students.reduce((sum, s) => sum + s.attendancePercent, 0) / (students.length || 1)
  ).toFixed(1);

  const avgInternal = (
    students.reduce((sum, s) => sum + s.totalInternal, 0) / (students.length || 1)
  ).toFixed(1);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onOpenSearchWithQuery(searchInput.trim());
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchInput(query);
    onOpenSearchWithQuery(query);
  };

  const handleSaveStudentCount = () => {
    const val = parseInt(tempStudentCount, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateStudentsCount(val);
      setIsEditingStudents(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Academic Command Center Header */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
              <span>Academic Year 2026–27</span>
              <span aria-hidden="true">·</span>
              <span>Bachelor of Physiotherapy (BPT)</span>
              <span aria-hidden="true">·</span>
              <span>Fifth Semester</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              5th Semester Master Hub
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Parul Institute of Physiotherapy and Research (PIPTR), Parul University
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center">
              <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
                Total Cohort
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {totalStudentsCount}
                </span>
                <span className="text-xs text-slate-500">Students</span>
                <button
                  onClick={() => setIsEditingStudents(true)}
                  className="text-[11px] text-teal-700 hover:text-teal-900 underline font-medium ml-1"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center">
              <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
                Internal Scheme
              </span>
              <span className="text-lg font-bold text-slate-900 tabular-nums">40 Marks</span>
              <span className="text-[11px] text-slate-500 ml-1">(20 Midsem + 20 Others)</span>
            </div>
          </div>
        </div>

        {/* Modal for editing student count */}
        {isEditingStudents && (
          <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-teal-950">Update Total Students Enrolled:</span>
              <input
                type="number"
                value={tempStudentCount}
                onChange={(e) => setTempStudentCount(e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-teal-300 rounded bg-white text-slate-900 tabular-nums focus:outline-teal-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveStudentCount}
                className="px-3 py-1 bg-teal-700 text-white rounded text-xs font-medium hover:bg-teal-800 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingStudents(false)}
                className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs font-medium hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Global AI Search Engine Input */}
        <div className="mt-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any disease, surgical procedure, fracture, special test, or syllabus topic across all 6 subjects..."
                className="w-full pl-12 pr-28 py-3.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm rounded-lg border border-slate-200 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md transition-colors"
              >
                AI Search
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" /> Cross-Subject Highlights:
            </span>
            {[
              'Stroke & Hemiplegia',
              'ACL Tear & Reconstruction',
              'Neck of Femur Fracture',
              'Parkinson’s Disease',
              'Modified Radical Mastectomy',
              'Adhesive Capsulitis',
              'Tuberculosis & Chest PT',
            ].map((query) => (
              <button
                key={query}
                onClick={() => handleQuickSearch(query)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 rounded text-slate-700 transition-colors border border-slate-200 text-xs"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* High-Level Semester Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Core Subjects</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">6</div>
            <div className="text-[11px] text-slate-500 mt-1">6 Dedicated AI Agents</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Total Teaching Units</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {completedUnits} / {totalUnits}
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-1">
              {Math.round((completedUnits / totalUnits) * 100)}% Units Active
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Syllabus Completion</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {completedPercent}%
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              {pendingPercent}% Pending for Endsem
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Class Avg Attendance</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {avgAttendance}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Mandatory &ge; 75%</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Internal Marks Avg</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {avgInternal} / 40
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-1">Class Median: 29.2</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Clinical Rotations</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">6 Units</div>
            <div className="text-[11px] text-slate-500 mt-1">Parul Sevashram Hospital</div>
          </div>
        </div>
      </section>

      {/* 2. Six Clickable Subject Navigation Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Six Individual Subject-Wise AI Agents
            </h2>
            <p className="text-xs text-slate-500">
              Select any subject card to enter its dedicated academic interface, condition database, and clinical intelligence tools.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('agents')}
            className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All Agent Workspaces</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, idx) => {
            const completion = Math.round((sub.completedTopics / sub.totalTopics) * 100);
            return (
              <div
                key={sub.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-600 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {sub.code} · Subject 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Units 1-{sub.syllabusExamSplit.midsemUnits.length} in Midsem
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {sub.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Agent: {sub.agentName}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {sub.shortDesc}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Syllabus Progress</span>
                      <span className="tabular-nums font-semibold text-slate-800">
                        {sub.completedTopics}/{sub.totalTopics} topics ({completion}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>

                  {/* High Yield syllabus preview */}
                  <div className="mt-3 text-[11px] text-slate-500 flex flex-wrap gap-1">
                    <span className="font-medium text-slate-700">Core Units:</span>
                    {sub.units.slice(0, 3).map((u) => (
                      <span key={u.unitNumber} className="text-slate-600">
                        U{u.unitNumber}
                        {u.unitNumber < 3 ? ' ·' : ''}
                      </span>
                    ))}
                    <span>+ {sub.units.length - 3} more</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onSelectSubject(sub.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-teal-700 hover:text-white text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200 hover:border-teal-700"
                  >
                    <span>Launch {sub.agentName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Operational Grid: Exams, Tests, Clinical Postings, Deadlines */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Examinations & Weekly Tests */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Upcoming Examinations & Weekly Tests
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('calendar')}
              className="text-xs text-teal-700 hover:underline font-medium"
            >
              Full Calendar
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            <div className="py-3 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                  Mid-Semester Exam · BPT504
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  Orthopaedics (Trauma, Spine & Fractures)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Units 1, 2, 3 · 60 raw marks converted to 20 marks
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 tabular-nums">Nov 23, 2026</span>
                <span className="block text-[10px] text-slate-500">10:00 AM - 01:00 PM</span>
              </div>
            </div>

            <div className="py-3 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                  Mid-Semester Exam · BPT501
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  General Medicine-I (Infections, Endocrine, Renal)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Units 1, 2, 3 · 60 raw marks
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 tabular-nums">Nov 25, 2026</span>
                <span className="block text-[10px] text-slate-500">10:00 AM - 01:00 PM</span>
              </div>
            </div>

            <div className="py-3 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
                  Weekly Test · BPT505
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  PFD Neuro: Tone (MAS) & Brunnstrom Motor Recovery
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Objective Viva & Practical Station demonstration
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 tabular-nums">Nov 14, 2026</span>
                <span className="block text-[10px] text-slate-500">02:00 PM - 03:00 PM</span>
              </div>
            </div>

            <div className="py-3 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
                  Weekly Test · BPT506
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  PFD PTMS: Maitland Grades & Frozen Shoulder
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Capsular pattern and accessory glide execution
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 tabular-nums">Nov 21, 2026</span>
                <span className="block text-[10px] text-slate-500">02:00 PM - 03:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Postings & Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Parul Sevashram Hospital Clinical Postings
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('clinical')}
                className="text-xs text-teal-700 hover:underline font-medium"
              >
                Logbook & Assistant
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Active Posting Shift: Batch A & B (102 Students)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Neuro Rehab · Ortho Post-Op · Surgery ICU · Musculoskeletal OPD
                  </p>
                </div>
                <span className="text-[11px] font-medium text-teal-800 bg-teal-100/60 px-2.5 py-1 rounded">
                  08:30 AM – 01:00 PM Daily
                </span>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Upcoming Assignment Deadline</span>
                </div>
                <p className="text-xs text-slate-800 mt-1">
                  Orthopaedics: Evidence-Based Phase-Wise ACL Reconstruction Protocol (6 Phases)
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-amber-100">
                  <span>Due Date: Nov 19, 2026 at 05:00 PM</span>
                  <span className="text-amber-800 font-semibold">Weightage: 5 Marks</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-900">
                  Clinical Logbook Certification Notice
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Students must record a minimum of 20 verified clinical case studies signed by the respective Clinical Supervisor to be eligible for Practical Exams.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Parul University Academic Regulations 2026–27</span>
            <button
              onClick={() => onNavigateToTab('assessment')}
              className="font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View Internal Assessment Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
