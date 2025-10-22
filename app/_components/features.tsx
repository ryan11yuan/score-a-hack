import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Lightbulb,
  Search,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function Features() {
  return (
    <section className="border-b border-border/40 bg-background py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl text-foreground md:text-4xl">
            Why Use Score a Hack?
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground leading-relaxed">
            Whether you're a participant looking to refine your idea or a judge
            evaluating submissions, our tool provides data-driven insights.
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
                Get your originality score in seconds. Our AI analyzes your idea
                against thousands of past hackathon projects.
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
                Discover projects similar to yours. Learn from what's been done
                and find ways to differentiate your approach.
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
                View comprehensive breakdowns including concept uniqueness,
                implementation novelty, and market saturation.
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
                Receive actionable suggestions to make your idea more unique and
                stand out from the competition.
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
                See how your idea fits into current hackathon trends and
                emerging technology patterns.
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
                No signup required. Get instant results completely free. Perfect
                for quick validation during ideation.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
