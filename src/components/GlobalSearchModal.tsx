import React, { useState, useEffect } from 'react';
import { SubjectConfig, SubjectId } from '../types';
import { Search, X, Sparkles, BookOpen, ArrowRight, Loader2, Link2 } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  subjects: SubjectConfig[];
  onSelectSubject: (id: SubjectId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  subjects,
  onSelectSubject,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');

  useEffect(() => {
    if (initialQuery && isOpen) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setActiveQuery(searchTerm);
    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/cross-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResult(data.content);
      }
    } catch (err) {
      console.error('Cross-subject search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const quickTerms = [
    'Stroke & Hemiplegia',
    'ACL Reconstruction',
    'Parkinsonism',
    'Fracture Neck of Femur',
    'Modified Radical Mastectomy',
    'Tuberculosis & Pleural Effusion',
    'Adhesive Capsulitis (Frozen Shoulder)',
    'Traumatic Spinal Cord Injury (Paraplegia)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Global AI Cross-Subject Search Engine
              </h2>
              <p className="text-xs text-slate-500">
                Synthesizes medical pathology, surgery, orthopaedics, and physical therapy rehabilitation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Chips */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any disease, surgery, fracture, neuro syndrome, special test..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-teal-700 focus:bg-white transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-md hover:bg-teal-800 transition-colors"
            >
              Analyze
            </button>
          </form>

          {/* Quick Clickable Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
            <span className="text-slate-500 font-medium">Quick suggestions:</span>
            {quickTerms.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setQuery(t);
                  performSearch(t);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 text-[11px] transition-colors border border-slate-200"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body / Results */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">
          {isSearching ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
              <p className="text-sm font-medium text-slate-800">
                Cross-referencing across all 6 PIPTR subject syllabi for "{activeQuery}"...
              </p>
              <p className="text-xs text-slate-500">
                Synthesizing General Medicine, Neuro Medicine, Surgery, Orthopaedics, PFD Neuro, and PFD PTMS.
              </p>
            </div>
          ) : searchResult ? (
            <div className="space-y-6">
              {/* Connected Subject Badges */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Link2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Mapped 5th Semester Subjects for "{activeQuery}":</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onClose();
                        onSelectSubject(s.id);
                      }}
                      className="p-2 text-left rounded bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 transition-colors flex items-center justify-between text-xs group"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-teal-900 truncate">
                        {s.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-teal-700 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesized Cross-Subject Markdown Body */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-xs font-sans">
                {searchResult}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                Global Academic & Clinical Search
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Type any disease, surgical procedure, fracture, special test, or examination topic. ClinicaAI will identify how it connects across the entire 5th Semester syllabus.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-md border border-slate-200 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
