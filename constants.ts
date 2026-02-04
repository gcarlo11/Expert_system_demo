import { Disease, Symptom } from './types';

export const SYMPTOMS: Symptom[] = [
  { id: '1', code: 'B1', name: 'Batuk (Lebih dari 2 minggu)' },
  { id: '2', code: 'B2', name: 'Demam Tinggi (>38°C)' },
  { id: '3', code: 'B3', name: 'Sesak Napas / Mengi' },
  { id: '4', code: 'B4', name: 'Nyeri Dada' },
  { id: '5', code: 'B5', name: 'Dahak Berdarah' },
  { id: '6', code: 'B6', name: 'Berkeringat di Malam Hari' },
  { id: '7', code: 'B7', name: 'Lemas & Berat Badan Turun' },
];

export const DISEASES: Disease[] = [
  {
    id: 'p1',
    code: 'P1',
    name: 'Flu / Common Cold',
    requiredSymptoms: ['B2'],
    description: 'Infeksi virus ringan pada saluran pernapasan atas.',
    treatment: 'Istirahat cukup, minum banyak air, obat pereda gejala flu.'
  },
  {
    id: 'p2',
    code: 'P2',
    name: 'Asma',
    requiredSymptoms: ['B3', 'B4'],
    description: 'Kondisi kronis di mana saluran udara meradang dan menyempit.',
    treatment: 'Inhaler, hindari pemicu alergi, obat pengontrol asma.'
  },
  {
    id: 'p3',
    code: 'P3',
    name: 'Pneumonia',
    requiredSymptoms: ['B1', 'B2', 'B3', 'B4'],
    description: 'Infeksi yang memicu inflamasi pada kantong-kantong udara di salah satu atau kedua paru-paru.',
    treatment: 'Antibiotik (jika bakteri), obat batuk, istirahat total.'
  },
  {
    id: 'p4',
    code: 'P4',
    name: 'TBC (Tuberkulosis)',
    requiredSymptoms: ['B1', 'B4', 'B5', 'B6', 'B7'],
    description: 'Penyakit menular serius yang terutama menyerang paru-paru. Disebabkan oleh bakteri.',
    treatment: 'Pengobatan antibiotik jangka panjang (6-9 bulan) di bawah pengawasan dokter.'
  },
  {
    id: 'p5',
    code: 'P5',
    name: 'Bronkhitis',
    requiredSymptoms: ['B1', 'B2', 'B3'],
    description: 'Peradangan pada lapisan saluran bronkial, yang membawa udara ke dan dari paru-paru.',
    treatment: 'Istirahat, minum cairan, humidifikasi udara, obat pereda nyeri.'
  }
];