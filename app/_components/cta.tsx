import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="border-t border-border/40 bg-gradient-to-b from-background to-card/50 py-20">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-4 text-balance font-bold text-3xl text-foreground md:text-4xl">
          Ready to Score Your Hack?
        </h2>
        <p className="mb-8 text-balance text-lg text-muted-foreground leading-relaxed">
          Join thousands of hackers who've used our tool to validate and improve
          their ideas.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/analyze">
            <Search className="h-5 w-5" />
            Start Analysis Now
          </Link>
        </Button>
      </div>
    </section>
  );
}
