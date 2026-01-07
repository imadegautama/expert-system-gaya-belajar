import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { calculateLearningStyle } from "@/lib/inference";
import type { Question, AnswerType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Loader2, AlertCircle, Eye, Ear, Hand } from "lucide-react";

// Sample questions for fallback if Supabase is not configured
const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Ketika Anda mendapat petunjuk arah, Anda lebih suka:",
    options: [
      { label: "Melihat peta atau diagram", type: "V" },
      { label: "Mendengar penjelasan lisan", type: "A" },
      { label: "Diantar langsung ke tempat tujuan", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 2,
    text: "Ketika belajar materi baru, Anda lebih mudah memahami dengan:",
    options: [
      { label: "Membaca buku dengan gambar dan diagram", type: "V" },
      { label: "Mendengarkan penjelasan guru atau podcast", type: "A" },
      { label: "Langsung mencoba praktiknya", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 3,
    text: "Saat memilih smartphone baru, Anda akan:",
    options: [
      { label: "Melihat desain dan tampilannya", type: "V" },
      { label: "Bertanya pendapat teman atau sales", type: "A" },
      { label: "Mencoba langsung di toko", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 4,
    text: "Jika Anda ingin memasak resep baru, Anda akan:",
    options: [
      { label: "Melihat video tutorial memasak", type: "V" },
      { label: "Mendengarkan instruksi dari seseorang", type: "A" },
      { label: "Langsung mencoba memasak sambil belajar", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 5,
    text: "Ketika mengingat sesuatu, Anda lebih mudah mengingat:",
    options: [
      { label: "Wajah dan penampilan orang tersebut", type: "V" },
      { label: "Nama dan suara orang tersebut", type: "A" },
      { label: "Pengalaman yang pernah Anda alami bersama", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 6,
    text: "Saat presentasi, Anda lebih suka menggunakan:",
    options: [
      { label: "Slide berisi grafik, gambar, dan diagram", type: "V" },
      {
        label: "Banyak penjelasan lisan tanpa terlalu banyak slide",
        type: "A",
      },
      { label: "Demonstrasi atau contoh langsung", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 7,
    text: "Jika ada masalah teknis pada komputer, Anda akan:",
    options: [
      { label: "Mencari tutorial dengan screenshot atau video", type: "V" },
      {
        label: "Menelepon teman atau customer service untuk bertanya",
        type: "A",
      },
      { label: "Mencoba-coba sendiri sampai berhasil", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 8,
    text: "Saat rapat atau meeting, Anda lebih suka:",
    options: [
      { label: "Ada presentasi visual atau whiteboard", type: "V" },
      { label: "Diskusi dan brainstorming lisan", type: "A" },
      { label: "Workshop atau aktivitas hands-on", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 9,
    text: "Ketika menunggu giliran, Anda cenderung:",
    options: [
      { label: "Melihat-lihat sekeliling atau membaca", type: "V" },
      { label: "Berbicara atau mendengarkan musik", type: "A" },
      {
        label: "Bergerak-gerak atau bermain dengan benda di sekitar",
        type: "K",
      },
    ],
    created_at: "",
  },
  {
    id: 10,
    text: "Dalam memilih liburan, Anda lebih tertarik dengan:",
    options: [
      { label: "Tempat dengan pemandangan indah untuk difoto", type: "V" },
      { label: "Tempat dengan musik dan budaya lokal yang menarik", type: "A" },
      {
        label: "Tempat dengan aktivitas petualangan seperti hiking atau diving",
        type: "K",
      },
    ],
    created_at: "",
  },
  {
    id: 11,
    text: "Saat belajar bahasa asing, cara yang paling efektif untuk Anda adalah:",
    options: [
      { label: "Menghafal dengan flashcard atau gambar", type: "V" },
      { label: "Mendengarkan percakapan dan menirukan", type: "A" },
      { label: "Langsung berbicara dengan penutur asli", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 12,
    text: "Ketika membeli pakaian, yang paling penting bagi Anda adalah:",
    options: [
      { label: "Tampilan dan warna yang menarik", type: "V" },
      { label: "Rekomendasi dari teman atau sales", type: "A" },
      { label: "Kenyamanan saat dipakai", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 13,
    text: "Saat stres atau cemas, Anda cenderung:",
    options: [
      { label: "Melamun atau membayangkan tempat yang tenang", type: "V" },
      {
        label: "Berbicara dengan seseorang atau mendengarkan musik",
        type: "A",
      },
      { label: "Berjalan-jalan atau melakukan aktivitas fisik", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 14,
    text: "Dalam menjelaskan sesuatu kepada orang lain, Anda lebih suka:",
    options: [
      { label: "Menggambar atau menunjukkan gambar", type: "V" },
      { label: "Menjelaskan dengan kata-kata secara verbal", type: "A" },
      { label: "Memperagakan atau mendemonstrasikan", type: "K" },
    ],
    created_at: "",
  },
  {
    id: 15,
    text: "Ketika mempelajari software atau aplikasi baru, Anda akan:",
    options: [
      { label: "Membaca manual dengan screenshot", type: "V" },
      { label: "Meminta seseorang menjelaskan cara menggunakannya", type: "A" },
      { label: "Langsung mencoba-coba fiturnya", type: "K" },
    ],
    created_at: "",
  },
];

export const Route = createFileRoute("/quiz")({
  loader: async () => {
    try {
      const { data, error } = await supabase.from("questions").select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        return data as Question[];
      }
      // Return sample questions if no data in database
      return sampleQuestions;
    } catch {
      // Return sample questions on error
      return sampleQuestions;
    }
  },
  component: QuizPage,
  pendingComponent: LoadingQuiz,
  errorComponent: ErrorQuiz,
});

function LoadingQuiz() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--chart-1))]" />
      <p className="text-[hsl(var(--muted-foreground))]">
        Memuat pertanyaan...
      </p>
    </div>
  );
}

function ErrorQuiz() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-[hsl(var(--foreground))]">
        Terjadi kesalahan saat memuat pertanyaan.
      </p>
      <Button onClick={() => navigate({ to: "/" })}>Kembali ke Home</Button>
    </div>
  );
}

function QuizPage() {
  const questions = Route.useLoaderData();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (!name) {
      navigate({ to: "/" });
    } else {
      setUserName(name);
    }
  }, [navigate]);

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (type: AnswerType) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: AnswerType[]) => {
    setIsSubmitting(true);

    const result = calculateLearningStyle(finalAnswers);

    // Try to save to database and capture the ID
    let resultId: number | null = null;
    try {
      const { data, error } = await supabase
        .from("results")
        .insert({
          user_name: userName,
          score_visual: result.rawScores.V,
          score_auditory: result.rawScores.A,
          score_kinesthetic: result.rawScores.K,
          dominant_style: result.dominant,
        })
        .select("id")
        .single();

      if (!error && data) {
        resultId = data.id;
      }
    } catch {
      // Ignore database errors, still show result
    }

    // Save result to localStorage for result page (include ID if available)
    localStorage.setItem(
      "examResult",
      JSON.stringify({ ...result, id: resultId })
    );
    navigate({ to: "/result" });
  };

  const getOptionIcon = (type: AnswerType) => {
    switch (type) {
      case "V":
        return <Eye className="h-5 w-5" />;
      case "A":
        return <Ear className="h-5 w-5" />;
      case "K":
        return <Hand className="h-5 w-5" />;
    }
  };

  const getOptionColor = (type: AnswerType) => {
    switch (type) {
      case "V":
        return "hover:border-[hsl(220,70%,50%)] hover:bg-[hsl(220,70%,50%)]/10";
      case "A":
        return "hover:border-[hsl(280,65%,60%)] hover:bg-[hsl(280,65%,60%)]/10";
      case "K":
        return "hover:border-[hsl(160,60%,45%)] hover:bg-[hsl(160,60%,45%)]/10";
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
          <span>Halo, {userName}!</span>
          <span>
            Pertanyaan {currentIndex + 1} dari {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="w-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardDescription className="text-[hsl(var(--chart-1))] font-medium">
            Pertanyaan #{currentIndex + 1}
          </CardDescription>
          <CardTitle className="text-xl md:text-2xl leading-relaxed">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              id={`option-${index}`}
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleAnswer(option.type)}
              className={`w-full h-auto py-4 px-6 justify-start text-left text-base font-normal transition-all duration-200 ${getOptionColor(option.type)}`}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-lg bg-[hsl(var(--secondary))]">
                  {getOptionIcon(option.type)}
                </div>
                <span className="flex-1 text-wrap">{option.label}</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Loading indicator when submitting */}
      {isSubmitting && (
        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Menganalisis hasil...</span>
        </div>
      )}
    </div>
  );
}
