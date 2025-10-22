import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-semibold text-foreground">Score a Hack</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping hackathon participants and judges understand idea originality through data-driven analysis.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#methodology" className="text-muted-foreground hover:text-foreground transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@scoreahack.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@scoreahack.com
                </a>
              </li>
              <li>
                <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Score a Hack. Built for the hackathon community.</p>
        </div>
      </div>
    </footer>
  )
}
