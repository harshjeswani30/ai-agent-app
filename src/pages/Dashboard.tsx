import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Calendar, GraduationCap, Star, TrendingUp } from "lucide-react";
import ExplainTab from "@/components/tabs/ExplainTab";
import FlashcardsTab from "@/components/tabs/FlashcardsTab";
import QuizTab from "@/components/tabs/QuizTab";
import ScheduleTab from "@/components/tabs/ScheduleTab";
import SavedTab from "@/components/tabs/SavedTab";

export default function Dashboard() {
  const stats = useQuery(api.studySessions.getStats);
  const quizAverage = useQuery(api.quizzes.getAverageScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                <GraduationCap className="h-10 w-10 text-primary" />
                Study Buddy AI
              </h1>
              <p className="text-muted-foreground mt-2">
                Your intelligent study companion powered by AI
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSessions ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Total sessions completed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((stats?.totalMinutes ?? 0) / 60)}h
                  </div>
                  <p className="text-xs text-muted-foreground">Hours of focused study</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
                  <Star className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quizAverage ?? 0}%</div>
                  <p className="text-xs text-muted-foreground">Average quiz score</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <Tabs defaultValue="explain" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="explain" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="hidden sm:inline">Explain</span>
                    </TabsTrigger>
                    <TabsTrigger value="flashcards" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Flashcards</span>
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">Quiz</span>
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Schedule</span>
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span className="hidden sm:inline">Saved</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="explain">
                    <ExplainTab />
                  </TabsContent>

                  <TabsContent value="flashcards">
                    <FlashcardsTab />
                  </TabsContent>

                  <TabsContent value="quiz">
                    <QuizTab />
                  </TabsContent>

                  <TabsContent value="schedule">
                    <ScheduleTab />
                  </TabsContent>

                  <TabsContent value="saved">
                    <SavedTab />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
