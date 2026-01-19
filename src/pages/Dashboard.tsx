import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Calendar, GraduationCap, Star, TrendingUp, User, LogOut, Sparkles, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileDialog } from "@/components/ProfileDialog";
import ExplainTab from "@/components/tabs/ExplainTab";
import FlashcardsTab from "@/components/tabs/FlashcardsTab";
import QuizTab from "@/components/tabs/QuizTab";
import ScheduleTab from "@/components/tabs/ScheduleTab";
import SavedTab from "@/components/tabs/SavedTab";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const stats = useQuery(api.studySessions.getStats);
  const quizAverage = useQuery(api.quizzes.getAverageScore);
  const currentUser = useQuery(api.users.currentUser);
  const { signOut, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">StudyBuddy AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Your AI study companion
                </p>
              </div>
            </motion.div>

            {/* User Account Dropdown */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                        {currentUser?.name ? (
                          <span className="text-sm font-semibold">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                        ) : currentUser?.email ? (
                          <span className="text-sm font-semibold">
                            {currentUser.email.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2 p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          {currentUser?.name ? (
                            <span className="text-lg font-bold text-primary">
                              {(currentUser.name || "U").charAt(0).toUpperCase()}
                            </span>
                          ) : currentUser?.email ? (
                            <span className="text-lg font-bold text-primary">
                              {currentUser.email.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-none mb-1">
                            {currentUser?.name || "Account"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {currentUser?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back{currentUser?.name ? ", " + currentUser.name : (currentUser?.email ? ", " + currentUser.email.split("@")[0] : "")}! 👋
              </h2>
              <p className="text-muted-foreground text-lg">
                Ready to continue your learning journey?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Study Sessions
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-bold">{stats?.totalSessions ?? 0}</h3>
                      <span className="text-sm text-muted-foreground">completed</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Study Time
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-bold">
                        {Math.round((stats?.totalMinutes ?? 0) / 60)}
                      </h3>
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Quiz Average
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-bold">{quizAverage ?? 0}</h3>
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
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
          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI Learning Tools</CardTitle>
                  <CardDescription>
                    Choose a tool to start your personalized learning session
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="explain" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
                  <TabsTrigger
                    value="explain"
                    className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 sm:w-6 sm:h-6">
                      <Brain className="h-4 w-4 text-white sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Explain</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="flashcards"
                    className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 sm:w-6 sm:h-6">
                      <BookOpen className="h-4 w-4 text-white sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Flashcards</span>
                    <span className="text-xs font-medium sm:hidden">Cards</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="quiz"
                    className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 sm:w-6 sm:h-6">
                      <GraduationCap className="h-4 w-4 text-white sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Quiz</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 sm:w-6 sm:h-6">
                      <Calendar className="h-4 w-4 text-white sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Schedule</span>
                    <span className="text-xs font-medium sm:hidden">Plan</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 sm:w-6 sm:h-6">
                      <Star className="h-4 w-4 text-white sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Saved</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="explain" className="mt-0">
                    <ExplainTab />
                  </TabsContent>

                  <TabsContent value="flashcards" className="mt-0">
                    <FlashcardsTab />
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-0">
                    <QuizTab />
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-0">
                    <ScheduleTab />
                  </TabsContent>

                  <TabsContent value="saved" className="mt-0">
                    <SavedTab />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        currentName={currentUser?.name}
      />
    </div>
  );
}
