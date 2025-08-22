"use client"

import { useState, useEffect, useRef } from "react"
import Navigation from "@/components/navigation"

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface UserStats {
  sessionsThisWeek: number
  moodCheckins: number
  journalEntries: number
  meditationMinutes: number
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI mental health companion. How are you feeling today?",
      timestamp: new Date(),
      suggestions: ["I'm feeling anxious", "I'm doing well", "I'm stressed about work", "I need support"],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    sessionsThisWeek: 5,
    moodCheckins: 12,
    journalEntries: 8,
    meditationMinutes: 45,
  })
  const [currentMood, setCurrentMood] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const aiResponses = [
    "I understand how you're feeling. That sounds challenging to deal with.",
    "Thank you for sharing that with me. What do you think might help you feel better?",
    "It's completely normal to feel that way. You're not alone in this.",
    "Have you tried any coping strategies that have worked for you before?",
    "What's one small thing that brought you joy recently?",
    "That's a lot to process. Take your time, and remember to be kind to yourself.",
    "It sounds like you're being really hard on yourself. What would you tell a friend in your situation?",
    "I hear the strength in your words, even when you're struggling.",
    "Would you like to explore some breathing exercises or mindfulness techniques?",
    "How has your sleep been lately? Sometimes that can affect how we feel.",
  ]

  const moodBasedSuggestions = {
    anxious: [
      "Try a breathing exercise",
      "Practice grounding techniques",
      "Journal your thoughts",
      "Take a short walk",
    ],
    stressed: ["Take a break", "Do a quick meditation", "Talk to someone", "Practice progressive muscle relaxation"],
    sad: ["Reach out to a friend", "Do something creative", "Listen to music", "Practice self-compassion"],
    angry: ["Take deep breaths", "Go for a walk", "Write it out", "Practice counting to 10"],
    default: [
      "Check in with your mood",
      "Try a mindfulness exercise",
      "Write in your journal",
      "Take a moment to breathe",
    ],
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI processing time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          timestamp: new Date(),
          suggestions: getSuggestionsBasedOnMessage(inputMessage),
        }

        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)

        // Update stats
        setUserStats((prev) => ({
          ...prev,
          sessionsThisWeek: prev.sessionsThisWeek + 1,
        }))
      },
      Math.random() * 2000 + 1000,
    )
  }

  const getSuggestionsBasedOnMessage = (message: string): string[] => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      return moodBasedSuggestions.anxious
    } else if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelmed")) {
      return moodBasedSuggestions.stressed
    } else if (lowerMessage.includes("sad") || lowerMessage.includes("depressed")) {
      return moodBasedSuggestions.sad
    } else if (lowerMessage.includes("angry") || lowerMessage.includes("frustrated")) {
      return moodBasedSuggestions.angry
    }
    return moodBasedSuggestions.default
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const quickMoodCheck = (mood: string) => {
    setCurrentMood(mood)
    const moodMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content: `Mood logged: ${mood}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, moodMessage])
    setUserStats((prev) => ({
      ...prev,
      moodCheckins: prev.moodCheckins + 1,
    }))

    // AI response to mood
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Thank you for checking in. I see you're feeling ${mood}. ${
          mood === "great" || mood === "good"
            ? "That's wonderful to hear! What's contributing to your positive mood today?"
            : "I'm here to support you. Would you like to talk about what's affecting your mood?"
        }`,
        timestamp: new Date(),
        suggestions: getSuggestionsBasedOnMessage(mood),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Card */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-2">Welcome back!</h2>
              <p className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Quick Mood Check */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Mood Check</h3>
              <div className="grid grid-cols-2 gap-2">
                {["great", "good", "okay", "struggling"].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => quickMoodCheck(mood)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      currentMood === mood
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Sessions</span>
                  <span className="font-semibold text-card-foreground">{userStats.sessionsThisWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Mood Check-ins</span>
                  <span className="font-semibold text-card-foreground">{userStats.moodCheckins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Journal Entries</span>
                  <span className="font-semibold text-card-foreground">{userStats.journalEntries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Meditation (min)</span>
                  <span className="font-semibold text-card-foreground">{userStats.meditationMinutes}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                  📊 View Mood Trends
                </button>
                <button className="w-full text-left p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                  📝 Start Journaling
                </button>
                <button className="w-full text-left p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                  🧘 Begin Meditation
                </button>
                <button className="w-full text-left p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                  📚 Browse Resources
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-border">
                <h1 className="text-xl font-semibold text-card-foreground">AI Mental Health Companion</h1>
                <p className="text-muted-foreground text-sm">Professional therapeutic support powered by AI</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : message.type === "system"
                            ? "justify-center"
                            : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.type === "system"
                              ? "bg-secondary/10 text-secondary border border-secondary/20"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    {message.type === "ai" && message.suggestions && (
                      <div className="flex flex-wrap gap-2 ml-4">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full hover:bg-accent/20 transition-colors border border-accent/20"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-border">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This AI companion provides supportive guidance but is not a replacement for professional medical
                  advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
