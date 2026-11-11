import React, { useState } from 'react';
import { SubjectConfig, StudentRecord } from '../types';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle2,
  Sliders,
  Sparkles,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface FacultyDashboardProps {
  subjects: SubjectConfig[];
  students: StudentRecord[];
  onUpdateStudents: (updated: StudentRecord[]) => void;
  totalStudentsCount: number;
  onUpdateStudentsCount: (cnt: number) => void;
  onNavigateToTab: (tab: any) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  subjects,
  students,
  onUpdateStudents,
  totalStudentsCount,
  onUpdateStudentsCount,
  onNavigateToTab,
}) => {
  const [studentCountInput, setStudentCountInput] = useState(totalStudentsCount.toString());
  const [testTitle, setTestTitle] = useState('Weekly MCQ Test: PFD PTMS Shoulder Assessment');
  const [testMarks, setTestMarks] = useState('20');
  const [createdTests, setCreatedTests] = useState<string[]>([
    'Orthopaedics Unit 1 Class Test (20 Marks)',
    'Neuro Medicine MCA Stroke Syndromes Viva',
    'General Medicine Endocrine Disorders Quiz',
  ]);

  // Attendance analytics
  const lowAttendanceStudents = students.filter((s) => s.attendancePercent < 75);

  const handleUpdateCount = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(studentCountInput, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateStudentsCount(val);
      alert(`Student cohort updated to ${val} students successfully.`);
    }
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (testTitle.trim()) {
      setCreatedTests([`${testTitle} (${testMarks} Marks)`, ...createdTests]);
      setTestTitle('');
    }
  };

  const handleExportFullReport = () => {
    const report = `PARUL INSTITUTE OF PHYSIOTHERAPY AND RESEARCH (PIPTR)
PARUL UNIVERSITY - BPT 5TH SEMESTER (2026-27)
ACADEMIC AND INTERNAL ASSESSMENT SUMMARY REPORT
Generated on: ${new Date().toLocaleDateString()}

Total Enrolled Students: ${students.length}
Subjects Evaluated: 6
1. General Medicine-I (BPT501)
2. Neuro Medicine-I (BPT502)
3. Surgery-I (BPT503)
4. Orthopaedics (BPT504)
5. PFD Neuro (BPT505)
6. PFD PTMS (BPT506)

Internal Assessment Formula:
Midsem (Raw 60 converted to 20) + Other Components (20 Marks) = 40 Marks Maximum

Class Average Internal Score: ${(
      students.reduce((a, b) => a + b.totalInternal, 0) / (students.length || 1)
    ).toFixed(2)} / 40
Class Average Attendance: ${(
      students.reduce((a, b) => a + b.attendancePercent, 0) / (students.length || 1)
    ).toFixed(1)}%
Students with Low Attendance (<75%): ${lowAttendanceStudents.length}

Certified by Head of Department & Faculty Board.
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PIPTR_BPT5_Faculty_Academic_Report_2026_27.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>PIPTR Faculty & Academic Administration</span>
              <span aria-hidden="true">·</span>
              <span>BPT 5th Semester</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Faculty Command & Examination Dashboard
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Cohort management, low attendance screening, test paper authoring, and academic council exports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportFullReport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Academic Report</span>
            </button>
          </div>
        </div>

        {/* 2. Key Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-2">
          {/* Update Cohort Count */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Total Enrolled Cohort</span>
              <Users className="w-4 h-4 text-teal-700" />
            </div>
            <p className="text-[11px] text-slate-500">
              Update the active student count for BPT 5th Semester (default 102).
            </p>
            <form onSubmit={handleUpdateCount} className="flex items-center gap-2">
              <input
                type="number"
                value={studentCountInput}
                onChange={(e) => setStudentCountInput(e.target.value)}
                className="w-24 px-2.5 py-1 text-xs border border-slate-300 rounded bg-white tabular-nums font-semibold"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-900"
              >
                Update
              </button>
            </form>
          </div>

          {/* Low Attendance Warning */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">Attendance Screening</span>
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-xl font-bold text-amber-900 tabular-nums">
              {lowAttendanceStudents.length} Students &lt; 75%
            </div>
            <p className="text-[11px] text-amber-800">
              Students falling below the mandatory university 75% minimum require formal notification before Midsem examinations.
            </p>
          </div>

          {/* Quick Syllabus Progress */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Midsem Readiness</span>
              <BookOpen className="w-4 h-4 text-teal-700" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">
              Units 1–3 Complete
            </div>
            <p className="text-[11px] text-slate-500">
              All 6 subjects have completed their mandatory Midsem syllabus scope across Units 1, 2, and 3.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Author New Weekly MCQ / Unit Test */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span>Create & Schedule New Weekly Assessment Test</span>
        </h2>

        <form onSubmit={handleCreateTest} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Test Title / Unit Scope</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="e.g., Weekly MCQ Test: Surgery-I Burns & Amputations"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-teal-700"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Max Marks</label>
            <input
              type="number"
              value={testMarks}
              onChange={(e) => setTestMarks(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-teal-700 tabular-nums"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors"
            >
              Publish Test to Students
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Recently Published Tests:</span>
          {createdTests.map((t, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* 4. Low Attendance Students List */}
      {lowAttendanceStudents.length > 0 && (
        <section className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Students Requiring Attendance Warning Letters ({lowAttendanceStudents.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">&lt; 75% Attendance Threshold</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {lowAttendanceStudents.slice(0, 8).map((s) => (
              <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <span className="font-bold text-slate-900">{s.name}</span>
                  <span className="text-slate-500 font-mono text-[11px] ml-2">({s.rollNo})</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-slate-600">{s.postingWard}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-rose-700 tabular-nums text-xs">
                    {s.attendancePercent}% Attendance
                  </span>
                  <button
                    onClick={() => alert(`Warning letter generated for ${s.name} (${s.rollNo}).`)}
                    className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-medium text-[11px]"
                  >
                    Generate Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
