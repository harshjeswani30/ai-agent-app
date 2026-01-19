import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  BookOpen,
  Brain,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  MessageSquare,
  Zap,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const progress = useQuery(api.progress.getOverallProgress);
  const recentActivity = useQuery(api.progress.getRecentActivity);
  const quizStats = useQuery(api.quizzes.getQuizStats, {});

  if (!isAuthenticated) {
    window.location.href = "/auth";
    return null;
  }

  const subjects = [
    { id: "mathematics", name: "Mathematics", icon: "📐", color: "from-blue-500 to-cyan-500" },
    { id: "science", name: "Science", icon: "🔬", color: "from-green-500 to-emerald-500" },
    { id: "programming", name: "Programming", icon: "💻", color: "from-purple-500 to-pink-500" },
    { id: "languages", name: "Languages", icon: "🌍", color: "from-orange-500 to-red-500" },
    { id: "history", name: "History", icon: "📚", color: "from-yellow-500 to-amber-500" },
    { id: "literature", name: "Literature", icon: "📖", color: "from-indigo-500 to-blue-500" },
  ];

  const stats = [
    {
      label: "Study Time",
      value: progress ? `${Math.floor(progress.totalStudyTime / 60)}h` : "0h",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Quizzes Taken",
      value: quizStats?.totalQuizzes || 0,
      icon: Trophy,
      color: "text-green-500",
    },
    {
      label: "Avg Score",
      value: quizStats ? `${quizStats.averageScore}%` : "0%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      label: "Current Streak",
      value: progress ? `${progress.currentStreak}d` : "0d",
      icon: Zap,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StudyBuddy AI</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/chat">
                <Button variant="ghost">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Tutor
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-lg text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Subjects & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subjects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Your Subjects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link to={`/chat?subject=${subject.id}`}>
                      <Card className="p-6 cursor-pointer hover:border-primary transition-colors">
                        <div className="mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl`}>
                            {subject.icon}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Start studying
                        </p>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/chat">
                  <Card className="p-6 cursor-pointer hover:border-primary transition-colors">
                    <Brain className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Ask AI Tutor</h3>
                    <p className="text-sm text-muted-foreground">
                      Get instant explanations for any topic
                    </p>
                  </Card>
                </Link>

                <Link to="/quiz">
                  <Card className="p-6 cursor-pointer hover:border-primary transition-colors">
                    <BookOpen className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Take a Quiz</h3>
                    <p className="text-sm text-muted-foreground">
                      Test your knowledge with AI-generated questions
                    </p>
                  </Card>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Card className="p-6">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 8).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      {activity.type === "session" ? (
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Trophy className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.subject} - {activity.topic}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.type === "session"
                            ? `Studied for ${activity.duration} min`
                            : `Quiz score: ${activity.score}%`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No activity yet
                  </p>
                  <Link to="/chat">
                    <Button>Start Learning</Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
