"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"

interface Notification {
  id: string
  type: "reminder" | "achievement" | "insight" | "system" | "recommendation"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
  actionText?: string
}

const notificationTypes = {
  reminder: { icon: "🔔", color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/20" },
  achievement: { icon: "🏆", color: "text-secondary", bgColor: "bg-secondary/10", borderColor: "border-secondary/20" },
  insight: { icon: "💡", color: "text-accent", bgColor: "bg-accent/10", borderColor: "border-accent/20" },
  system: { icon: "⚙️", color: "text-muted-foreground", bgColor: "bg-muted/30", borderColor: "border-border" },
  recommendation: {
    icon: "📚",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/20",
  },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "reminders" | "insights">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate sample notifications
    const generateNotifications = (): Notification[] => {
      const now = new Date()
      return [
        {
          id: "1",
          type: "reminder",
          title: "Time for your evening mood check-in",
          message: "It's 7:00 PM - a great time to reflect on how your day went and log your current mood.",
          timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          isRead: false,
          priority: "medium",
          actionUrl: "/mood-tracker",
          actionText: "Log Mood",
        },
        {
          id: "2",
          type: "achievement",
          title: "7-day meditation streak!",
          message:
            "Congratulations! You've completed meditation sessions for 7 days in a row. Your consistency is paying off.",
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: false,
          priority: "high",
          actionUrl: "/meditation",
          actionText: "Continue Streak",
        },
        {
          id: "3",
          type: "insight",
          title: "Weekly mood pattern detected",
          message:
            "Your mood tends to be lowest on Monday mornings. Consider scheduling a self-care activity to start your week positively.",
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
          isRead: true,
          priority: "medium",
          actionUrl: "/analytics",
          actionText: "View Analytics",
        },
        {
          id: "4",
          type: "recommendation",
          title: "New article: Managing Work Stress",
          message:
            "Based on your recent journal entries, we've curated an article about effective stress management techniques.",
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
          isRead: false,
          priority: "low",
          actionUrl: "/resources",
          actionText: "Read Article",
        },
        {
          id: "5",
          type: "reminder",
          title: "Journal prompt available",
          message: "A new AI-generated journal prompt is ready for you: 'What brought you peace today?'",
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
          isRead: true,
          priority: "low",
          actionUrl: "/journal",
          actionText: "Start Writing",
        },
        {
          id: "6",
          type: "system",
          title: "Privacy settings updated",
          message: "Your privacy preferences have been successfully updated. Your data remains secure and private.",
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: true,
          priority: "low",
        },
        {
          id: "7",
          type: "insight",
          title: "Meditation impact analysis",
          message:
            "Your mood scores are 23% higher on days when you meditate. Keep up the excellent self-care routine!",
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isRead: false,
          priority: "medium",
          actionUrl: "/analytics",
          actionText: "View Details",
        },
        {
          id: "8",
          type: "achievement",
          title: "First month milestone",
          message: "You've been using MedMind Pro for a full month! Your dedication to mental health is inspiring.",
          timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isRead: true,
          priority: "high",
        },
      ]
    }

    setTimeout(() => {
      setNotifications(generateNotifications())
      setIsLoading(false)
    }, 500)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return !notif.isRead
      case "reminders":
        return notif.type === "reminder"
      case "insights":
        return notif.type === "insight" || notif.type === "achievement"
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading notifications...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with reminders, insights, and achievements</p>
        </div>

        {/* Controls */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {(["all", "unread", "reminders", "insights"] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      filter === filterType
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {filterType}
                    {filterType === "unread" && unreadCount > 0 && (
                      <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-primary hover:text-primary/80 font-medium text-sm">
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === "all"
                  ? "You're all caught up! New notifications will appear here."
                  : `No ${filter} notifications at the moment.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const typeConfig = notificationTypes[notification.type]
              return (
                <div
                  key={notification.id}
                  className={`bg-card rounded-lg border p-6 transition-all hover:shadow-sm ${
                    notification.isRead ? "opacity-75" : typeConfig.borderColor
                  } ${!notification.isRead ? typeConfig.bgColor : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-2xl">{typeConfig.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`font-semibold text-card-foreground ${
                              !notification.isRead ? "text-foreground" : ""
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                          {notification.priority === "high" && (
                            <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
                              High Priority
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(notification.timestamp)}</span>
                          <div className="flex items-center space-x-3">
                            {notification.actionUrl && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className={`text-sm font-medium hover:underline ${typeConfig.color}`}
                              >
                                {notification.actionText}
                              </button>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-muted-foreground hover:text-destructive"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Notification Settings Link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm mb-2">Want to customize your notifications?</p>
          <button className="text-primary hover:text-primary/80 font-medium text-sm">
            Go to Notification Settings
          </button>
        </div>
      </div>
    </div>
  )
}
