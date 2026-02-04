import { GoogleGenAI } from "@google/genai";
import { Disease } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiAdvice = async (disease: Disease, userSymptoms: string[]): Promise<string> => {
  try {
    const prompt = `
      Bertindaklah sebagai asisten medis yang empatik dan profesional.
      
      Pengguna baru saja menggunakan sistem pakar sederhana dan mendapatkan diagnosa awal: "${disease.name}" (${disease.description}).
      
      Gejala yang dialami pengguna: ${userSymptoms.join(', ')}.
      
      Tolong berikan respon singkat (maksimal 200 kata) yang mencakup:
      1. Saran pertolongan pertama atau perawatan di rumah yang aman.
      2. Tanda-tanda bahaya (red flags) kapan mereka HARUS segera ke dokter/IGD.
      3. Kalimat penenang agar tidak panik.
      
      Gunakan format Markdown sederhana.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Maaf, tidak dapat mengambil saran saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, layanan konsultasi AI sedang sibuk. Silakan hubungi dokter terdekat.";
  }
};
