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
import { Sparkles, BookOpen, Brain, Eye, Ear, Hand } from "lucide-react";

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
    </div>
  );
}
