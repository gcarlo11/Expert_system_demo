import React, { useState } from 'react';
import { AlertTriangle, Activity, Stethoscope, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { DiagnosisResult } from '../types';
import { getGeminiAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming standard markdown render capability or raw text

interface ResultViewProps {
  results: DiagnosisResult[];
  selectedSymptomNames: string[];
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ results, selectedSymptomNames, onReset }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);

  const topResult = results[0];
  const hasMatch = topResult && topResult.matchPercentage > 0;

  const handleAskAI = async () => {
    if (!hasMatch) return;
    setAiLoading(true);
    try {
      const advice = await getGeminiAdvice(topResult.disease, selectedSymptomNames);
      setAiAdvice(advice);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleDetails = (id: string) => {
    if (expandedDetails === id) {
      setExpandedDetails(null);
    } else {
      setExpandedDetails(id);
    }
  };

  if (!hasMatch) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-6">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Tidak Ada Kecocokan</h2>
          <p className="text-slate-600">
            Gejala yang Anda pilih tidak cocok dengan pola penyakit manapun dalam basis pengetahuan kami.
            Mohon konsultasikan langsung dengan dokter untuk pemeriksaan lebih lanjut.
          </p>
        </div>
        <button 
          onClick={onReset}
          className="bg-medical-600 text-white px-8 py-3 rounded-full hover:bg-medical-700 font-medium transition-colors"
        >
          Periksa Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Result Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-medical-600 to-teal-500 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Activity size={180} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-medical-100 font-medium">
              <Stethoscope size={18} />
              <span>Diagnosa Kemungkinan Tertinggi</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">{topResult.disease.name}</h2>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <span className="text-2xl font-bold">{Math.round(topResult.matchPercentage)}%</span>
                <span className="text-sm ml-1 opacity-90">Kecocokan</span>
              </div>
              <div className="text-sm opacity-90 max-w-md">
                {topResult.disease.description}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Saran Pengobatan Standar:</h3>
            <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {topResult.disease.treatment}
            </p>
          </div>

          {!aiAdvice ? (
            <button
              onClick={handleAskAI}
              disabled={aiLoading}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group"
            >
              {aiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-700"></div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:text-indigo-600" />
                  <span className="font-semibold">Dapatkan Analisis Lanjut & Tips Rumah dengan AI</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 animate-fade-in">
              <div className="flex items-center gap-2 mb-4 text-indigo-800">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-lg">Analisis Asisten AI</h3>
              </div>
              <div className="prose prose-indigo prose-sm max-w-none text-slate-700 whitespace-pre-line">
                {aiAdvice}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Possibilities */}
      {results.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 px-2">Kemungkinan Lainnya</h3>
          {results.slice(1).map((result) => (
            <div 
              key={result.disease.id} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <button 
                onClick={() => toggleDetails(result.disease.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                    ${result.matchPercentage > 50 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {Math.round(result.matchPercentage)}%
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-800">{result.disease.name}</h4>
                    <span className="text-xs text-slate-500">{result.disease.code}</span>
                  </div>
                </div>
                {expandedDetails === result.disease.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>
              
              {expandedDetails === result.disease.id && (
                <div className="p-5 pt-0 bg-slate-50 border-t border-slate-100">
                  <div className="mt-4 text-sm text-slate-600">
                    <p className="mb-2"><strong>Deskripsi:</strong> {result.disease.description}</p>
                    <p><strong>Pengobatan:</strong> {result.disease.treatment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-8">
        <button 
          onClick={onReset}
          className="text-slate-500 hover:text-medical-600 font-medium underline underline-offset-4 transition-colors"
        >
          Mulai Diagnosa Baru
        </button>
      </div>

    </div>
  );
};