import React from 'react';
import { Check } from 'lucide-react';
import { Symptom } from '../types';

interface SymptomCardProps {
  symptom: Symptom;
  isSelected: boolean;
  onToggle: (code: string) => void;
}

export const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(symptom.code)}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'border-medical-500 bg-medical-50 shadow-md' 
          : 'border-slate-200 bg-white hover:border-medical-200 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${isSelected ? 'bg-medical-500 border-medical-500' : 'border-slate-300 group-hover:border-medical-300'}
        `}>
          {isSelected && <Check size={14} className="text-white" />}
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 mb-1 block">{symptom.code}</span>
          <h3 className={`font-medium ${isSelected ? 'text-medical-900' : 'text-slate-700'}`}>
            {symptom.name}
          </h3>
        </div>
      </div>
    </div>
  );
};