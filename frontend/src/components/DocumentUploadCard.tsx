import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2, CheckCircle2, FileSearch, Search, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { searchDocumentInChroma, type DocumentExtractionMeta, type RetrievedPassage } from '../services/api';

interface DocumentUploadCardProps {
  selectedFile: File | null;
  extractionMeta?: DocumentExtractionMeta | null;
  isExtracting?: boolean;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  selectedFile,
  extractionMeta,
  isExtracting = false,
  onFileSelect,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RAG Interactive Testing State
  const [ragQuery, setRagQuery] = useState<string>('Deadlocks and Banker algorithm');
  const [isSearchingRAG, setIsSearchingRAG] = useState<boolean>(false);
  const [retrievedPassages, setRetrievedPassages] = useState<RetrievedPassage[]>([]);
  const [showRAGTester, setShowRAGTester] = useState<boolean>(false);

  const processFile = (file: File) => {
    const validExtensions = ['pdf', 'docx', 'txt'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt && validExtensions.includes(fileExt)) {
      setRetrievedPassages([]);
      onFileSelect(file);
    } else {
      alert('Please upload a valid PDF, DOCX, or TXT file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTestRAGSearch = async () => {
    if (!ragQuery.trim()) return;
    setIsSearchingRAG(true);
    try {
      const res = await searchDocumentInChroma(ragQuery, 3);
      setRetrievedPassages(res.passages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Search failed';
      alert(msg);
    } finally {
      setIsSearchingRAG(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Upload Study Document</span>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              PyMuPDF + ChromaDB RAG
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            PDF, DOCX, or TXT files up to 15MB
          </p>
        </div>
      </div>

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 sm:p-10 text-center cursor-pointer bg-indigo-50/40 dark:bg-slate-850/40 hover:bg-indigo-50/70 transition-all duration-200 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="mt-4 font-bold text-base text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop lecture notes here
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Textbook chapters, lecture slides, research papers, or syllabus notes
          </p>

          <div className="mt-5 flex items-center justify-center space-x-2">
            <span className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
              PDF
            </span>
            <span className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
              DOCX
            </span>
            <span className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
              TXT
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-slate-700">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const sampleText = `Operating Systems & Database Systems: Comprehensive Lecture Notes\n\n1. Process Management and CPU Scheduling\nA process is a program in execution. The operating system manages processes using a Process Control Block (PCB), which contains process state, program counter, and scheduling info.\nScheduling algorithms:\n- First-Come, First-Served (FCFS): Simple non-preemptive algorithm that can suffer from the convoy effect.\n- Round Robin (RR): Preemptive scheduling where each process is allocated a fixed time quantum.\n\n2. Deadlocks\nCoffman's four necessary conditions for deadlock:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\nDeadlock avoidance is achieved using Dijkstra's Banker's Algorithm.\n\n3. Database ACID Properties\n- Atomicity: All or nothing execution, enforced via Write-Ahead Logging (WAL).\n- Consistency: Invariants and constraints preserved.\n- Isolation: Concurrent transactions do not interfere; enforced by Two-Phase Locking (2PL).\n- Durability: Committed updates survive system crashes and power failures.`;
                const sampleFile = new File([sampleText], "sample_study_notes.txt", { type: "text/plain" });
                onFileSelect(sampleFile);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>⚡ Load Sample Lecture Notes (Instant Test)</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="space-y-4">
          {/* File Card Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                {isExtracting ? (
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                  {isExtracting ? 'Extracting & Indexing into ChromaDB...' : 'Indexed in Vector DB'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Remove document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Extraction & ChromaDB Index Metrics */}
          {extractionMeta && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-750">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-slate-750">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RAG Vector Index Ready</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span>📄 {extractionMeta.page_count} Pages</span>
                  <span>✍️ {extractionMeta.word_count.toLocaleString()} Words</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    ⚡ {extractionMeta.total_chunks || 4} Vector Chunks
                  </span>
                </div>
              </div>

              {/* Preview snippet */}
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mb-1">
                  <FileSearch className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Document Text Preview:</span>
                </span>
                <p className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 italic line-clamp-2 font-mono text-[11px]">
                  "{extractionMeta.preview}"
                </p>
              </div>

              {/* Interactive RAG Semantic Search Tester */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowRAGTester(!showRAGTester)}
                  className="flex items-center justify-between w-full text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Test ChromaDB Semantic Search & Source Retrieval (Milestone 7)</span>
                  </span>
                  {showRAGTester ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRAGTester && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Query ChromaDB's vector index to see which passages are retrieved for question generation:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ragQuery}
                        onChange={(e) => setRagQuery(e.target.value)}
                        placeholder="Search term (e.g. CPU Scheduling, ACID properties)..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        disabled={isSearchingRAG}
                        onClick={handleTestRAGSearch}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {isSearchingRAG ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        <span>Retrieve</span>
                      </button>
                    </div>

                    {/* Retrieved Chunks Display */}
                    {retrievedPassages.length > 0 && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Top {retrievedPassages.length} Relevant Passages Found:
                        </p>
                        {retrievedPassages.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-slate-900/60 border border-indigo-100 dark:border-slate-750 text-xs"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                              <span>Passage {idx + 1} ({p.source_reference})</span>
                              <span className="text-[10px] text-slate-500">Distance: {p.relevance_distance}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-sans text-[11px]">
                              {p.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center space-x-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
