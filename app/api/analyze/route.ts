import { type NextRequest, NextResponse } from "next/server"

// Mock data for similar projects
const mockSimilarProjects = [
  {
    id: 1,
    name: "FridgeVision",
    description: "AI-powered app that identifies food items in your fridge and suggests recipes",
    similarity: 0.87,
    url: "https://devpost.com/software/fridgevision",
    technologies: ["Python", "TensorFlow", "React Native"],
  },
  {
    id: 2,
    name: "MealMind",
    description: "Smart meal planning assistant using machine learning to recommend personalized recipes",
    similarity: 0.76,
    url: "https://devpost.com/software/mealmind",
    technologies: ["Node.js", "OpenAI API", "MongoDB"],
  },
  {
    id: 3,
    name: "RecipeAI",
    description: "Generate custom recipes based on available ingredients using GPT-3",
    similarity: 0.72,
    url: "https://devpost.com/software/recipeai",
    technologies: ["Python", "GPT-3", "Flask"],
  },
  {
    id: 4,
    name: "SmartPantry",
    description: "Inventory management system for home kitchens with recipe suggestions",
    similarity: 0.65,
    url: "https://devpost.com/software/smartpantry",
    technologies: ["React", "Firebase", "Computer Vision"],
  },
]

// Simulate AI analysis delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, description, technologies } = body

    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: "Description is required and must be at least 10 characters" }, { status: 400 })
    }

    // Simulate processing time
    await delay(2000)

    // Generate mock originality score based on description length and complexity
    const baseScore = Math.floor(Math.random() * 30) + 50 // 50-80 base
    const lengthBonus = Math.min(description.length / 50, 10) // Up to 10 points for length
    const techBonus = technologies ? Math.min(technologies.split(",").length * 2, 10) : 0 // Up to 10 points for tech diversity

    const overallScore = Math.min(Math.round(baseScore + lengthBonus + techBonus), 100)

    // Generate component scores
    const conceptScore = Math.min(overallScore + Math.floor(Math.random() * 10) - 5, 100)
    const implementationScore = Math.min(overallScore + Math.floor(Math.random() * 10) - 5, 100)
    const marketScore = Math.min(overallScore + Math.floor(Math.random() * 10) - 5, 100)
    const trendScore = Math.min(overallScore + Math.floor(Math.random() * 10) - 5, 100)

    // Generate insights based on score
    const insights = []
    if (conceptScore < 70) {
      insights.push("Consider adding a unique twist to differentiate from existing solutions")
    }
    if (implementationScore < 70) {
      insights.push("Explore emerging technologies or novel combinations to enhance implementation uniqueness")
    }
    if (marketScore < 70) {
      insights.push("This space has many existing solutions - focus on a specific niche or underserved audience")
    } else {
      insights.push("Your idea addresses a well-validated problem space with room for innovation")
    }
    if (trendScore > 75) {
      insights.push("Your project aligns well with current technology trends and emerging needs")
    }

    // Add general insights
    if (overallScore >= 80) {
      insights.push("Strong originality! Your idea shows significant differentiation from existing projects")
    } else if (overallScore >= 60) {
      insights.push("Good foundation with room for enhancement. Focus on unique implementation details")
    } else {
      insights.push("Consider pivoting to a more specific use case or combining multiple novel approaches")
    }

    const results = {
      projectName: projectName || "Your Project",
      description,
      technologies: technologies ? technologies.split(",").map((t: string) => t.trim()) : [],
      overallScore,
      scores: {
        concept: conceptScore,
        implementation: implementationScore,
        market: marketScore,
        trend: trendScore,
      },
      similarProjects: mockSimilarProjects.slice(0, 3),
      insights,
      analyzedAt: new Date().toISOString(),
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
