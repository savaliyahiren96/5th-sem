import React, { useState } from 'react';
import { CLINICAL_ROTATIONS, SAMPLE_LOGBOOK_ENTRIES } from '../data/academicCalendarData';
import { ClinicalLogbookEntry, ClinicalPostingRotation } from '../types';
import {
  Stethoscope,
  Building2,
  UserCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Loader2,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const ClinicalPostingModule: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(CLINICAL_ROTATIONS[0].id);
  const [logbookEntries, setLogbookEntries] = useState<ClinicalLogbookEntry[]>(SAMPLE_LOGBOOK_ENTRIES);
  const [isAddLogOpen, setIsAddLogOpen] = useState<boolean>(false);

  // New Logbook Entry form state
  const [newLog, setNewLog] = useState({
    patientAgeGender: '',
    diagnosis: '',
    chiefComplaints: '',
    physiotherapyIntervention: '',
  });

  // AI Bedside Clinical Assistant form state
  const [assistantForm, setAssistantForm] = useState({
    patientAge: '54',
    gender: 'Male',
    primaryCondition: 'Ischemic Stroke (Left MCA Infarct) with Right Hemiparesis',
    chiefProblem: 'Dependent standing transfers and 2 finger-breadth right shoulder subluxation',
  });
  const [assistantResult, setAssistantResult] = useState<string>('');
  const [isAssistantLoading, setIsAssistantLoading] = useState<boolean>(false);

  const activeRotation = CLINICAL_ROTATIONS.find((r) => r.id === selectedDeptId) || CLINICAL_ROTATIONS[0];

  const handleGenerateBedsideHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssistantLoading(true);
    try {
      const res = await fetch('/api/ai/posting-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: activeRotation.department,
          patientAge: assistantForm.patientAge,
          gender: assistantForm.gender,
          primaryCondition: assistantForm.primaryCondition,
          chiefProblem: assistantForm.chiefProblem,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssistantResult(data.content);
      }
    } catch (err) {
      console.error('Error generating bedside guide:', err);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleSaveLogEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.diagnosis || !newLog.physiotherapyIntervention) return;

    const entry: ClinicalLogbookEntry = {
      id: `log-${Date.now()}`,
      studentRollNo: 'PU-BPT24-015',
      studentName: 'BPT 5th Sem Trainee',
      date: new Date().toISOString().split('T')[0],
      department: activeRotation.department,
      patientAgeGender: newLog.patientAgeGender || 'De-identified Patient',
      diagnosis: newLog.diagnosis,
      chiefComplaints: newLog.chiefComplaints || 'Standard functional deficits',
      physiotherapyIntervention: newLog.physiotherapyIntervention,
      supervisorSignStatus: 'Pending Review',
    };

    setLogbookEntries([entry, ...logbookEntries]);
    setNewLog({
      patientAgeGender: '',
      diagnosis: '',
      chiefComplaints: '',
      physiotherapyIntervention: '',
    });
    setIsAddLogOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner with Hospital Info */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>Parul Sevashram Hospital</span>
              <span aria-hidden="true">·</span>
              <span>Clinical Posting Management (2026–27)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Posting & Bedside Learning Intelligence
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Hospital rotations, practical competencies, certified supervisor logbooks, and AI Bedside Case Assistant
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddLogOpen(!isAddLogOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Case in Logbook</span>
            </button>
          </div>
        </div>

        {/* Privacy Protection Banner */}
        <div className="mt-4 p-3.5 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Strict Patient Privacy Protection Notice (HIPAA / NABH Standards):</span>{' '}
            Students are strictly prohibited from recording real names, government IDs, phone numbers, or identifiable patient details. All clinical records must use hospital registration IDs only.
          </div>
        </div>
      </section>

      {/* 2. Hospital Department Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CLINICAL_ROTATIONS.map((rot) => (
          <button
            key={rot.id}
            onClick={() => setSelectedDeptId(rot.id)}
            className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
              selectedDeptId === rot.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-800 hover:border-teal-500'
            }`}
          >
            <div>
              <span className={`text-[10px] uppercase font-bold block mb-1 ${
                selectedDeptId === rot.id ? 'text-teal-400' : 'text-slate-400'
              }`}>
                Ward / Unit
              </span>
              <span className="font-bold leading-tight block truncate">{rot.department}</span>
            </div>
            <span className={`text-[10px] mt-3 block ${
              selectedDeptId === rot.id ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {rot.studentsAssignedCount} Students Assigned
            </span>
          </button>
        ))}
      </div>

      {/* 3. Department Overview & Clinical Supervisor Details */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Department & Supervisor Details
            </span>
            <h3 className="text-base font-bold text-slate-900">{activeRotation.department}</h3>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div>
                <span className="font-medium text-slate-800">Hospital: </span>
                {activeRotation.hospitalName}
              </div>
              <div>
                <span className="font-medium text-slate-800">Lead Supervisor: </span>
                <span className="text-teal-800 font-semibold">{activeRotation.supervisorName}</span>
              </div>
              <div>
                <span className="font-medium text-slate-800">Designation: </span>
                {activeRotation.supervisorDesignation}
              </div>
              <div>
                <span className="font-medium text-slate-800">Shift Timing: </span>
                {activeRotation.shiftTiming}
              </div>
              <div>
                <span className="font-medium text-slate-800">Active Rotation Term: </span>
                {activeRotation.startDate} to {activeRotation.endDate}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Essential Clinical Competencies for this Rotation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeRotation.competenciesRequired.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium">{comp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Modal / Form for Recording New Case Entry in Logbook */}
      {isAddLogOpen && (
        <section className="bg-white rounded-xl border border-teal-200 p-6 shadow-md animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Record Bedside Clinical Case in Digital Logbook ({activeRotation.department})
            </h3>
            <button
              onClick={() => setIsAddLogOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveLogEntry} className="mt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  De-Identified Patient Age & Gender (e.g., 52y Male IPD #44102)
                </label>
                <input
                  type="text"
                  value={newLog.patientAgeGender}
                  onChange={(e) => setNewLog({ ...newLog, patientAgeGender: e.target.value })}
                  placeholder="Age, Gender, Bed/IPD No."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-teal-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Medical & Orthopaedic / Neurological Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={newLog.diagnosis}
                  onChange={(e) => setNewLog({ ...newLog, diagnosis: e.target.value })}
                  placeholder="e.g. Subcapital Femoral Neck Fracture s/p Bipolar Hemiarthroplasty"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Chief Functional Complaints & Key Assessment Findings
              </label>
              <textarea
                rows={2}
                value={newLog.chiefComplaints}
                onChange={(e) => setNewLog({ ...newLog, chiefComplaints: e.target.value })}
                placeholder="Pain level, range restriction, functional bed mobility limitation..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-teal-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Physiotherapy Intervention Performed & Dosage *
              </label>
              <textarea
                rows={3}
                required
                value={newLog.physiotherapyIntervention}
                onChange={(e) => setNewLog({ ...newLog, physiotherapyIntervention: e.target.value })}
                placeholder="Specific therapeutic exercises, joint mobilization grades, chest PT, transfer training, walking aid prescription..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-teal-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddLogOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800"
              >
                Submit for Supervisor Signature
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 5. AI Bedside Clinical Posting Assistant */}
      <section className="bg-slate-900 text-white rounded-xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Bedside Case Presentation Assistant</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Instant Bedside Viva & Presentation Helper
            </h2>
            <p className="text-xs text-slate-400">
              Prepare flawless case presentations, anticipate examiner questions, and structure evidence-based goals for {activeRotation.department}.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateBedsideHelp} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Patient Age</label>
            <input
              type="text"
              value={assistantForm.patientAge}
              onChange={(e) => setAssistantForm({ ...assistantForm, patientAge: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Gender</label>
            <select
              value={assistantForm.gender}
              onChange={(e) => setAssistantForm({ ...assistantForm, gender: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-teal-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              value={assistantForm.primaryCondition}
              onChange={(e) => setAssistantForm({ ...assistantForm, primaryCondition: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-teal-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-slate-300 font-medium mb-1">Chief Physical Limitation</label>
            <input
              type="text"
              value={assistantForm.chiefProblem}
              onChange={(e) => setAssistantForm({ ...assistantForm, chiefProblem: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-teal-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isAssistantLoading}
              className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {isAssistantLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Viva Script</span>
            </button>
          </div>
        </form>

        {assistantResult && (
          <div className="mt-4 p-5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {assistantResult}
          </div>
        )}
      </section>

      {/* 6. Clinical Logbook Records Table */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Clinical Logbook Submissions ({logbookEntries.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Official PIPTR Practical Verification</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {logbookEntries.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.studentName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({log.studentRollNo})</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">{log.department}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 tabular-nums text-[11px]">{log.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.supervisorSignStatus === 'Approved & Signed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {log.supervisorSignStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Reference:</span>
                  <span className="font-semibold text-slate-900">{log.patientAgeGender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Diagnosis:</span>
                  <span className="font-semibold text-slate-900 truncate block">{log.diagnosis}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Physiotherapy Intervention:</span>
                  <span className="text-slate-800 line-clamp-1">{log.physiotherapyIntervention}</span>
                </div>
              </div>

              {log.supervisorNotes && (
                <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-600">
                  <span className="font-semibold text-teal-800">Supervisor Remarks: </span>
                  {log.supervisorNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
