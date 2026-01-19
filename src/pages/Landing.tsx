import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  BookOpen,
  Brain,
  Calendar,
  Zap,
  ArrowRight,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Users,
  Star,
  Target,
  Clock,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Explanations",
      description: "Get crystal-clear explanations tailored to your learning level with real-world examples.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Smart Flashcards",
      description: "Auto-generated flashcards that adapt to your progress and focus on weak areas.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: BookOpen,
      title: "Interactive Quizzes",
      description: "Take adaptive quizzes with instant feedback and detailed answer explanations.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-optimized study schedules that fit your goals, pace, and availability.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set learning goals and track your progress with detailed analytics.",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Performance Insights",
      description: "Get insights into your learning patterns and areas for improvement.",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Active Learners" },
    { icon: Clock, value: "1M+", label: "Study Hours" },
    { icon: Star, value: "4.9/5", label: "User Rating" },
    { icon: TrendingUp, value: "85%", label: "Success Rate" },
  ];

  const benefits = [
    "Personalized learning paths",
    "24/7 AI tutor availability",
    "Multi-subject support",
    "Progress tracking & analytics",
    "Mobile-friendly interface",
    "No credit card required",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                StudyBuddy AI
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/auth">
                <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-primary/10 border border-primary/20 rounded-full"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Powered by Advanced AI</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                  Study Smarter,
                </span>
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                  Not Harder
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                Transform your learning experience with AI-powered tutoring, personalized study plans,
                and intelligent assessments that adapt to your needs.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 h-14 gap-2 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 gap-2 w-full sm:w-auto">
                    Continue as Guest
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>10K+ students trust us</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Powerful Features for
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Accelerated Learning
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master any subject, all in one intelligent platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Students Love Us
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of students achieving their academic goals
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              <CardContent className="relative p-12 md:p-16 text-center space-y-8">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Ready to Excel?
                </h2>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start your free trial today and experience the future of personalized learning.
                  No credit card required.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/auth">
                    <Button size="lg" className="text-lg px-8 h-14 gap-2 shadow-lg">
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                      Try as Guest
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground pt-4">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="ml-2">Rated 4.9/5 by over 10,000 students</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold text-lg">StudyBuddy AI</div>
                <div className="text-sm text-muted-foreground">Smart learning, powered by AI</div>
              </div>
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="text-sm text-muted-foreground">
                Built with Pydantic AI & Convex
              </p>
              <p className="text-sm text-muted-foreground">
                © 2026 StudyBuddy AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
