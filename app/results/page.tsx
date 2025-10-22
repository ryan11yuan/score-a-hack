"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { analyzeProject } from "@/lib/project";
import {
  ArrowLeft,
  ExternalLink,
  Lightbulb,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";

type AnalysisResults = Awaited<ReturnType<typeof analyzeProject>>;

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("analysisResults");
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults) as AnalysisResults);
      } catch {
        setResults(null);
      }
    } else {
      router.push("/analyze");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const { project, structuredDescription, keywords, similar } = results;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 gap-2" asChild>
          <Link href="/analyze">
            <ArrowLeft className="h-4 w-4" />
            Analyze Another Idea
          </Link>
        </Button>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-balance font-bold text-3xl text-foreground md:text-4xl">
              {project.title ?? "Untitled Project"}
            </h1>
            {project.tagline ? (
              <p className="text-muted-foreground">{project.tagline}</p>
            ) : null}
          </div>

          <div className="flex gap-2">
            {/* Optional actions (non-functional placeholders) */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              asChild
            >
              <a
                href={`https://devpost.com/software/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                View on Devpost
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Image (if available) */}
      {project.images && project.images.length > 0 ? (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[0]}
            alt={project.title ?? "Project image"}
            className="h-64 w-full object-cover"
          />
        </div>
      ) : null}

      {/* Project Description */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
          <CardDescription>
            Raw description pulled from the Devpost page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </CardContent>
      </Card>

      {/* Structured Analysis */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Structured Summary</CardTitle>
            <CardDescription>One-sentence overview</CardDescription>
          </CardHeader>
          <CardContent>
            {typeof structuredDescription === "string" ? (
              <p className="text-muted-foreground">
                {structuredDescription || "No structured summary available."}
              </p>
            ) : (
              <p className="text-foreground leading-relaxed">
                {/* {structuredDescription.shortDescription} */}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Keywords</CardTitle>
            <CardDescription>Extracted KWS (max ~3 words)</CardDescription>
          </CardHeader>
          <CardContent>
            {keywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {keywords.map((k, i) => (
                  <Badge key={`${k}-${i}`} variant="outline">
                    {k}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No keywords detected.</p>
            )}
          </CardContent>
        </Card>

        {/* Thematic Focus */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Thematic Focus</CardTitle>
            <CardDescription>
              What space does this project live in?
            </CardDescription>
          </CardHeader>
          <CardContent>
            {typeof structuredDescription === "string" ? (
              <p className="text-muted-foreground">N/A</p>
            ) : (
              <p className="text-foreground leading-relaxed">
                {/* {structuredDescription.thematicFocus} */}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Objective Approach */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Objective & Approach</CardTitle>
            <CardDescription>What tech and methods are used?</CardDescription>
          </CardHeader>
          <CardContent>
            {typeof structuredDescription === "string" ? (
              <p className="text-muted-foreground">N/A</p>
            ) : (
              <p className="text-foreground leading-relaxed">
                {/* {structuredDescription.objectiveApproach} */}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Target User */}
        <Card className="md:col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <CardTitle>Target User</CardTitle>
            </div>
            <CardDescription>Who benefits from this project?</CardDescription>
          </CardHeader>
          <CardContent>
            {typeof structuredDescription === "string" ? (
              <p className="text-muted-foreground">N/A</p>
            ) : (
              <p className="text-foreground leading-relaxed">
                {/* {structuredDescription.targetUser} */}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Similar Projects */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Similar Projects on Devpost</CardTitle>
          </div>
          <CardDescription>Closest matches by keywords/theme</CardDescription>
        </CardHeader>
        <CardContent>
          {similar?.length ? (
            <div className="space-y-4">
              {similar.map((p, idx) => {
                const link = `https://devpost.com/software/${p.id}`;
                return (
                  <div key={p.id}>
                    {idx > 0 && <Separator className="my-4" />}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">
                            {p.title ?? p.id}
                          </h4>
                        </div>
                        {p.tagline ? (
                          <p className="mb-2 text-muted-foreground text-sm leading-relaxed">
                            {p.tagline}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          {(p.tags ?? []).slice(0, 8).map((t: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: any) => (
                            <Badge
                              key={`${t}-${i}`}
                              variant="outline"
                              className="text-xs"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 gap-2"
                        asChild
                      >
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No similar projects found.</p>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/analyze">
            <RefreshCw className="h-5 w-5" />
            Analyze Another Idea
          </Link>
        </Button>
      </div>
    </div>
  );
}
