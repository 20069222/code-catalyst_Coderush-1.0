"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"

interface JournalEntry {
  id: string
  date: string
  prompt: string
  content: string
  mood: string
  tags: string[]
  timestamp: Date
}

interface AIPrompt {
  id: string
  category: string
  prompt: string
  followUp: string[]
}

const journalPrompts: AIPrompt[] = [
  {
    id: "1",
    category: "Gratitude",
    prompt: "What are three things you're grateful for today, and why do they matter to you?",
    followUp: [
      "How can you express gratitude to someone who made a difference?",
      "What small moments of joy did you notice today?",
      "How has practicing gratitude changed your perspective?",
    ],
  },
  {
    id: "2",
    category: "Self-Reflection",
    prompt: "Describe a challenge you faced recently. What did you learn about yourself?",
    followUp: [
      "What strengths did you discover in yourself?",
      "How might you handle a similar situation differently?",
      "What support systems helped you through this challenge?",
    ],
  },
  {
    id: "3",
    category: "Mindfulness",
    prompt: "Take a moment to notice your current emotional state. What are you feeling right now?",
    followUp: [
      "Where do you feel these emotions in your body?",
      "What thoughts are accompanying these feelings?",
      "What would you say to comfort yourself right now?",
    ],
  },
  {
    id: "4",
    category: "Growth",
    prompt: "What's one area of your life where you'd like to grow? What small step could you take today?",
    followUp: [
      "What obstacles might you encounter, and how can you prepare?",
      "Who could support you in this growth journey?",
      "How will you celebrate small wins along the way?",
    ],
  },
  {
    id: "5",
    category: "Relationships",
    prompt: "Think about a meaningful relationship in your life. What makes it special?",
    followUp: [
      "How do you contribute to making this relationship positive?",
      "What would you like to communicate to this person?",
      "How can you nurture this relationship further?",
    ],
  },
]

const moodBasedPrompts = {
  anxious: [
    "What specific worries are on your mind right now? Let's explore them together.",
    "Describe a time when you overcame anxiety. What strategies helped you?",
    "What would you tell a friend who was feeling the same way you are now?",
  ],
  stressed: [
    "What are the main sources of stress in your life right now?",
    "When do you feel most at peace? Describe that feeling in detail.",
    "What boundaries could you set to protect your mental energy?",
  ],
  sad: [
    "What emotions are you experiencing right now? It's okay to feel them fully.",
    "Write about a memory that brings you comfort or joy.",
    "What acts of self-compassion can you practice today?",
  ],
  happy: [
    "What's contributing to your positive mood today? Capture this feeling.",
    "How can you share this positive energy with others?",
    "What are you most excited about in your life right now?",
  ],
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentPrompt, setCurrentPrompt] = useState<AIPrompt | null>(null)
  const [journalContent, setJournalContent] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [isWriting, setIsWriting] = useState(false)
  const [followUpPrompts, setFollowUpPrompts] = useState<string[]>([])
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    // Generate sample entries
    const sampleEntries: JournalEntry[] = [
      {
        id: "1",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        prompt: "What are three things you're grateful for today?",
        content: "I'm grateful for my morning coffee, the sunny weather, and a good conversation with a friend.",
        mood: "content",
        tags: ["gratitude", "friendship"],
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: "2",
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        prompt: "Describe a challenge you faced recently.",
        content: "I struggled with a work deadline, but I learned that asking for help early makes a big difference.",
        mood: "reflective",
        tags: ["work", "growth"],
        timestamp: new Date(Date.now() - 172800000),
      },
    ]
    setEntries(sampleEntries)
  }, [])

  useEffect(() => {
    setWordCount(
      journalContent
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
  }, [journalContent])

  const generateAIPrompt = (mood?: string) => {
    if (mood && moodBasedPrompts[mood as keyof typeof moodBasedPrompts]) {
      const moodPrompts = moodBasedPrompts[mood as keyof typeof moodBasedPrompts]
      const randomPrompt = moodPrompts[Math.floor(Math.random() * moodPrompts.length)]
      setCurrentPrompt({
        id: Date.now().toString(),
        category: "Mood-Based",
        prompt: randomPrompt,
        followUp: [],
      })
    } else {
      const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
      setCurrentPrompt(randomPrompt)
    }
    setIsWriting(true)
    setJournalContent("")
    setFollowUpPrompts([])
  }

  const saveEntry = () => {
    if (!currentPrompt || !journalContent.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      prompt: currentPrompt.prompt,
      content: journalContent,
      mood: selectedMood,
      tags: [currentPrompt.category.toLowerCase()],
      timestamp: new Date(),
    }

    setEntries((prev) => [newEntry, ...prev])

    // Generate follow-up prompts
    if (currentPrompt.followUp.length > 0) {
      setFollowUpPrompts(currentPrompt.followUp)
    }

    setIsWriting(false)
    setJournalContent("")
    setCurrentPrompt(null)
  }

  const startNewEntry = (prompt?: string) => {
    if (prompt) {
      setCurrentPrompt({
        id: Date.now().toString(),
        category: "Follow-up",
        prompt,
        followUp: [],
      })
    } else {
      generateAIPrompt()
    }
    setIsWriting(true)
    setJournalContent("")
    setFollowUpPrompts([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Digital Journal</h1>
          <p className="text-muted-foreground">Reflect, explore, and grow with AI-guided journaling prompts</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Writing Interface */}
          <div className="lg:col-span-2 space-y-6">
            {!isWriting ? (
              /* Prompt Selection */
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">Start Your Journal Entry</h2>

                <div className="space-y-4">
                  <button
                    onClick={() => generateAIPrompt()}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-left"
                  >
                    <div className="font-medium mb-1">Generate AI Prompt</div>
                    <div className="text-sm opacity-90">
                      Get a personalized writing prompt based on therapeutic techniques
                    </div>
                  </button>

                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(moodBasedPrompts).map(([mood, prompts]) => (
                      <button
                        key={mood}
                        onClick={() => generateAIPrompt(mood)}
                        className="p-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/20 transition-colors text-left"
                      >
                        <div className="font-medium capitalize">{mood} Reflection</div>
                        <div className="text-xs opacity-80">Mood-specific prompts</div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-medium text-card-foreground mb-3">Quick Prompts</h3>
                    <div className="grid gap-2">
                      {journalPrompts.slice(0, 3).map((prompt) => (
                        <button
                          key={prompt.id}
                          onClick={() => startNewEntry(prompt.prompt)}
                          className="p-3 bg-muted/50 text-card-foreground rounded-lg hover:bg-muted transition-colors text-left text-sm"
                        >
                          {prompt.prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Writing Interface */
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-card-foreground">Today's Reflection</h2>
                    <span className="text-sm text-muted-foreground">{wordCount} words</span>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                    <p className="text-accent font-medium">{currentPrompt?.prompt}</p>
                  </div>
                </div>

                <textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Start writing your thoughts here..."
                  className="w-full h-64 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedMood}
                      onChange={(e) => setSelectedMood(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select mood (optional)</option>
                      <option value="grateful">Grateful</option>
                      <option value="reflective">Reflective</option>
                      <option value="hopeful">Hopeful</option>
                      <option value="content">Content</option>
                      <option value="processing">Processing</option>
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsWriting(false)}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEntry}
                      disabled={!journalContent.trim()}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up Prompts */}
            {followUpPrompts.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Continue Exploring</h3>
                <div className="space-y-2">
                  {followUpPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => startNewEntry(prompt)}
                      className="w-full p-3 bg-secondary/5 text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors text-left text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Entries */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Entries</h3>
              <div className="space-y-4">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                      {entry.mood && (
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">{entry.mood}</span>
                      )}
                    </div>
                    <p className="text-sm text-accent font-medium mb-2">{entry.prompt}</p>
                    <p className="text-card-foreground text-sm line-clamp-3">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Writing Stats */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Total Entries</span>
                  <span className="font-semibold text-card-foreground">{entries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">This Week</span>
                  <span className="font-semibold text-card-foreground">
                    {
                      entries.filter((entry) => {
                        const entryDate = new Date(entry.date)
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        return entryDate >= weekAgo
                      }).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Current Streak</span>
                  <span className="font-semibold text-secondary">3 days</span>
                </div>
              </div>
            </div>

            {/* Mindfulness Tips */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Mindfulness Tips</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Write without judgment - let your thoughts flow naturally</p>
                <p>• Focus on feelings and sensations, not just events</p>
                <p>• Be honest with yourself - this is your safe space</p>
                <p>• Notice patterns in your thoughts and emotions</p>
                <p>• Celebrate small insights and moments of clarity</p>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Explore Topics</h3>
              <div className="space-y-2">
                {journalPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => startNewEntry(prompt.prompt)}
                    className="w-full text-left p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    {prompt.category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
