import React, { useState, useMemo } from 'react';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { SYMPTOMS, DISEASES } from './constants';
import { SymptomCard } from './components/SymptomCard';
import { ResultView } from './components/ResultView';
import { DiagnosisResult } from './types';

function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (code: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const calculatedResults: DiagnosisResult[] = useMemo(() => {
    if (selectedSymptoms.size === 0) return [];

    const results = DISEASES.map(disease => {
      // Logic: Simple matching coefficient
      // Count how many of the DISEASE's required symptoms are present in the user's selection
      const required = new Set(disease.requiredSymptoms);
      let matchCount = 0;
      const matchedSymptomsList: string[] = [];

      required.forEach(reqSym => {
        if (selectedSymptoms.has(reqSym)) {
          matchCount++;
          matchedSymptomsList.push(reqSym);
        }
      });

      // Percentage is based on: (Matches found / Total symptoms required for that disease)
      // This is a "Recall" focused metric suitable for medical exclusion
      const percentage = required.size > 0 ? (matchCount / required.size) * 100 : 0;

      return {
        disease,
        matchPercentage: percentage,
        matchedSymptoms: matchedSymptomsList
      };
    });

    // Filter results that have 0 match and sort by percentage descending
    return results
      .filter(r => r.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [selectedSymptoms]);

  const handleDiagnose = () => {
    if (selectedSymptoms.size > 0) {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setSelectedSymptoms(new Set());
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to get symptom names for Gemini
  const getSelectedSymptomNames = () => {
    return SYMPTOMS
      .filter(s => selectedSymptoms.has(s.code))
      .map(s => s.name);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-medical-600">
            <Activity className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">RespiraExpert</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="hidden sm:inline">Sistem Pakar Pernapasan</span>
            <div className="w-px h-4 bg-slate-300 hidden sm:block"></div>
            <a href="#" className="hover:text-medical-600 transition-colors">Tentang</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {!showResults ? (
          <div className="animate-fade-in-up">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-50 text-medical-700 text-sm font-medium mb-4 border border-medical-100">
                <ShieldCheck size={16} />
                <span>Metode Forward Chaining</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Cek Kesehatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-teal-500">Pernapasan Anda</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Pilih gejala yang sedang Anda rasakan di bawah ini untuk mendapatkan diagnosa awal berdasarkan basis pengetahuan medis kami.
              </p>
            </div>

            {/* Selection Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <AlertCircle className="w-5 h-5 text-medical-500" />
                <h2 className="font-bold text-lg">Daftar Gejala (Pilih semua yang dirasakan)</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {SYMPTOMS.map((symptom) => (
                  <SymptomCard 
                    key={symptom.id}
                    symptom={symptom}
                    isSelected={selectedSymptoms.has(symptom.code)}
                    onToggle={toggleSymptom}
                  />
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <div className="text-sm text-slate-500">
                  <span className="font-bold text-slate-900">{selectedSymptoms.size}</span> gejala dipilih
                </div>
                <button
                  onClick={handleDiagnose}
                  disabled={selectedSymptoms.size === 0}
                  className={`
                    w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg
                    ${selectedSymptoms.size > 0 
                      ? 'bg-medical-600 hover:bg-medical-500 text-white hover:-translate-y-1 shadow-medical-500/30' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  Analisa Sekarang
                </button>
              </div>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-8 max-w-lg mx-auto">
              *Hasil diagnosa ini hanyalah perkiraan berdasarkan algoritma sistem pakar dan tidak menggantikan pemeriksaan medis profesional oleh dokter.
            </p>
          </div>
        ) : (
          <ResultView 
            results={calculatedResults} 
            selectedSymptomNames={getSelectedSymptomNames()}
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
}

export default App;