import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-foreground">Score a Hack</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/analyze"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Analyze
          </Link>
          <Link
            href="#methodology"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Methodology
          </Link>
          <Button asChild size="sm">
            <Link href="/analyze">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
