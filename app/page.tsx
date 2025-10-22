import CTA from "./_components/cta"
import Features from "./_components/features"
import Hero from "./_components/hero"
import Methodology from "./_components/methodology"

export default async function Page() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Methodology Section */}
      <Methodology/>

      {/* CTA Section */}
      <CTA/>
    </div>
  )
}
