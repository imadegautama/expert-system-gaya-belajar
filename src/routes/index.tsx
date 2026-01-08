import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  BookOpen,
  Brain,
  Eye,
  Ear,
  Hand,
  Info,
  FileText,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
      navigate({ to: "/quiz" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--secondary))] text-sm text-[hsl(var(--muted-foreground))] mb-4">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Sistem Pakar Berbasis Forward Chaining
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[hsl(var(--foreground))] via-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] bg-clip-text text-transparent">
          Temukan Gaya Belajar Anda
        </h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
          Jawab beberapa pertanyaan sederhana dan sistem pakar kami akan
          menganalisis gaya belajar yang paling cocok untuk Anda.
        </p>
      </div>

      {/* Start Form */}
      <Card className="w-full max-w-md border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 p-3 rounded-full bg-[hsl(var(--secondary))]">
            <Brain className="h-8 w-8 text-[hsl(var(--chart-1))]" />
          </div>
          <CardTitle className="text-xl">Mulai Quiz</CardTitle>
          <CardDescription>
            Masukkan nama Anda untuk memulai diagnosa gaya belajar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name-input"
              type="text"
              placeholder="Masukkan nama Anda..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 text-base bg-[hsl(var(--background))] border-[hsl(var(--border))] focus:border-[hsl(var(--chart-1))]"
            />
          </div>
          <Button
            id="start-button"
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[hsl(var(--chart-1))] to-[hsl(var(--chart-2))] hover:opacity-90 transition-opacity"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Mulai Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Learning Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))]">
          <div className="p-2 rounded-lg bg-[hsl(220,70%,50%)]/20">
            <Eye className="h-5 w-5 text-[hsl(220,70%,50%)]" />
          </div>
          <div>
            <p className="font-medium text-[hsl(var(--foreground))]">Visual</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Belajar dengan melihat
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))]">
          <div className="p-2 rounded-lg bg-[hsl(280,65%,60%)]/20">
            <Ear className="h-5 w-5 text-[hsl(280,65%,60%)]" />
          </div>
          <div>
            <p className="font-medium text-[hsl(var(--foreground))]">
              Auditory
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Belajar dengan mendengar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))]">
          <div className="p-2 rounded-lg bg-[hsl(160,60%,45%)]/20">
            <Hand className="h-5 w-5 text-[hsl(160,60%,45%)]" />
          </div>
          <div>
            <p className="font-medium text-[hsl(var(--foreground))]">
              Kinesthetic
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Belajar dengan praktik
            </p>
          </div>
        </div>
      </div>

      {/* VARK Information Section */}
      <div className="w-full max-w-3xl space-y-8 mt-8 mb-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Apa itu VARK?</h2>
          <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
            VARK adalah singkatan dari{" "}
            <span className="font-semibold text-[hsl(var(--foreground))]">
              Visual, Aural, Read/Write, dan Kinesthetic
            </span>
            . Model ini dikembangkan oleh{" "}
            <span className="font-semibold text-[hsl(var(--foreground))]">
              Neil Fleming
            </span>{" "}
            pada tahun 1987 untuk membantu siswa dan pengajar memahami
            preferensi belajar individu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[hsl(var(--card))]/50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Fakta Menarik</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-[hsl(var(--muted-foreground))] space-y-2">
              <p>
                • VARK dikembangkan dari observasi ribuan jam di kelas oleh Neil
                Fleming.
              </p>
              <p>
                • Lebih dari 70% orang memiliki preferensi{" "}
                <strong>multimodal</strong> (gabungan beberapa gaya).
              </p>
              <p>
                • Mengetahui gaya belajar dapat meningkatkan efisiensi belajar
                secara signifikan.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--card))]/50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Detail Gaya Belajar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-[hsl(var(--muted-foreground))] space-y-2">
              <p>
                <strong className="text-[hsl(220,70%,50%)]">Visual:</strong>{" "}
                Belajar lewat grafik, peta, diagram.
              </p>
              <p>
                <strong className="text-[hsl(280,65%,60%)]">Aural:</strong>{" "}
                Belajar lewat diskusi, mendengarkan.
              </p>
              <p>
                <strong className="text-[hsl(var(--foreground))]">
                  Read/Write:
                </strong>{" "}
                Suka membaca teks & menulis catatan.
              </p>
              <p>
                <strong className="text-[hsl(160,60%,45%)]">
                  Kinesthetic:
                </strong>{" "}
                Belajar lewat praktik & pengalaman nyata.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[hsl(var(--secondary))]/30 border-dashed">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sumber
            </h3>
            <div className="space-y-4 text-xs text-[hsl(var(--muted-foreground))]">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-[hsl(var(--foreground))]">
                  Neil Fleming & Colleen Mills (1992)
                </p>
                <p className="italic">
                  "Not Another Inventory, Rather a Catalyst for Reflection."
                </p>
                <p>To Improve the Academy, Vol. 11, 1992.</p>
              </div>
              <div className="border-t border-[hsl(var(--border))] pt-4">
                <a
                  href="https://vark-learn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Kunjungi Website Resmi VARK (vark-learn.com)
                </a>
                <p className="mt-1">
                  Situs resmi yang menyediakan kuesioner, artikel penelitian,
                  dan panduan strategi belajar sejak 2001.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
