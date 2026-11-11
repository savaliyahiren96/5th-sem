import React, { useState } from 'react';
import { AcademicCalendarEvent } from '../types';
import { ACADEMIC_EVENTS } from '../data/academicCalendarData';
import { Calendar, Clock, MapPin, Filter, Tag, CheckCircle2 } from 'lucide-react';

export const AcademicCalendarView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'timeline' | 'weekly' | 'table'>('timeline');

  const filteredEvents = ACADEMIC_EVENTS.filter((ev) =>
    selectedType === 'All' ? true : ev.type === selectedType
  );

  const eventTypes = [
    'All',
    'Mid-Semester Exam',
    'End-Semester Exam',
    'Weekly Test',
    'Practical Exam',
    'Clinical Posting',
    'Assignment',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>Academic Year 2026–27 Schedule</span>
              <span aria-hidden="true">·</span>
              <span>BPT 5th Semester</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Academic Calendar & Timetable
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Lectures, Clinical Postings at Parul Sevashram Hospital, Midsem & Endsem Exam Schedules
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chronological Timeline
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Schedule View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List Table
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Filter Event Type:
          </span>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedType === type
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* View 1: Weekly Master Schedule Matrix */}
      {viewMode === 'weekly' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            Standard 5th Semester Weekly Lecture & Clinical Posting Grid
          </h2>
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-semibold">Day</th>
                <th className="p-3 font-semibold">08:30 AM – 01:00 PM</th>
                <th className="p-3 font-semibold">01:00 – 01:45 PM</th>
                <th className="p-3 font-semibold">01:45 – 02:45 PM</th>
                <th className="p-3 font-semibold">02:45 – 03:45 PM</th>
                <th className="p-3 font-semibold">03:45 – 04:45 PM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="p-3 font-bold text-slate-900">Monday</td>
                <td className="p-3 bg-teal-50/50 text-teal-900 font-medium">Hospital Clinical Postings (Rotations)</td>
                <td className="p-3 text-slate-400">Lunch Break</td>
                <td className="p-3 font-medium">General Medicine-I</td>
                <td className="p-3 font-medium">Orthopaedics</td>
                <td className="p-3 font-medium">PFD Neuro (Practical)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Tuesday</td>
                <td className="p-3 bg-teal-50/50 text-teal-900 font-medium">Hospital Clinical Postings (Rotations)</td>
                <td className="p-3 text-slate-400">Lunch Break</td>
                <td className="p-3 font-medium">Neuro Medicine-I</td>
                <td className="p-3 font-medium">Surgery-I</td>
                <td className="p-3 font-medium">PFD PTMS (Practical)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Wednesday</td>
                <td className="p-3 bg-teal-50/50 text-teal-900 font-medium">Hospital Clinical Postings (Rotations)</td>
                <td className="p-3 text-slate-400">Lunch Break</td>
                <td className="p-3 font-medium">Orthopaedics</td>
                <td className="p-3 font-medium">PFD PTMS (Theory)</td>
                <td className="p-3 font-medium">General Medicine-I</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Thursday</td>
                <td className="p-3 bg-teal-50/50 text-teal-900 font-medium">Hospital Clinical Postings (Rotations)</td>
                <td className="p-3 text-slate-400">Lunch Break</td>
                <td className="p-3 font-medium">Surgery-I</td>
                <td className="p-3 font-medium">Neuro Medicine-I</td>
                <td className="p-3 font-medium">PFD Neuro (Theory)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Friday</td>
                <td className="p-3 bg-teal-50/50 text-teal-900 font-medium">Hospital Clinical Postings (Rotations)</td>
                <td className="p-3 text-slate-400">Lunch Break</td>
                <td className="p-3 font-medium">PFD Neuro (Case Discussion)</td>
                <td className="p-3 font-medium">PFD PTMS (Manual Lab)</td>
                <td className="p-3 font-medium">Seminars / Journal Club</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Saturday</td>
                <td className="p-3 bg-teal-50/50 text-teal-900 font-medium">Hospital Bedside Case Presentation</td>
                <td className="p-3 text-slate-400">Lunch Break</td>
                <td className="p-3 bg-amber-50 text-amber-900 font-semibold" colSpan={3}>
                  Weekly Academic Unit Tests (02:00 PM – 03:30 PM) / Remedial Clinic
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* View 2: Chronological Timeline View */}
      {viewMode === 'timeline' && (
        <section className="space-y-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-500 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      ev.type.includes('Exam')
                        ? 'bg-rose-100 text-rose-800'
                        : ev.type.includes('Test')
                        ? 'bg-amber-100 text-amber-800'
                        : ev.type.includes('Posting')
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ev.type}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {ev.location}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-100 sm:border-0 sm:bg-transparent">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  <span>{ev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{ev.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* View 3: Table View */}
      {viewMode === 'table' && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3.5 font-semibold">Date & Time</th>
                <th className="p-3.5 font-semibold">Type</th>
                <th className="p-3.5 font-semibold">Event Title</th>
                <th className="p-3.5 font-semibold">Location</th>
                <th className="p-3.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-medium tabular-nums whitespace-nowrap">
                    <div>{ev.date}</div>
                    <div className="text-[10px] text-slate-500">{ev.time}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {ev.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">{ev.title}</td>
                  <td className="p-3.5 text-slate-600">{ev.location}</td>
                  <td className="p-3.5 text-slate-500 max-w-xs">{ev.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};
