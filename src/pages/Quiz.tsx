import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  Trophy,
  GraduationCap,
  Home,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

type QuizState = "setup" | "taking" | "results";

export default function Quiz() {
  const [state, setState] = useState<QuizState>("setup");
  const [subject, setSubject] = useState("mathematics");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("intermediate");

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const saveQuizResult = useMutation(api.quizzes.saveQuizResult);

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic: topic.trim(),
          num_questions: numQuestions,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setUserAnswers(new Array(data.questions.length).fill(""));
      setState("taking");
      setCurrentQuestion(0);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate quiz. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (answers: string[]) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correctCount = answers.filter(
      (answer, index) => answer === questions[index].correct_answer
    ).length;

    // Save to database
    try {
      await saveQuizResult({
        subject,
        topic,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        difficulty,
        timeSpent,
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }

    setState("results");
  };

  const handleReset = () => {
    setState("setup");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setUserAnswers([]);
    setTopic("");
  };

  const score = userAnswers.filter(
    (answer, index) => answer === questions[index]?.correct_answer
  ).length;
  const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StudyBuddy AI</span>
            </Link>

            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {/* Setup State */}
          {state === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Generate a Quiz</h1>
                  <p className="text-muted-foreground">
                    Test your knowledge with AI-generated questions
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="languages">Languages</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Algebra, React Hooks, World War II"
                    />
                  </div>

                  <div>
                    <Label htmlFor="num-questions">Number of Questions</Label>
                    <Select
                      value={numQuestions.toString()}
                      onValueChange={(val) => setNumQuestions(parseInt(val))}
                    >
                      <SelectTrigger id="num-questions">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleStartQuiz}
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Quiz...
                      </>
                    ) : (
                      <>
                        Start Quiz
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Taking Quiz State */}
          {state === "taking" && questions[currentQuestion] && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">
                  {questions[currentQuestion].question}
                </h2>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <Label
                        key={index}
                        htmlFor={`option-${index}`}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAnswer === option
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <span className="flex-1">{option}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>

                <Button
                  onClick={handleNext}
                  className="w-full mt-6"
                  size="lg"
                  disabled={!selectedAnswer}
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Results State */}
          {state === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                      percentage >= 70 ? "bg-green-500/10" : "bg-orange-500/10"
                    }`}
                  >
                    <Trophy
                      className={`h-10 w-10 ${
                        percentage >= 70 ? "text-green-500" : "text-orange-500"
                      }`}
                    />
                  </div>
                  <h1 className="text-4xl font-bold mb-2">
                    {percentage >= 90
                      ? "Excellent!"
                      : percentage >= 70
                      ? "Great Job!"
                      : percentage >= 50
                      ? "Good Effort!"
                      : "Keep Practicing!"}
                  </h1>
                  <p className="text-5xl font-bold text-primary mb-2">
                    {Math.round(percentage)}%
                  </p>
                  <p className="text-muted-foreground">
                    {score} out of {questions.length} correct
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-lg">Review Answers</h3>
                  {questions.map((question, index) => {
                    const isCorrect = userAnswers[index] === question.correct_answer;
                    return (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">{question.question}</p>
                            <p className="text-sm text-muted-foreground">
                              Your answer: {userAnswers[index]}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600 mt-1">
                                Correct answer: {question.correct_answer}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Take Another Quiz
                  </Button>
                  <Link to="/dashboard" className="flex-1">
                    <Button className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
