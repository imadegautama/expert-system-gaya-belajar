import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyA0_2hcPsuu016NgFcLjn3ami7blQ6hJaI";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export interface GeminiResponse {
  text: string;
  error?: string;
}

export async function generateLearningRecommendations(
  dominantStyle: string,
  percentages: { V: number; A: number; K: number }
): Promise<GeminiResponse> {
  const styleLabels: Record<string, string> = {
    V: "Visual",
    A: "Auditory",
    K: "Kinesthetic",
    Multimodal: "Multimodal (Campuran)",
  };

  const prompt = `Kamu adalah seorang ahli pendidikan dan psikologi belajar. Berdasarkan hasil tes gaya belajar berikut, berikan rekomendasi belajar yang personal dan praktis dalam Bahasa Indonesia.

Hasil Tes Gaya Belajar:
- Gaya Belajar Dominan: ${styleLabels[dominantStyle] || dominantStyle}
- Persentase Visual: ${percentages.V}%
- Persentase Auditory: ${percentages.A}%
- Persentase Kinesthetic: ${percentages.K}%

Berikan rekomendasi dalam format markdown berikut (gunakan emoji untuk setiap section):

### 🎯 Strategi Belajar Utama
Berikan 3-4 tips praktis yang sangat spesifik sesuai gaya belajar dominan.

### 🛠️ Tools & Aplikasi
Rekomendasikan 3-4 aplikasi/tools yang cocok dengan penjelasan singkat kenapa cocok.

### 📝 Tips Menghadapi Ujian
Berikan 2-3 tips spesifik bagaimana menggunakan gaya belajar ini saat ujian.

### 💡 Kombinasi Gaya Belajar
Berikan 1-2 saran bagaimana menggabungkan gaya belajar lain untuk hasil maksimal.

Jawab dengan singkat, padat, dan actionable. Gunakan bullet points (-) untuk list items.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response from AI");
    }

    return { text };
  } catch (error) {
    console.error("Gemini API error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("RESOURCE_EXHAUSTED")
    ) {
      return {
        text: "",
        error:
          "Quota API Gemini habis. Silakan tunggu beberapa menit dan coba lagi, atau hubungi administrator untuk mengecek billing API.",
      };
    }

    return {
      text: "",
      error: errorMessage || "Gagal mendapatkan rekomendasi AI",
    };
  }
}
