import React, { useState } from 'react';
import { KnowledgeDocument, SubjectId } from '../types';
import { KNOWLEDGE_DOCUMENTS } from '../data/knowledgeBaseData';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Upload,
  Download,
  Bookmark,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface KnowledgeDatabaseViewProps {
  onOpenTopicInAgent: (subjectId: SubjectId, topicName: string) => void;
}

export const KnowledgeDatabaseView: React.FC<KnowledgeDatabaseViewProps> = ({
  onOpenTopicInAgent,
}) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(KNOWLEDGE_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.authorOrSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.topicsCovered.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || doc.subjectId === selectedSubject || doc.subjectId === 'all';
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;

    return matchesSearch && matchesSubject && matchesCategory;
  });

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: KnowledgeDocument = {
        id: `kb-user-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        authorOrSource: 'Uploaded by Faculty / Student',
        subjectId: selectedSubject === 'all' ? 'pfd-ptms' : (selectedSubject as SubjectId),
        type: 'Lecture Notes',
        editionYear: '2026–27',
        topicsCovered: ['User Uploaded Resource', 'Clinical Practice Notes'],
        summary: `User provided academic document (${file.name}). Indexed in ClinicaAI local semantic database.`,
      };
      setDocuments([newDoc, ...documents]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>PIPTR Shared Clinical Knowledge Database</span>
              <span aria-hidden="true">·</span>
              <span>BPT 5th Semester</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Textbook References & Clinical Knowledge Base
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Authoritative references: Davidson, Adams & Victor, Bailey & Love, Apley, Maheshwari, O'Sullivan, Kisner & Colby, Maitland
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Notes / Research PDF</span>
              <input type="file" onChange={handleSimulateUpload} className="hidden" accept=".pdf,.docx,.ppt,.pptx,.xlsx" />
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search textbook title, author, edition, or clinical keywords (e.g., O'Sullivan, Maitland, Knee OA, Stroke, Burns)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-teal-700 focus:bg-white"
          />
        </div>

        {/* Filter Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600">Category:</span>
            {['all', 'Textbook', 'Clinical Guideline', 'OSCE Checklist', 'Lecture Notes'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Formats' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-teal-700"
            >
              <option value="all">All 6 Subjects</option>
              <option value="gen-med">General Medicine-I</option>
              <option value="neuro-med">Neuro Medicine-I</option>
              <option value="surgery">Surgery-I</option>
              <option value="ortho">Orthopaedics</option>
              <option value="pfd-neuro">PFD Neuro</option>
              <option value="pfd-ptms">PFD PTMS</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Knowledge Documents Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-600 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {doc.type}
                </span>
                <span className="text-slate-400 text-[11px] font-mono">{doc.editionYear}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
              <p className="text-xs text-teal-800 font-medium">{doc.authorOrSource}</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{doc.summary}</p>

              {/* Topics Covered */}
              <div className="flex flex-wrap gap-1 pt-1">
                {doc.topicsCovered.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Indexed in ClinicaAI</span>
              <button
                onClick={() => {
                  if (doc.subjectId !== 'all') {
                    onOpenTopicInAgent(doc.subjectId as SubjectId, doc.topicsCovered[0] || doc.title);
                  }
                }}
                className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
              >
                <span>Study in AI Agent</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
