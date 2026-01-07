import type { AnswerType, InferenceResult } from "./types";

const DESCRIPTIONS = {
  V: "Anda adalah pembelajar Visual. Anda memahami informasi lebih baik melalui gambar, diagram, dan grafik. Tips: Gunakan mind map, highlighter warna-warni, dan video pembelajaran.",
  A: "Anda adalah pembelajar Auditory. Anda lebih mudah menyerap informasi melalui pendengaran dan diskusi. Tips: Dengarkan podcast, diskusi kelompok, dan rekam materi untuk didengar ulang.",
  K: "Anda adalah pembelajar Kinesthetic. Anda belajar paling efektif melalui praktik langsung dan aktivitas fisik. Tips: Buat proyek, lakukan eksperimen, dan jangan duduk diam saat belajar.",
  Multimodal:
    "Anda memiliki gaya belajar Multimodal (Campuran). Anda fleksibel menggunakan berbagai metode belajar. Tips: Kombinasikan berbagai metode sesuai topik yang dipelajari.",
};

/**
 * FUNGSI MESIN INFERENSI - Forward Chaining
 * @param answers Array string yang berisi 'V', 'A', atau 'K' sesuai urutan jawaban user
 */
export function calculateLearningStyle(answers: AnswerType[]): InferenceResult {
  // 1. Inisialisasi Counter
  const scores = { V: 0, A: 0, K: 0 };
  const totalQuestions = answers.length;

  // 2. Forward Chaining: Iterasi Fakta
  answers.forEach((ans) => {
    if (scores[ans] !== undefined) {
      scores[ans]++;
    }
  });

  // 3. Hitung Persentase (Untuk visualisasi Chart)
  const percentages = {
    V: totalQuestions > 0 ? Math.round((scores.V / totalQuestions) * 100) : 0,
    A: totalQuestions > 0 ? Math.round((scores.A / totalQuestions) * 100) : 0,
    K: totalQuestions > 0 ? Math.round((scores.K / totalQuestions) * 100) : 0,
  };

  // 4. Tentukan Dominan
  const maxScore = Math.max(scores.V, scores.A, scores.K);

  // Mencari siapa saja yang memiliki skor tertinggi (bisa lebih dari 1 jika seri)
  const winners = (Object.keys(scores) as AnswerType[]).filter(
    (type) => scores[type] === maxScore
  );

  let dominantResult = "";
  let desc = "";

  if (winners.length === 1) {
    // Single Dominant
    dominantResult = winners[0];
    desc = DESCRIPTIONS[dominantResult as keyof typeof DESCRIPTIONS];
  } else {
    // Tie / Multimodal
    dominantResult = "Multimodal";
    desc = DESCRIPTIONS.Multimodal;
  }

  return {
    rawScores: scores,
    percentages: percentages,
    dominant: dominantResult,
    description: desc,
  };
}

export function getLearningStyleLabel(type: string): string {
  const labels: Record<string, string> = {
    V: "Visual",
    A: "Auditory",
    K: "Kinesthetic",
    Multimodal: "Multimodal",
  };
  return labels[type] || type;
}

export function getLearningStyleColor(type: string): string {
  const colors: Record<string, string> = {
    V: "hsl(220, 70%, 50%)", // Blue
    A: "hsl(280, 65%, 60%)", // Purple
    K: "hsl(160, 60%, 45%)", // Green
  };
  return colors[type] || "hsl(0, 0%, 50%)";
}
