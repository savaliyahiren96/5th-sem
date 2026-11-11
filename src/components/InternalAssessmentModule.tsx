import React, { useState } from 'react';
import { StudentRecord, AssessmentSchemeConfig } from '../types';
import { DEFAULT_ASSESSMENT_SCHEME, calculateInternalScore } from '../data/studentsData';
import {
  Award,
  Download,
  Filter,
  Search,
  Sliders,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Save,
  FileSpreadsheet,
} from 'lucide-react';

interface InternalAssessmentModuleProps {
  students: StudentRecord[];
  onUpdateStudents: (updated: StudentRecord[]) => void;
  userRole: 'student' | 'faculty';
}

export const InternalAssessmentModule: React.FC<InternalAssessmentModuleProps> = ({
  students,
  onUpdateStudents,
  userRole,
}) => {
  const [scheme, setScheme] = useState<AssessmentSchemeConfig>(DEFAULT_ASSESSMENT_SCHEME);
  const [isConfiguringScheme, setIsConfiguringScheme] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    midsemRaw: number;
    assignments: number;
    tests: number;
    clinicalLogbook: number;
    attendance: number;
  }>({
    midsemRaw: 45,
    assignments: 4,
    tests: 4,
    clinicalLogbook: 4,
    attendance: 4,
  });

  // Calculate statistics across all students
  const totalStudents = students.length || 1;
  const scores = students.map((s) => s.totalInternal);
  const highest = Math.max(...scores).toFixed(1);
  const lowest = Math.min(...scores).toFixed(1);
  const classAvg = (scores.reduce((a, b) => a + b, 0) / totalStudents).toFixed(1);
  const passCount = students.filter((s) => s.totalInternal >= 20).length; // 50% pass = 20/40
  const passRate = Math.round((passCount / totalStudents) * 100);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = selectedWard === 'All' || s.postingWard === selectedWard;
    return matchesSearch && matchesWard;
  });

  const handleStartEdit = (s: StudentRecord) => {
    setEditingStudentId(s.id);
    setEditFormData({
      midsemRaw: s.midsemRaw,
      assignments: s.otherAssessmentMarks.assignments,
      tests: s.otherAssessmentMarks.tests,
      clinicalLogbook: s.otherAssessmentMarks.clinicalLogbook,
      attendance: s.otherAssessmentMarks.attendance,
    });
  };

  const handleSaveEdit = (studentId: string) => {
    const { midsemConverted, totalInternal } = calculateInternalScore(
      editFormData.midsemRaw,
      editFormData.assignments,
      editFormData.tests,
      editFormData.clinicalLogbook,
      editFormData.attendance,
      scheme
    );

    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        midsemRaw: editFormData.midsemRaw,
        midsemConverted,
        otherAssessmentMarks: {
          assignments: editFormData.assignments,
          tests: editFormData.tests,
          clinicalLogbook: editFormData.clinicalLogbook,
          attendance: editFormData.attendance,
        },
        totalInternal,
      };
    });

    onUpdateStudents(updated);
    setEditingStudentId(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Roll No',
      'Name',
      'Ward',
      'Midsem Raw (60)',
      'Midsem Converted (20)',
      'Assignments (5)',
      'Tests (5)',
      'Logbook (5)',
      'Attendance (5)',
      'Total Internal (40)',
      'Practical (50)',
    ];

    const rows = students.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.postingWard}"`,
      s.midsemRaw,
      s.midsemConverted,
      s.otherAssessmentMarks.assignments,
      s.otherAssessmentMarks.tests,
      s.otherAssessmentMarks.clinicalLogbook,
      s.otherAssessmentMarks.attendance,
      s.totalInternal,
      s.practicalScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PIPTR_BPT5_Internal_Marks_Sheet_2026_27.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Module Header */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>Parul University Approved Assessment Scheme</span>
              <span aria-hidden="true">·</span>
              <span>Total 40 Marks</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Internal Assessment Management System
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Formula: Midsem Contribution = (Raw Marks / 60) &times; 20 + Configurable Other Assessment (20 Marks)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConfiguringScheme(!isConfiguringScheme)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Scheme Weights</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV / Excel</span>
            </button>
          </div>
        </div>

        {/* 2. Scheme Configuration Drawer */}
        {isConfiguringScheme && (
          <div className="mt-4 p-5 bg-teal-50/70 border border-teal-200 rounded-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-teal-950">
                  Faculty Configurable Internal Assessment Breakdown
                </h3>
                <p className="text-xs text-teal-800">
                  The approved scheme fixes Midsem at 20 marks (converted from 60 raw marks). The remaining 20 marks are distributed among faculty-approved components.
                </p>
              </div>
              <button
                onClick={() => setIsConfiguringScheme(false)}
                className="text-xs text-teal-900 underline font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <span className="text-[11px] font-bold text-slate-500 block">1. Midsem Exam (Converted)</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">20 Marks</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">(Raw 60 &rarr; 20)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <span className="text-[11px] font-bold text-slate-500 block">2. Assignments</span>
                <input
                  type="number"
                  value={scheme.otherComponents.assignments}
                  onChange={(e) =>
                    setScheme({
                      ...scheme,
                      otherComponents: { ...scheme.otherComponents, assignments: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-16 px-2 py-1 border border-slate-300 rounded font-bold text-sm tabular-nums mt-1"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">Approved Weight</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <span className="text-[11px] font-bold text-slate-500 block">3. Weekly Unit Tests</span>
                <input
                  type="number"
                  value={scheme.otherComponents.weeklyTests}
                  onChange={(e) =>
                    setScheme({
                      ...scheme,
                      otherComponents: { ...scheme.otherComponents, weeklyTests: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-16 px-2 py-1 border border-slate-300 rounded font-bold text-sm tabular-nums mt-1"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">Approved Weight</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <span className="text-[11px] font-bold text-slate-500 block">4. Clinical Logbook & Case</span>
                <input
                  type="number"
                  value={scheme.otherComponents.clinicalLogbook}
                  onChange={(e) =>
                    setScheme({
                      ...scheme,
                      otherComponents: { ...scheme.otherComponents, clinicalLogbook: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-16 px-2 py-1 border border-slate-300 rounded font-bold text-sm tabular-nums mt-1"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">Approved Weight</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <span className="text-[11px] font-bold text-slate-500 block">5. Attendance %</span>
                <input
                  type="number"
                  value={scheme.otherComponents.attendance}
                  onChange={(e) =>
                    setScheme({
                      ...scheme,
                      otherComponents: { ...scheme.otherComponents, attendance: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-16 px-2 py-1 border border-slate-300 rounded font-bold text-sm tabular-nums mt-1"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">Approved Weight</span>
              </div>
            </div>

            <div className="text-[11px] text-teal-900 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
              <span>
                Total Configured Marks: {20 + Object.values(scheme.otherComponents).reduce((a, b) => a + b, 0)} / 40 Marks Maximum
              </span>
            </div>
          </div>
        )}

        {/* 3. Statistical Performance Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-200 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Class Average</span>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {classAvg} <span className="text-xs text-slate-500 font-normal">/ 40</span>
            </div>
            <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">71% Mean Score</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Highest Score</span>
            <div className="text-xl font-bold text-emerald-700 tabular-nums mt-0.5">
              {highest} <span className="text-xs text-slate-500 font-normal">/ 40</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Rank 1 in 5th Sem</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Lowest Score</span>
            <div className="text-xl font-bold text-rose-700 tabular-nums mt-0.5">
              {lowest} <span className="text-xs text-slate-500 font-normal">/ 40</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Needs Remedial</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Pass Rate (&ge;20 Marks)</span>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {passRate}%
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              {passCount} of {totalStudents} Eligible
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Cohort Size</span>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {students.length}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">PIPTR Batch 2026–27</span>
          </div>
        </div>
      </section>

      {/* 4. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name or roll number (e.g. PU-BPT24-001)..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-teal-700"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Clinical Ward:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-xs focus:outline-teal-700"
          >
            <option value="All">All Clinical Rotations</option>
            <option value="Neuro Rehabilitation Ward">Neuro Rehab</option>
            <option value="Orthopaedic Trauma & Post-Op Ward">Ortho Trauma</option>
            <option value="Surgery & ICU Clinical Unit">Surgery & ICU</option>
            <option value="Outpatient Musculoskeletal Rehab (OPD)">Musculoskeletal OPD</option>
            <option value="Paediatric & Child Physiotherapy Unit">Paediatric Unit</option>
            <option value="Cardio-Respiratory & Step-Down ICU">Cardio-Respiratory</option>
          </select>
        </div>
      </div>

      {/* 5. Student Internal Marks Table */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Clinical Ward</th>
                <th className="p-3 text-right">Midsem (60)</th>
                <th className="p-3 text-right">Midsem Conv (20)</th>
                <th className="p-3 text-right">Assign (5)</th>
                <th className="p-3 text-right">Tests (5)</th>
                <th className="p-3 text-right">Logbook (5)</th>
                <th className="p-3 text-right">Attend (5)</th>
                <th className="p-3 text-right font-bold text-slate-900 bg-teal-50/50">Total Internal (40)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStudents.map((s) => {
                const isEditing = editingStudentId === s.id;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-600">
                      {s.rollNo}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                    <td className="p-3 text-slate-600 truncate max-w-[160px]">{s.postingWard}</td>

                    {/* Midsem Raw */}
                    <td className="p-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          max={60}
                          min={0}
                          value={editFormData.midsemRaw}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, midsemRaw: parseFloat(e.target.value) || 0 })
                          }
                          className="w-14 px-1.5 py-0.5 border border-teal-400 rounded text-right tabular-nums text-xs"
                        />
                      ) : (
                        <span>{s.midsemRaw}</span>
                      )}
                    </td>

                    {/* Midsem Converted */}
                    <td className="p-3 text-right tabular-nums font-semibold text-slate-700">
                      {isEditing
                        ? ((editFormData.midsemRaw / 60) * 20).toFixed(2)
                        : s.midsemConverted.toFixed(2)}
                    </td>

                    {/* Assignments */}
                    <td className="p-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          max={5}
                          min={0}
                          step={0.1}
                          value={editFormData.assignments}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, assignments: parseFloat(e.target.value) || 0 })
                          }
                          className="w-12 px-1 py-0.5 border border-teal-400 rounded text-right tabular-nums text-xs"
                        />
                      ) : (
                        <span>{s.otherAssessmentMarks.assignments}</span>
                      )}
                    </td>

                    {/* Weekly Tests */}
                    <td className="p-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          max={5}
                          min={0}
                          step={0.1}
                          value={editFormData.tests}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, tests: parseFloat(e.target.value) || 0 })
                          }
                          className="w-12 px-1 py-0.5 border border-teal-400 rounded text-right tabular-nums text-xs"
                        />
                      ) : (
                        <span>{s.otherAssessmentMarks.tests}</span>
                      )}
                    </td>

                    {/* Clinical Logbook */}
                    <td className="p-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          max={5}
                          min={0}
                          step={0.1}
                          value={editFormData.clinicalLogbook}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, clinicalLogbook: parseFloat(e.target.value) || 0 })
                          }
                          className="w-12 px-1 py-0.5 border border-teal-400 rounded text-right tabular-nums text-xs"
                        />
                      ) : (
                        <span>{s.otherAssessmentMarks.clinicalLogbook}</span>
                      )}
                    </td>

                    {/* Attendance Marks */}
                    <td className="p-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          max={5}
                          min={0}
                          step={0.1}
                          value={editFormData.attendance}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, attendance: parseFloat(e.target.value) || 0 })
                          }
                          className="w-12 px-1 py-0.5 border border-teal-400 rounded text-right tabular-nums text-xs"
                        />
                      ) : (
                        <span>{s.otherAssessmentMarks.attendance}</span>
                      )}
                    </td>

                    {/* Final Internal Marks (out of 40) */}
                    <td className="p-3 text-right tabular-nums font-bold text-slate-900 bg-teal-50/50">
                      {isEditing
                        ? (
                            (editFormData.midsemRaw / 60) * 20 +
                            editFormData.assignments +
                            editFormData.tests +
                            editFormData.clinicalLogbook +
                            editFormData.attendance
                          ).toFixed(2)
                        : s.totalInternal.toFixed(2)}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(s.id)}
                          className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded"
                          title="Save Marks"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(s)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                          title="Edit Marks"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
