import { AnalysisForm } from "@/app/analyze/_components/analysis-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Sparkles, Target } from "lucide-react"

export default function AnalyzePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-balance font-bold text-4xl text-foreground md:text-5xl">Analyze Your Idea</h1>
        <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
          Describe your hackathon project and we'll analyze its originality against thousands of past submissions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalysisForm />
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Be specific about the problem you're solving</p>
              <p>• Mention key technologies and approaches</p>
              <p>• Include your unique value proposition</p>
              <p>• Describe the target audience or use case</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="text-lg">What You'll Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Overall originality score (0-100)</p>
              <p>• Detailed metric breakdowns</p>
              <p>• Similar existing projects</p>
              <p>• Actionable improvement suggestions</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Target className="h-5 w-5 text-success" />
              </div>
              <CardTitle className="text-lg">Example Ideas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Good:</strong> "An AI-powered meal planner that generates recipes
                based on dietary restrictions and available ingredients using computer vision"
              </p>
              <p>
                <strong className="text-foreground">Better:</strong> "A mobile app that uses GPT-4 and image recognition
                to scan your fridge, suggest recipes for dietary needs, and auto-generate shopping lists"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
