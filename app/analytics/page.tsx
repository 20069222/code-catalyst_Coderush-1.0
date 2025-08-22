"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"

interface AnalyticsData {
  moodTrends: Array<{ date: string; mood: number; energy: number }>
  moodDistribution: Array<{ mood: string; count: number; percentage: number }>
  activityData: Array<{ activity: string; sessions: number; totalMinutes: number }>
  weeklyProgress: Array<{ week: string; journalEntries: number; meditations: number; moodCheckins: number }>
  insights: Array<{ category: string; insight: string; confidence: number; trend: "positive" | "negative" | "neutral" }>
}

const COLORS = ["#164e63", "#10b981", "#059669", "#0891b2", "#0d9488"]

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [selectedMetric, setSelectedMetric] = useState<"mood" | "activity" | "progress">("mood")

  useEffect(() => {
    // Generate comprehensive analytics data
    const generateAnalyticsData = (): AnalyticsData => {
      const today = new Date()
      const daysBack = timeRange === "week" ? 7 : timeRange === "month" ? 30 : timeRange === "quarter" ? 90 : 365

      // Mood trends data
      const moodTrends = Array.from({ length: daysBack }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - (daysBack - i))
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mood: Math.max(1, Math.min(5, 3 + Math.sin(i * 0.1) * 1.2 + (Math.random() - 0.5) * 0.8)),
          energy: Math.max(1, Math.min(5, 3.2 + Math.cos(i * 0.15) * 1.1 + (Math.random() - 0.5) * 0.7)),
        }
      })

      // Mood distribution
      const moodCounts = { "Very Low": 5, Low: 12, Neutral: 25, Good: 35, Excellent: 23 }
      const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0)
      const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / total) * 100),
      }))

      // Activity data
      const activityData = [
        { activity: "Meditation", sessions: 24, totalMinutes: 360 },
        { activity: "Journaling", sessions: 18, totalMinutes: 540 },
        { activity: "Breathing Exercises", sessions: 32, totalMinutes: 160 },
        { activity: "CBT Techniques", sessions: 15, totalMinutes: 300 },
        { activity: "Mood Tracking", sessions: 45, totalMinutes: 90 },
      ]

      // Weekly progress
      const weeklyProgress = Array.from({ length: 8 }, (_, i) => {
        const weekStart = new Date(today)
        weekStart.setDate(weekStart.getDate() - (7 - i) * 7)
        return {
          week: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          journalEntries: Math.floor(Math.random() * 7) + 2,
          meditations: Math.floor(Math.random() * 10) + 3,
          moodCheckins: Math.floor(Math.random() * 7) + 4,
        }
      })

      // AI insights
      const insights = [
        {
          category: "Mood Patterns",
          insight:
            "Your mood tends to be highest on weekends and lowest on Mondays. Consider planning self-care activities for Monday mornings.",
          confidence: 87,
          trend: "neutral" as const,
        },
        {
          category: "Activity Correlation",
          insight:
            "Days when you meditate show 23% higher mood scores. Your meditation practice is having a positive impact.",
          confidence: 92,
          trend: "positive" as const,
        },
        {
          category: "Sleep & Mood",
          insight:
            "There's a strong correlation between your sleep quality and next-day mood. Prioritizing sleep hygiene could improve overall well-being.",
          confidence: 78,
          trend: "positive" as const,
        },
        {
          category: "Stress Triggers",
          insight:
            "Work-related stress appears most frequently in your journal entries. Consider implementing stress management techniques during work hours.",
          confidence: 84,
          trend: "negative" as const,
        },
        {
          category: "Progress Trend",
          insight:
            "Your overall mental health metrics have improved by 15% over the past month. Keep up the excellent work!",
          confidence: 95,
          trend: "positive" as const,
        },
      ]

      return { moodTrends, moodDistribution, activityData, weeklyProgress, insights }
    }

    setAnalyticsData(generateAnalyticsData())
  }, [timeRange])

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive":
        return "📈"
      case "negative":
        return "📉"
      default:
        return "📊"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of your mental health journey with AI-powered insights
          </p>
        </div>

        {/* Controls */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-card-foreground">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div className="flex space-x-2">
              {(["mood", "activity", "progress"] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    selectedMetric === metric
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Trends */}
            {selectedMetric === "mood" && (
              <>
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">Mood & Energy Trends</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.moodTrends}>
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
                        />
                        <Area
                          type="monotone"
                          dataKey="mood"
                          stackId="1"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="energy"
                          stackId="2"
                          stroke="hsl(var(--secondary))"
                          fill="hsl(var(--secondary))"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">Mood Distribution</h2>
                  <div className="flex flex-col lg:flex-row items-center">
                    <div className="h-64 w-full lg:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.moodDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ mood, percentage }) => `${mood}: ${percentage}%`}
                          >
                            {analyticsData.moodDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-2">
                      {analyticsData.moodDistribution.map((item, index) => (
                        <div key={item.mood} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm text-card-foreground">{item.mood}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.count} days ({item.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Activity Analysis */}
            {selectedMetric === "activity" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">Activity Analysis</h2>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="activity" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                      <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyticsData.activityData.map((activity) => (
                    <div key={activity.activity} className="bg-muted/30 rounded-lg p-4">
                      <h3 className="font-medium text-card-foreground mb-2">{activity.activity}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Sessions: {activity.sessions}</div>
                        <div>Total Time: {activity.totalMinutes} minutes</div>
                        <div>Avg per Session: {Math.round(activity.totalMinutes / activity.sessions)} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tracking */}
            {selectedMetric === "progress" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">Weekly Progress</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="journalEntries"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="meditations"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--secondary))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="moodCheckins"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--accent))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Average Mood</span>
                  <span className="font-semibold text-card-foreground">3.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Mood Stability</span>
                  <span className="font-semibold text-secondary">Good</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Active Days</span>
                  <span className="font-semibold text-card-foreground">28/30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Streak</span>
                  <span className="font-semibold text-accent">12 days</span>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">AI Insights</h3>
              <div className="space-y-4">
                {analyticsData.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.trend === "positive"
                        ? "bg-secondary/5 border-secondary/20"
                        : insight.trend === "negative"
                          ? "bg-destructive/5 border-destructive/20"
                          : "bg-accent/5 border-accent/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span>{getTrendIcon(insight.trend)}</span>
                        <h4 className="font-medium text-card-foreground text-sm">{insight.category}</h4>
                      </div>
                      <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                    </div>
                    <p className="text-sm text-card-foreground">{insight.insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recommendations</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-primary font-medium mb-1">Maintain Consistency</p>
                  <p className="text-card-foreground">Your regular meditation practice is showing positive results.</p>
                </div>
                <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <p className="text-secondary font-medium mb-1">Focus on Sleep</p>
                  <p className="text-card-foreground">Improving sleep quality could boost your mood scores.</p>
                </div>
                <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="text-accent font-medium mb-1">Stress Management</p>
                  <p className="text-card-foreground">Consider adding more CBT techniques to your routine.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
