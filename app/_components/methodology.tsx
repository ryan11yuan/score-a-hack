import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Methodology() {
  return (
    <section id="methodology" className="bg-card/30 py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground leading-relaxed">
            Our analysis combines natural language processing with a
            comprehensive database of hackathon projects.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              1
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">
                Submit Your Idea
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe your hackathon project in a few sentences. Include the
                problem you're solving, your approach, and key technologies.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              2
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">
                AI Analysis
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI processes your description using semantic search to find
                similar projects from Devpost's extensive database of hackathon
                submissions.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              3
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">
                Get Your Score
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive a detailed originality score (0-100) with breakdowns
                across multiple dimensions, similar projects, and actionable
                recommendations.
              </p>
            </div>
          </div>
        </div>

        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground">
              Scoring Methodology
            </CardTitle>
            <CardDescription>
              Our originality score is calculated based on several factors:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-foreground">
                    Concept Uniqueness (40%):
                  </strong>{" "}
                  How novel is the core idea?
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-foreground">
                    Implementation Approach (30%):
                  </strong>{" "}
                  Are you using technologies in new ways?
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-foreground">
                    Market Saturation (20%):
                  </strong>{" "}
                  How many similar projects exist?
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-foreground">
                    Trend Alignment (10%):
                  </strong>{" "}
                  Does it address emerging needs?
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
