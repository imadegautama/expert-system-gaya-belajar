import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { InferenceResult } from "@/lib/types";
import { getLearningStyleLabel, getLearningStyleColor } from "@/lib/inference";
import { generateLearningRecommendations } from "@/lib/gemini";
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
  RefreshCcw,
  Trophy,
  Eye,
  Ear,
  Hand,
  Lightbulb,
  Share2,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/result")({
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<
    (InferenceResult & { id?: number }) | null
  >(null);
  const [userName, setUserName] = useState("");
  const [animatedProgress, setAnimatedProgress] = useState({
    V: 0,
    A: 0,
    K: 0,
  });
  const [copied, setCopied] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const storedResult = localStorage.getItem("examResult");

    if (!storedResult || !name) {
      navigate({ to: "/" });
      return;
    }

    setUserName(name);
    setResult(JSON.parse(storedResult));
  }, [navigate]);

  // Animate progress bars
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setAnimatedProgress(result.percentages);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleRetry = () => {
    localStorage.removeItem("examResult");
    navigate({ to: "/quiz" });
  };

  const handleHome = () => {
    localStorage.removeItem("examResult");
    localStorage.removeItem("userName");
    navigate({ to: "/" });
  };

  const handleShare = async () => {
    if (!result?.id) return;

    const shareUrl = `${window.location.origin}/shared/${result.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  if (!result) {
    return null;
  }

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
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[hsl(var(--foreground))] via-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] bg-clip-text text-transparent">
          Hasil Analisis
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Hai {userName}, berikut adalah hasil diagnosa gaya belajar Anda
        </p>
      </div>

      {/* Dominant Result Card */}
      <Card className="w-full border-2 border-[hsl(var(--chart-1))]/30 bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--chart-1))]/5 backdrop-blur-sm overflow-hidden relative">
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
            Gaya Belajar Dominan Anda
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

      {/* Score Breakdown */}
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

      {/* AI Recommendations */}
      <Card className="w-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--chart-2))]" />
            Rekomendasi AI
          </CardTitle>
          <CardDescription>
            Dapatkan rekomendasi belajar personal dari AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!aiRecommendation && !aiLoading && !aiError && (
            <Button
              id="get-ai-recommendation"
              onClick={async () => {
                setAiLoading(true);
                setAiError(null);
                const response = await generateLearningRecommendations(
                  result.dominant,
                  result.percentages
                );
                setAiLoading(false);
                if (response.error) {
                  setAiError(response.error);
                } else {
                  setAiRecommendation(response.text);
                }
              }}
              className="w-full h-12 bg-linear-to-r from-[hsl(var(--chart-2))] to-[hsl(var(--chart-1))] hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Dapatkan Rekomendasi dari AI
            </Button>
          )}

          {aiLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--chart-2))]" />
              <p className="text-[hsl(var(--muted-foreground))]">
                AI sedang menganalisis...
              </p>
            </div>
          )}

          {aiError && (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-red-500 text-center">{aiError}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setAiError(null);
                }}
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {aiRecommendation && (
            <div className="space-y-3">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1
                      className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h2
                      className="text-xl font-bold text-[hsl(var(--foreground))] mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h3
                      className="text-lg font-semibold text-[hsl(var(--chart-1))] mb-2"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      className="text-[hsl(var(--foreground))] leading-relaxed mb-3"
                      {...props}
                    />
                  ),
                  strong: ({ ...props }) => (
                    <strong
                      className="font-bold text-[hsl(var(--chart-1))]"
                      {...props}
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="space-y-2 ml-4 mb-4" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="space-y-2 ml-4 mb-4 list-decimal"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li
                      className="text-[hsl(var(--foreground))] leading-relaxed pl-2"
                      {...props}
                    />
                  ),
                  code: ({ ...props }) => (
                    <code
                      className="bg-[hsl(var(--secondary))] px-2 py-1 rounded text-sm font-mono"
                      {...props}
                    />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className="border-l-4 border-[hsl(var(--chart-1))] pl-4 italic text-[hsl(var(--muted-foreground))] my-3"
                      {...props}
                    />
                  ),
                }}
              >
                {aiRecommendation}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          id="retry-button"
          variant="outline"
          onClick={handleRetry}
          className="flex-1 h-12"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Ulangi Quiz
        </Button>
        <Button
          id="home-button"
          onClick={handleHome}
          className="flex-1 h-12 bg-gradient-to-r from-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] hover:opacity-90"
        >
          Kembali ke Home
        </Button>
      </div>

      {/* Share Section */}
      {result.id && (
        <div className="flex items-center gap-4">
          <Button
            id="share-button"
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Link tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Bagikan</span>
              </>
            )}
          </Button>
          {/* <span className="text-[hsl(var(--muted-foreground))]">•</span>
          <Button
            id="copy-link-button"
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <Link className="h-4 w-4" />
            <span>Salin Link</span>
          </Button> */}
        </div>
      )}
    </div>
  );
}
