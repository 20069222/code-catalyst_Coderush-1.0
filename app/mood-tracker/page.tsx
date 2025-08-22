"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface MoodEntry {
  id: string
  date: string
  mood: number
  moodLabel: string
  notes: string
  timestamp: Date
}

interface MoodPattern {
  pattern: string
  suggestion: string
  confidence: number
}

const moodOptions = [
  { value: 1, label: "Very Low", color: "#dc2626", emoji: "😢" },
  { value: 2, label: "Low", color: "#ea580c", emoji: "😔" },
  { value: 3, label: "Neutral", color: "#ca8a04", emoji: "😐" },
  { value: 4, label: "Good", color: "#16a34a", emoji: "🙂" },
  { value: 5, label: "Excellent", color: "#059669", emoji: "😊" },
]

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodNotes, setMoodNotes] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [aiInsights, setAiInsights] = useState<MoodPattern[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "month" | "year">("week")

  // Generate sample mood data for demonstration
  useEffect(() => {
    const generateSampleData = () => {
      const entries: MoodEntry[] = []
      const today = new Date()

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Generate realistic mood patterns
        let moodValue = 3 + Math.sin(i * 0.2) * 1.5 + (Math.random() - 0.5) * 0.8
        moodValue = Math.max(1, Math.min(5, Math.round(moodValue)))

        const moodOption = moodOptions.find((option) => option.value === moodValue)!

        entries.push({
          id: `entry-${i}`,
          date: date.toISOString().split("T")[0],
          mood: moodValue,
          moodLabel: moodOption.label,
          notes: i % 3 === 0 ? "Had a good day with friends" : "",
          timestamp: date,
        })
      }

      setMoodEntries(entries)
    }

    generateSampleData()
  }, [])

  // Generate AI insights based on mood patterns
  useEffect(() => {
    if (moodEntries.length > 7) {
      const recentMoods = moodEntries.slice(-7).map((entry) => entry.mood)
      const average = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length
      const trend = recentMoods[recentMoods.length - 1] - recentMoods[0]

      const insights: MoodPattern[] = []

      if (average < 2.5) {
        insights.push({
          pattern: "Consistently Low Mood",
          suggestion: "Consider reaching out to a mental health professional for additional support.",
          confidence: 85,
        })
      } else if (average > 4) {
        insights.push({
          pattern: "Positive Mood Trend",
          suggestion: "Great job maintaining positive mental health! Keep up your current routines.",
          confidence: 90,
        })
      }

      if (trend > 1) {
        insights.push({
          pattern: "Improving Trend",
          suggestion: "Your mood has been improving recently. Reflect on what positive changes you've made.",
          confidence: 78,
        })
      } else if (trend < -1) {
        insights.push({
          pattern: "Declining Trend",
          suggestion: "Your mood has been declining. Consider practicing self-care or talking to someone.",
          confidence: 82,
        })
      }

      // Check for weekly patterns
      const weekdayMoods = moodEntries.slice(-14).reduce(
        (acc, entry) => {
          const day = entry.timestamp.getDay()
          acc[day].push(entry.mood)
          return acc
        },
        Array.from({ length: 7 }, () => [] as number[]),
      )

      const weekdayAverages = weekdayMoods.map((moods) =>
        moods.length > 0 ? moods.reduce((sum, mood) => sum + mood, 0) / moods.length : 0,
      )

      const lowestDay = weekdayAverages.indexOf(Math.min(...weekdayAverages.filter((avg) => avg > 0)))
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      if (weekdayAverages[lowestDay] < average - 0.5) {
        insights.push({
          pattern: `${dayNames[lowestDay]} Pattern`,
          suggestion: `You tend to feel lower on ${dayNames[lowestDay]}s. Plan something positive for these days.`,
          confidence: 72,
        })
      }

      setAiInsights(insights)
    }
  }, [moodEntries])

  const logMood = () => {
    if (selectedMood === null) return

    setIsLoading(true)

    const moodOption = moodOptions.find((option) => option.value === selectedMood)!
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      moodLabel: moodOption.label,
      notes: moodNotes,
      timestamp: new Date(),
    }

    setTimeout(() => {
      setMoodEntries((prev) => {
        const filtered = prev.filter((entry) => entry.date !== newEntry.date)
        return [...filtered, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      })

      setSelectedMood(null)
      setMoodNotes("")
      setIsLoading(false)
    }, 500)
  }

  const getChartData = () => {
    const now = new Date()
    let days = 7

    if (viewMode === "month") days = 30
    if (viewMode === "year") days = 365

    return moodEntries
      .slice(-days)
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mood: entry.mood,
        label: entry.moodLabel,
      }))
      .slice(-20) // Show max 20 points for readability
  }

  const getMoodStats = () => {
    if (moodEntries.length === 0) return { average: 0, highest: 0, lowest: 0, streak: 0 }

    const recentEntries = moodEntries.slice(-30)
    const moods = recentEntries.map((entry) => entry.mood)

    const average = moods.reduce((sum, mood) => sum + mood, 0) / moods.length
    const highest = Math.max(...moods)
    const lowest = Math.min(...moods)

    // Calculate positive streak (mood >= 4)
    let streak = 0
    for (let i = moodEntries.length - 1; i >= 0; i--) {
      if (moodEntries[i].mood >= 4) {
        streak++
      } else {
        break
      }
    }

    return { average, highest, lowest, streak }
  }

  const stats = getMoodStats()
  const chartData = getChartData()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mood Tracker</h1>
          <p className="text-muted-foreground">Track your daily mood and discover patterns over time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mood Logging */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Mood */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">How are you feeling today?</h2>

              <div className="space-y-3 mb-4">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedMood(option.value)}
                    className={`w-full p-3 rounded-lg border transition-colors text-left flex items-center space-x-3 ${
                      selectedMood === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-border/80 text-card-foreground"
                    }`}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-70">Level {option.value}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-card-foreground mb-2">Notes (optional)</label>
                <textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="What's affecting your mood today?"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={logMood}
                disabled={selectedMood === null || isLoading}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Logging..." : "Log Mood"}
              </button>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">30-day Average</span>
                  <span className="font-semibold text-card-foreground">{stats.average.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Highest This Month</span>
                  <span className="font-semibold text-card-foreground">{stats.highest}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Lowest This Month</span>
                  <span className="font-semibold text-card-foreground">{stats.lowest}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Positive Streak</span>
                  <span className="font-semibold text-secondary">{stats.streak} days</span>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">AI Insights</h3>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-accent">{insight.pattern}</h4>
                        <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                      <p className="text-sm text-card-foreground">{insight.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Controls */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-card-foreground">Mood Trends</h2>
                <div className="flex space-x-2">
                  {(["week", "month", "year"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === mode
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Chart */}
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[1, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))",
                      }}
                      formatter={(value: any, name: any) => [
                        `${value}/5 (${chartData.find((d) => d.mood === value)?.label})`,
                        "Mood",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[1, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))",
                      }}
                      formatter={(value: any, name: any) => [
                        `${value}/5 (${chartData.find((d) => d.mood === value)?.label})`,
                        "Mood",
                      ]}
                    />
                    <Bar dataKey="mood" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Entries</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {moodEntries
                  .slice(-10)
                  .reverse()
                  .map((entry) => {
                    const moodOption = moodOptions.find((option) => option.value === entry.mood)!
                    return (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{moodOption.emoji}</span>
                          <div>
                            <div className="font-medium text-card-foreground">{entry.moodLabel}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {entry.notes && (
                          <div className="text-sm text-muted-foreground max-w-xs truncate">{entry.notes}</div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
