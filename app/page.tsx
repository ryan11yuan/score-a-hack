import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Search, BarChart3, Zap, Target, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
              Get instant analysis of your hackathon idea's originality. Compare against thousands of projects from
              Devpost and discover what makes your concept unique.
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
                <div className="text-sm text-muted-foreground">Projects Analyzed</div>
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

      {/* Features Section */}
      <section className="border-b border-border/40 bg-background py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance font-bold text-3xl text-foreground md:text-4xl">Why Use Score a Hack?</h2>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground leading-relaxed">
              Whether you're a participant looking to refine your idea or a judge evaluating submissions, our tool
              provides data-driven insights.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant Analysis</CardTitle>
                <CardDescription>
                  Get your originality score in seconds. Our AI analyzes your idea against thousands of past hackathon
                  projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Similar Projects</CardTitle>
                <CardDescription>
                  Discover projects similar to yours. Learn from what's been done and find ways to differentiate your
                  approach.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Detailed Metrics</CardTitle>
                <CardDescription>
                  View comprehensive breakdowns including concept uniqueness, implementation novelty, and market
                  saturation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Improvement Tips</CardTitle>
                <CardDescription>
                  Receive actionable suggestions to make your idea more unique and stand out from the competition.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  See how your idea fits into current hackathon trends and emerging technology patterns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Zap className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Fast & Free</CardTitle>
                <CardDescription>
                  No signup required. Get instant results completely free. Perfect for quick validation during ideation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="bg-card/30 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance font-bold text-3xl text-foreground md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground leading-relaxed">
              Our analysis combines natural language processing with a comprehensive database of hackathon projects.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground text-xl">Submit Your Idea</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Describe your hackathon project in a few sentences. Include the problem you're solving, your approach,
                  and key technologies.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground text-xl">AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI processes your description using semantic search to find similar projects from Devpost's
                  extensive database of hackathon submissions.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground text-xl">Get Your Score</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive a detailed originality score (0-100) with breakdowns across multiple dimensions, similar
                  projects, and actionable recommendations.
                </p>
              </div>
            </div>
          </div>

          <Card className="mt-12 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-foreground">Scoring Methodology</CardTitle>
              <CardDescription>Our originality score is calculated based on several factors:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Concept Uniqueness (40%):</strong> How novel is the core idea?
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Implementation Approach (30%):</strong> Are you using
                    technologies in new ways?
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Market Saturation (20%):</strong> How many similar projects
                    exist?
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Trend Alignment (10%):</strong> Does it address emerging needs?
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background to-card/50 py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl text-foreground md:text-4xl">
            Ready to Score Your Hack?
          </h2>
          <p className="mb-8 text-balance text-lg text-muted-foreground leading-relaxed">
            Join thousands of hackers who've used our tool to validate and improve their ideas.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/analyze">
              <Search className="h-5 w-5" />
              Start Analysis Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
