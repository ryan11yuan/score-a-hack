"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DevPostProject } from "@/lib/devpost";
import { Search, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-border/40 bg-gradient-to-b from-background/80 to-card/30 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 gap-2">
            <Zap className="h-3 w-3" />
            Powered by Devpost Data
          </Badge>

          <h1 className="mb-6 text-balance font-bold text-4xl text-foreground md:text-6xl lg:text-7xl">
            Is Your Hackathon Idea{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-white px-4 py-2 font-black text-4xl text-zinc-900 md:text-5xl lg:text-[65px] animate-pulse-slow shadow-2xl shadow-indigo-500/50">
                Original
              </span>
            </span>
            ?
          </h1>

          <p className="mb-8 max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed md:text-xl">
            Get instant analysis of your hackathon idea's originality. Compare
            against thousands of projects from Devpost and discover what makes
            your concept unique.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/analyze">
                <Search className="h-5 w-5" />
                Analyze Your Idea
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#methodology">Learn How It Works</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-8 text-left sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">
                Projects Analyzed
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="text-3xl font-bold text-primary">{"<"}3s</div>
              <div className="text-sm text-muted-foreground">Analysis Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
