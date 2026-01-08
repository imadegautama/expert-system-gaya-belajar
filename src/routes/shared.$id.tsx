import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import type { InferenceResult } from "@/lib/types";
import { getLearningStyleLabel, getLearningStyleColor } from "@/lib/inference";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Eye,
  Ear,
  Hand,
  Lightbulb,
  Share2,
  Home,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";

const DESCRIPTIONS: Record<string, string> = {
  V: "Anda adalah pembelajar Visual. Anda memahami informasi lebih baik melalui gambar, diagram, dan grafik. Tips: Gunakan mind map, highlighter warna-warni, dan video pembelajaran.",
  A: "Anda adalah pembelajar Auditory. Anda lebih mudah menyerap informasi melalui pendengaran dan diskusi. Tips: Dengarkan podcast, diskusi kelompok, dan rekam materi untuk didengar ulang.",
  K: "Anda adalah pembelajar Kinesthetic. Anda belajar paling efektif melalui praktik langsung dan aktivitas fisik. Tips: Buat proyek, lakukan eksperimen, dan jangan duduk diam saat belajar.",
  Multimodal:
    "Anda memiliki gaya belajar Multimodal (Campuran). Anda fleksibel menggunakan berbagai metode belajar. Tips: Kombinasikan berbagai metode sesuai topik yang dipelajari.",
};

export const Route = createFileRoute("/shared/$id")({
  loader: async ({ params }) => {
    const { id } = params;

    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new Error("Hasil tidak ditemukan");
    }

    const totalScore =
      data.score_visual + data.score_auditory + data.score_kinesthetic;

    const result: InferenceResult & { id: number; userName: string } = {
      id: data.id,
      userName: data.user_name,
      rawScores: {
        V: data.score_visual,
        A: data.score_auditory,
        K: data.score_kinesthetic,
      },
      percentages: {
        V:
          totalScore > 0
            ? Math.round((data.score_visual / totalScore) * 100)
            : 0,
        A:
          totalScore > 0
            ? Math.round((data.score_auditory / totalScore) * 100)
            : 0,
        K:
          totalScore > 0
            ? Math.round((data.score_kinesthetic / totalScore) * 100)
            : 0,
      },
      dominant: data.dominant_style,
      description: DESCRIPTIONS[data.dominant_style] || DESCRIPTIONS.Multimodal,
    };

    return result;
  },
  component: SavedResultPage,
  pendingComponent: LoadingResult,
  errorComponent: ErrorResult,
});

function LoadingResult() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--chart-1))]" />
      <p className="text-[hsl(var(--muted-foreground))]">Memuat hasil...</p>
    </div>
  );
}

function ErrorResult() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-[hsl(var(--foreground))]">
        Hasil tidak ditemukan atau terjadi kesalahan.
      </p>
      <Button onClick={() => navigate({ to: "/" })}>Kembali ke Home</Button>
    </div>
  );
}

function SavedResultPage() {
  const result = Route.useLoaderData();
  const navigate = useNavigate();
  const [animatedProgress, setAnimatedProgress] = useState({
    V: 0,
    A: 0,
    K: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(result.percentages);
    }, 100);
    return () => clearTimeout(timer);
  }, [result]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDominantIcon = (type: string) => {
    switch (type) {
      case "V":
        return <Eye className="h-8 w-8" />;
      case "A":
        return <Ear className="h-8 w-8" />;
      case "K":
        return <Hand className="h-8 w-8" />;
      default:
        return <Trophy className="h-8 w-8" />;
    }
  };

  const scoreData = [
    {
      type: "V",
      label: "Visual",
      icon: Eye,
      color: "hsl(220, 70%, 50%)",
      bgColor: "hsl(220, 70%, 50%)",
      score: result.rawScores.V,
      percentage: animatedProgress.V,
    },
    {
      type: "A",
      label: "Auditory",
      icon: Ear,
      color: "hsl(280, 65%, 60%)",
      bgColor: "hsl(280, 65%, 60%)",
      score: result.rawScores.A,
      percentage: animatedProgress.A,
    },
    {
      type: "K",
      label: "Kinesthetic",
      icon: Hand,
      color: "hsl(160, 60%, 45%)",
      bgColor: "hsl(160, 60%, 45%)",
      score: result.rawScores.K,
      percentage: animatedProgress.K,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[hsl(var(--foreground))] via-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] bg-clip-text text-transparent">
          Hasil Analisis
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Hasil analisis gaya belajar {result.userName}
        </p>
      </div>

      <Card className="w-full border-2 border-[hsl(var(--chart-1))]/30 bg-linear-to-br from-[hsl(var(--card))] to-[hsl(var(--chart-1))]/5 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--chart-1))]/10 rounded-full blur-3xl" />
        <CardHeader className="text-center relative">
          <div
            className="mx-auto mb-4 p-4 rounded-full"
            style={{
              backgroundColor: `${getLearningStyleColor(result.dominant)}20`,
            }}
          >
            <div style={{ color: getLearningStyleColor(result.dominant) }}>
              {getDominantIcon(result.dominant)}
            </div>
          </div>
          <CardDescription className="text-[hsl(var(--chart-1))] font-medium">
            Gaya Belajar Dominan
          </CardDescription>
          <CardTitle className="text-3xl md:text-4xl">
            {getLearningStyleLabel(result.dominant)}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))]">
            <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-400 shrink-0" />
            <p className="text-[hsl(var(--foreground))] leading-relaxed">
              {result.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[hsl(var(--chart-1))]" />
            Rincian Skor
          </CardTitle>
          <CardDescription>
            Perbandingan skor untuk setiap gaya belajar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scoreData.map((item) => (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon
                      className="h-4 w-4"
                      style={{ color: item.color }}
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: item.color }}
                >
                  {item.percentage}%
                </span>
              </div>
              <Progress
                value={item.percentage}
                className="h-3"
                indicatorClassName="transition-all duration-1000 ease-out"
                style={
                  {
                    "--progress-color": item.bgColor,
                  } as React.CSSProperties
                }
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {item.score} dari{" "}
                {result.rawScores.V + result.rawScores.A + result.rawScores.K}{" "}
                pertanyaan
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          id="share-button"
          variant="outline"
          onClick={handleShare}
          className="flex-1 h-12"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Link Tersalin!
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Bagikan
            </>
          )}
        </Button>
        <Button
          id="home-button"
          onClick={() => navigate({ to: "/" })}
          className="flex-1 h-12 bg-linear-to-r from-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] hover:opacity-90"
        >
          <Home className="mr-2 h-4 w-4" />
          Coba Quiz
        </Button>
      </div>
    </div>
  );
}
