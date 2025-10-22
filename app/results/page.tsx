"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  TrendingUp,
  Lightbulb,
  ExternalLink,
  Share2,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { ScoreGauge } from "@/components/score-gauge"

interface GitHubAnalysis {
  repositoryUrl?: string
  languages?: Record<string, number>
  fileExtensions?: Record<string, number>
  totalFiles?: number
  analyzedAt?: string
}

interface AnalysisResults {
  projectName: string
  description: string
  technologies: string[]
  githubAnalysis?: GitHubAnalysis
  overallScore: number
  scores: {
    concept: number
    implementation: number
    market: number
    trend: number
  }
  similarProjects: Array<{
    id: number
    name: string
    description: string
    similarity: number
    url: string
    technologies: string[]
  }>
  insights: string[]
  analyzedAt: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedResults = sessionStorage.getItem("analysisResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      router.push("/analyze")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-accent"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Highly Original"
    if (score >= 60) return "Moderately Original"
    return "Common Concept"
  }

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
            <h1 className="mb-2 text-balance font-bold text-3xl text-foreground md:text-4xl">{results.projectName}</h1>
            <p className="text-muted-foreground">
              Analyzed on{" "}
              {new Date(results.analyzedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Originality Score</CardTitle>
          <CardDescription>Overall assessment of your hackathon idea's uniqueness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <ScoreGauge score={results.overallScore} size={200} />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className={`font-bold text-2xl ${getScoreColor(results.overallScore)}`}>
                    {getScoreLabel(results.overallScore)}
                  </h3>
                  <Badge variant={results.overallScore >= 70 ? "default" : "secondary"}>
                    {results.overallScore}/100
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">{results.description}</p>
              </div>

              {results.technologies.length > 0 && (
                <div>
                  <p className="mb-2 font-medium text-foreground text-sm">Technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Concept Uniqueness</CardTitle>
            <CardDescription>How novel is the core idea?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-bold text-2xl ${getScoreColor(results.scores.concept)}`}>
                {results.scores.concept}
              </span>
              <span className="text-muted-foreground text-sm">40% weight</span>
            </div>
            <Progress value={results.scores.concept} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Implementation Approach</CardTitle>
            <CardDescription>Using technologies in new ways?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-bold text-2xl ${getScoreColor(results.scores.implementation)}`}>
                {results.scores.implementation}
              </span>
              <span className="text-muted-foreground text-sm">30% weight</span>
            </div>
            <Progress value={results.scores.implementation} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Market Saturation</CardTitle>
            <CardDescription>How many similar projects exist?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-bold text-2xl ${getScoreColor(results.scores.market)}`}>
                {results.scores.market}
              </span>
              <span className="text-muted-foreground text-sm">20% weight</span>
            </div>
            <Progress value={results.scores.market} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Trend Alignment</CardTitle>
            <CardDescription>Addresses emerging needs?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-bold text-2xl ${getScoreColor(results.scores.trend)}`}>
                {results.scores.trend}
              </span>
              <span className="text-muted-foreground text-sm">10% weight</span>
            </div>
            <Progress value={results.scores.trend} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* GitHub Analysis */}
      {results.githubAnalysis && (
        <Card className="mb-8 border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              <CardTitle>GitHub Repository Analysis</CardTitle>
            </div>
            <CardDescription>
              Technology usage analysis from the project's GitHub repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Repository Link */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Repository:</span>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href={results.githubAnalysis.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>

              {/* Languages Analysis */}
              {results.githubAnalysis.languages && Object.keys(results.githubAnalysis.languages).length > 0 && (
                <div>
                  <h4 className="mb-3 font-medium text-foreground">Programming Languages</h4>
                  <div className="space-y-2">
                    {Object.entries(results.githubAnalysis.languages)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)
                      .map(([lang, bytes]) => {
                        const totalBytes = Object.values(results.githubAnalysis.languages!).reduce((sum, b) => sum + b, 0)
                        const percentage = Math.round((bytes / totalBytes) * 100)
                        return (
                          <div key={lang} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-foreground">{lang}</span>
                              <span className="text-muted-foreground">{percentage}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* File Extensions */}
              {results.githubAnalysis.fileExtensions && Object.keys(results.githubAnalysis.fileExtensions).length > 0 && (
                <div>
                  <h4 className="mb-3 font-medium text-foreground">File Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(results.githubAnalysis.fileExtensions)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 12)
                      .map(([ext, count]) => {
                        const percentage = results.githubAnalysis.totalFiles 
                          ? Math.round((count / results.githubAnalysis.totalFiles!) * 100)
                          : 0
                        return (
                          <Badge key={ext} variant="outline" className="gap-1">
                            <span className="font-mono text-xs">.{ext}</span>
                            <span className="text-xs text-muted-foreground">({percentage}%)</span>
                          </Badge>
                        )
                      })}
                  </div>
                  {results.githubAnalysis.totalFiles && (
                    <p className="mt-2 text-muted-foreground text-xs">
                      Total files analyzed: {results.githubAnalysis.totalFiles}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <CardTitle>Key Insights & Recommendations</CardTitle>
          </div>
          <CardDescription>Actionable suggestions to improve your idea's originality</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.insights.map((insight, index) => (
              <li key={index} className="flex gap-3">
                {results.overallScore >= 70 ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                )}
                <span className="text-foreground leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Similar Projects */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Similar Projects on Devpost</CardTitle>
          </div>
          <CardDescription>Projects with comparable concepts or implementations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.similarProjects.map((project, index) => (
              <div key={project.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{project.name}</h4>
                        <Badge variant="secondary">{Math.round(project.similarity * 100)}% similar</Badge>
                      </div>
                      <p className="mb-2 text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 gap-2" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        View
                      </a>
                    </Button>
                  </div>
                  <Progress value={project.similarity * 100} className="h-1" />
                </div>
              </div>
            ))}
          </div>
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
  )
}
