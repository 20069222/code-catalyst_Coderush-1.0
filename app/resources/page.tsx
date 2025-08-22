"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: "article" | "video" | "tool" | "guide" | "research"
  author: string
  readTime: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  url: string
  thumbnail?: string
  isBookmarked: boolean
  rating: number
  publishedDate: Date
}

interface ResourceCategory {
  id: string
  name: string
  description: string
  icon: string
  count: number
}

const categories: ResourceCategory[] = [
  {
    id: "anxiety",
    name: "Anxiety Management",
    description: "Techniques and strategies for managing anxiety and panic",
    icon: "🧘",
    count: 24,
  },
  {
    id: "depression",
    name: "Depression Support",
    description: "Resources for understanding and coping with depression",
    icon: "🌱",
    count: 18,
  },
  {
    id: "stress",
    name: "Stress Relief",
    description: "Methods for reducing and managing daily stress",
    icon: "💆",
    count: 32,
  },
  {
    id: "mindfulness",
    name: "Mindfulness & Meditation",
    description: "Practices for present-moment awareness and inner peace",
    icon: "🧠",
    count: 28,
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Building healthy connections and communication skills",
    icon: "💝",
    count: 15,
  },
  {
    id: "sleep",
    name: "Sleep & Rest",
    description: "Improving sleep quality and establishing healthy routines",
    icon: "😴",
    count: 12,
  },
  {
    id: "workplace",
    name: "Workplace Wellness",
    description: "Managing work-related stress and maintaining balance",
    icon: "💼",
    count: 20,
  },
  {
    id: "self-care",
    name: "Self-Care",
    description: "Practices for nurturing your physical and emotional well-being",
    icon: "🌸",
    count: 25,
  },
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)

  useEffect(() => {
    // Generate sample resources
    const generateResources = (): Resource[] => {
      return [
        {
          id: "1",
          title: "Understanding Anxiety: A Comprehensive Guide",
          description:
            "Learn about the different types of anxiety disorders, their symptoms, and evidence-based treatment approaches.",
          category: "anxiety",
          type: "guide",
          author: "Dr. Sarah Mitchell",
          readTime: 15,
          difficulty: "Beginner",
          tags: ["anxiety", "mental health", "treatment"],
          url: "#",
          isBookmarked: true,
          rating: 4.8,
          publishedDate: new Date("2024-01-15"),
        },
        {
          id: "2",
          title: "5-Minute Breathing Exercise for Stress Relief",
          description:
            "A quick and effective breathing technique you can use anywhere to reduce stress and anxiety in moments.",
          category: "stress",
          type: "video",
          author: "Mindfulness Center",
          readTime: 5,
          difficulty: "Beginner",
          tags: ["breathing", "stress relief", "quick techniques"],
          url: "#",
          isBookmarked: false,
          rating: 4.9,
          publishedDate: new Date("2024-01-20"),
        },
        {
          id: "3",
          title: "Cognitive Behavioral Therapy Techniques for Depression",
          description:
            "Explore practical CBT strategies that can help identify and change negative thought patterns associated with depression.",
          category: "depression",
          type: "article",
          author: "Dr. Michael Chen",
          readTime: 20,
          difficulty: "Intermediate",
          tags: ["CBT", "depression", "therapy techniques"],
          url: "#",
          isBookmarked: true,
          rating: 4.7,
          publishedDate: new Date("2024-01-10"),
        },
        {
          id: "4",
          title: "Sleep Hygiene Checklist",
          description:
            "A comprehensive checklist to improve your sleep quality and establish healthy bedtime routines.",
          category: "sleep",
          type: "tool",
          author: "Sleep Foundation",
          readTime: 10,
          difficulty: "Beginner",
          tags: ["sleep", "hygiene", "routine"],
          url: "#",
          isBookmarked: false,
          rating: 4.6,
          publishedDate: new Date("2024-01-25"),
        },
        {
          id: "5",
          title: "Mindful Communication in Relationships",
          description:
            "Learn how to apply mindfulness principles to improve communication and deepen connections with others.",
          category: "relationships",
          type: "article",
          author: "Dr. Lisa Rodriguez",
          readTime: 18,
          difficulty: "Intermediate",
          tags: ["mindfulness", "communication", "relationships"],
          url: "#",
          isBookmarked: false,
          rating: 4.5,
          publishedDate: new Date("2024-01-12"),
        },
        {
          id: "6",
          title: "Workplace Stress Management Strategies",
          description:
            "Practical techniques for managing stress in professional environments and maintaining work-life balance.",
          category: "workplace",
          type: "guide",
          author: "Corporate Wellness Institute",
          readTime: 25,
          difficulty: "Intermediate",
          tags: ["workplace", "stress management", "work-life balance"],
          url: "#",
          isBookmarked: true,
          rating: 4.4,
          publishedDate: new Date("2024-01-08"),
        },
        {
          id: "7",
          title: "Daily Self-Care Routine Builder",
          description:
            "An interactive tool to help you create a personalized self-care routine that fits your lifestyle and needs.",
          category: "self-care",
          type: "tool",
          author: "Wellness Toolkit",
          readTime: 12,
          difficulty: "Beginner",
          tags: ["self-care", "routine", "personalization"],
          url: "#",
          isBookmarked: false,
          rating: 4.7,
          publishedDate: new Date("2024-01-30"),
        },
        {
          id: "8",
          title: "The Science of Mindfulness: Latest Research",
          description:
            "Explore recent scientific findings on how mindfulness practices affect the brain and overall mental health.",
          category: "mindfulness",
          type: "research",
          author: "Journal of Mindfulness Studies",
          readTime: 30,
          difficulty: "Advanced",
          tags: ["mindfulness", "research", "neuroscience"],
          url: "#",
          isBookmarked: false,
          rating: 4.8,
          publishedDate: new Date("2024-01-05"),
        },
      ]
    }

    setTimeout(() => {
      setResources(generateResources())
      setIsLoading(false)
    }, 500)
  }, [])

  const toggleBookmark = (id: string) => {
    setResources((prev) =>
      prev.map((resource) => (resource.id === id ? { ...resource, isBookmarked: !resource.isBookmarked } : resource)),
    )
  }

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesBookmark = !bookmarkedOnly || resource.isBookmarked

    return matchesCategory && matchesType && matchesSearch && matchesBookmark
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return "📄"
      case "video":
        return "🎥"
      case "tool":
        return "🛠️"
      case "guide":
        return "📖"
      case "research":
        return "🔬"
      default:
        return "📚"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-secondary bg-secondary/10 border-secondary/20"
      case "Intermediate":
        return "text-accent bg-accent/10 border-accent/20"
      case "Advanced":
        return "text-destructive bg-destructive/10 border-destructive/20"
      default:
        return "text-muted-foreground bg-muted/30 border-border"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading resources...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Resources</h1>
          <p className="text-muted-foreground">
            Curated articles, tools, and guides to support your mental health journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="tool">Tools</option>
                <option value="guide">Guides</option>
                <option value="research">Research</option>
              </select>
              <button
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  bookmarkedOnly
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Bookmarked
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span>All Resources</span>
                  <span className="text-sm">{resources.length}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-sm">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recommended for You</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-primary font-medium mb-1">Based on your mood patterns</p>
                  <p className="text-card-foreground">Stress management resources might be helpful</p>
                </div>
                <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <p className="text-secondary font-medium mb-1">Popular this week</p>
                  <p className="text-card-foreground">Sleep hygiene guides are trending</p>
                </div>
                <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="text-accent font-medium mb-1">Continue learning</p>
                  <p className="text-card-foreground">More CBT techniques available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="lg:col-span-3">
            {filteredResources.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse different categories.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-card rounded-lg border border-border p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getTypeIcon(resource.type)}</span>
                        <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className={`text-xl transition-colors ${
                          resource.isBookmarked ? "text-accent" : "text-muted-foreground hover:text-accent"
                        }`}
                      >
                        {resource.isBookmarked ? "🔖" : "📑"}
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{resource.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">by {resource.author}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{resource.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-muted-foreground">⭐</span>
                        <span className="text-sm text-muted-foreground">{resource.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(resource.difficulty)}`}
                        >
                          {resource.difficulty}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        {resource.type === "video" ? "Watch" : resource.type === "tool" ? "Use Tool" : "Read"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
