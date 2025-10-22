"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Search, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AnalysisForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"url" | "manual">("url")
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    technologies: "",
    devpostUrl: "",
  })

  const analyzeWithPayload = async (payload: any) => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error("Analysis failed")
    const data = await response.json()
    sessionStorage.setItem("analysisResults", JSON.stringify(data))
    router.push("/results")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "url") {
        if (!formData.devpostUrl || !formData.devpostUrl.includes("devpost.com")) {
          toast({
            title: "Invalid Devpost URL",
            description: "Please provide a valid Devpost project URL.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Scrape Devpost to auto-extract fields
        const scrapeRes = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: formData.devpostUrl }),
        })
        if (!scrapeRes.ok) {
          throw new Error("Scrape failed")
        }
        const scraped = await scrapeRes.json()

        const payload = {
          projectName: scraped.title || formData.projectName || "Devpost Project",
          description: scraped.description || formData.description,
          technologies: Array.isArray(scraped.technologies)
            ? scraped.technologies.join(", ")
            : formData.technologies,
          devpostUrl: formData.devpostUrl,
        }

        if (!payload.description || payload.description.trim().length < 50) {
          toast({
            title: "Insufficient description",
            description: "Could not extract enough details from Devpost. Add a brief description.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        await analyzeWithPayload(payload)
      } else {
        // Manual mode validation
        if (!formData.description.trim()) {
          toast({
            title: "Description required",
            description: "Please provide a description of your hackathon idea.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        if (formData.description.trim().length < 50) {
          toast({
            title: "Description too short",
            description: "Please provide at least 50 characters to get accurate results.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        await analyzeWithPayload(formData)
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Choose a mode: paste a Devpost URL or enter details manually.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> Devpost URL
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Search className="h-4 w-4" /> Manual Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="devpostUrl" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Devpost Project URL
                </Label>
                <Input
                  id="devpostUrl"
                  type="url"
                  placeholder="https://devpost.com/software/your-project"
                  value={formData.devpostUrl}
                  onChange={(e) => setFormData({ ...formData, devpostUrl: e.target.value })}
                  disabled={isLoading}
                  className="font-mono text-sm"
                />
                <p className="text-muted-foreground text-xs">We will fetch details and analyze automatically.</p>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">
                  Project Name <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g., SmartFridge AI"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Project Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your hackathon project in detail. What problem does it solve? How does it work? What makes it unique?"
                  className="min-h-[200px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isLoading}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  {formData.description.length} characters (minimum 50 recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">
                  Technologies <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="technologies"
                  placeholder="e.g., React, Python, TensorFlow, OpenAI API"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  disabled={isLoading}
                />
                <p className="text-muted-foreground text-xs">Separate multiple technologies with commas</p>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {mode === "url" ? "Fetching & Analyzing..." : "Analyzing Your Idea..."}
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                {mode === "url" ? "Scrape & Analyze" : "Analyze Originality"}
              </>
            )}
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            Analysis typically takes 2-3 seconds. Your data is not stored.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
