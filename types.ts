export interface Symptom {
  id: string;
  code: string;
  name: string;
}

export interface Disease {
  id: string;
  code: string;
  name: string;
  requiredSymptoms: string[]; // List of Symptom Codes (e.g., ['B1', 'B2'])
  description: string;
  treatment: string;
}

export interface DiagnosisResult {
  disease: Disease;
  matchPercentage: number;
  matchedSymptoms: string[];
}
