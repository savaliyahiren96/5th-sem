import React, { useState } from 'react';
import { SubjectConfig, SyllabusUnit, SyllabusTopic } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Upload,
  FileText,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Download,
} from 'lucide-react';

interface SyllabusManagerProps {
  subjects: SubjectConfig[];
  onUpdateSubjects: (updated: SubjectConfig[]) => void;
  userRole: 'student' | 'faculty';
}

export const SyllabusManager: React.FC<SyllabusManagerProps> = ({
  subjects,
  onUpdateSubjects,
  userRole,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'gen-med');
  const [scopeFilter, setScopeFilter] = useState<'All' | 'Midsem & Endsem' | 'Endsem Only'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Pending'>('All');
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [uploadedSyllabusFiles, setUploadedSyllabusFiles] = useState<string[]>([
    'PIPTR_BPT5_Official_Syllabus_2026_27.pdf',
    'Faculty_Lesson_Plan_Approved_Academic_Council.docx',
  ]);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const toggleTopicStatus = (unitNum: number, topicId: string) => {
    if (userRole !== 'faculty' && isLocked) {
      alert('Syllabus is locked by PIPTR Academic Council. Switch to Faculty mode to modify status.');
      return;
    }

    const updated = subjects.map((sub) => {
      if (sub.id !== activeSubject.id) return sub;

      const newUnits = sub.units.map((u) => {
        if (u.unitNumber !== unitNum) return u;
        const newTopics = u.topics.map((t) => {
          if (t.id !== topicId) return t;
          const nextStatus: 'Completed' | 'In Progress' | 'Pending' =
            t.status === 'Completed' ? 'In Progress' : t.status === 'In Progress' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        });
        const completedCount = newTopics.filter((t) => t.status === 'Completed').length;
        const unitStatus: 'Completed' | 'In Progress' | 'Pending' =
          completedCount === newTopics.length ? 'Completed' : completedCount > 0 ? 'In Progress' : 'Pending';

        return { ...u, topics: newTopics, status: unitStatus };
      });

      const totalCompleted = newUnits.reduce(
        (sum, u) => sum + u.topics.filter((t) => t.status === 'Completed').length,
        0
      );

      return {
        ...sub,
        units: newUnits,
        completedTopics: totalCompleted,
      };
    });

    onUpdateSubjects(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedSyllabusFiles((prev) => [file.name, ...prev]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>Academic Curriculum & Unit Mapping</span>
              <span aria-hidden="true">·</span>
              <span>2026–27 Official Syllabus</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Syllabus & Lesson Plan Management
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Parul Institute of Physiotherapy and Research · Midsem vs Endsem Examination Scope
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Lock / Unlock toggle for faculty */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              {isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-slate-700">Curriculum Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Faculty Edit Mode Active</span>
                </>
              )}
              {userRole === 'faculty' && (
                <button
                  onClick={() => setIsLocked(!isLocked)}
                  className="ml-2 text-xs text-teal-700 underline font-medium"
                >
                  {isLocked ? 'Unlock' : 'Lock'}
                </button>
              )}
            </div>

            {/* Document Upload */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Syllabus File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.xlsx" />
            </label>
          </div>
        </div>

        {/* Uploaded Documents Strip */}
        <div className="mt-4 pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Uploaded Curriculum Files:</span>
          {uploadedSyllabusFiles.map((fn, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
            >
              <FileText className="w-3 h-3 text-teal-700" />
              <span>{fn}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Subject Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSubjectId(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedSubjectId === s.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {s.name} ({s.code})
          </button>
        ))}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">Scope Filter:</span>
          {(['All', 'Midsem & Endsem', 'Endsem Only'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => setScopeFilter(sc)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                scopeFilter === sc ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">Status Filter:</span>
          {(['All', 'Completed', 'In Progress', 'Pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                statusFilter === st ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Units & Topics Table */}
      <div className="space-y-6">
        {activeSubject.units
          .filter((u) => scopeFilter === 'All' || u.examScope === scopeFilter)
          .map((unit) => {
            const filteredTopics = unit.topics.filter(
              (t) => statusFilter === 'All' || t.status === statusFilter
            );
            if (filteredTopics.length === 0 && statusFilter !== 'All') return null;

            return (
              <div key={unit.unitNumber} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Unit Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{unit.unitTitle}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        unit.examScope === 'Midsem & Endsem' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {unit.examScope}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Lectures: {unit.lecturesTaken} delivered / {unit.lecturesPlanned} planned
                    </span>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                    unit.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : unit.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    Unit Status: {unit.status}
                  </span>
                </div>

                {/* Topics List */}
                <div className="divide-y divide-slate-100">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-3.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900">{topic.title}</span>
                          {topic.highYieldExam && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                              High Yield
                            </span>
                          )}
                        </div>
                        {topic.learningObjectives.length > 0 && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Key Core: {topic.learningObjectives.join(' · ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Toggle Status Button */}
                        <button
                          onClick={() => toggleTopicStatus(unit.unitNumber, topic.id)}
                          className={`text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                            topic.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : topic.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to advance status"
                        >
                          {topic.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
