import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Brain, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";
import { apiClient, QuizResponse } from "@/lib/api";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export default function QuizTab() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const create = useMutation(api.studySessions.create);
  const saveResult = useMutation(api.quizzes.saveResult);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    const questionCount = parseInt(count) || 5;
    if (questionCount < 1 || questionCount > 20) {
      toast.error("Please enter a count between 1 and 20");
      return;
    }

    setLoading(true);
    try {
      await create({ subject: topic, topic, notes: `Quiz: ${difficulty}` });
      const response = await apiClient.generateQuiz({ topic, difficulty, count: questionCount });
      setResult(response);
      setCurrentQuestion(0);
      setUserAnswers(new Array(response.questions.length).fill(""));
      setShowResults(false);
      toast.success(`Quiz with ${response.questions.length} questions generated!`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate quiz. Make sure the Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!result) return;

    const correctCount = result.questions.filter(
      (q, idx) => q.correct_answer === userAnswers[idx]
    ).length;

    await saveResult({
      topic: result.topic,
      totalQuestions: result.questions.length,
      correctAnswers: correctCount,
    });

    setShowResults(true);
    toast.success(`Quiz completed! Score: ${correctCount}/${result.questions.length}`);
  };

  const question = result?.questions[currentQuestion];

  return (
    <div className="space-y-6">
      {!result && (
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-topic">Topic</Label>
            <Input
              id="quiz-topic"
              placeholder="e.g., World History, Chemistry, Mathematics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-count">Questions</Label>
              <Input
                id="quiz-count"
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </div>
      )}

      {result && !showResults && question && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {result.questions.length}
            </p>
            <div className="flex gap-2">
              {result.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-8 rounded ${
                    idx === currentQuestion
                      ? "bg-primary"
                      : userAnswers[idx]
                        ? "bg-primary/40"
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">{question.question}</h3>

              <RadioGroup
                value={userAnswers[currentQuestion]}
                onValueChange={(value) => {
                  const newAnswers = [...userAnswers];
                  newAnswers[currentQuestion] = value;
                  setUserAnswers(newAnswers);
                }}
              >
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion < result.questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={userAnswers.some((a) => !a)}>
                Submit Quiz
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {showResults && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 text-center space-y-4">
              <Trophy className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-3xl font-bold">Quiz Complete!</h2>
              <p className="text-4xl font-bold text-primary">
                {result.questions.filter((q, idx) => q.correct_answer === userAnswers[idx]).length} / {result.questions.length}
              </p>
              <p className="text-muted-foreground">
                {Math.round((result.questions.filter((q, idx) => q.correct_answer === userAnswers[idx]).length / result.questions.length) * 100)}% correct
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {result.questions.map((q, idx) => {
              const isCorrect = q.correct_answer === userAnswers[idx];
              return (
                <Card key={idx} className={`border-2 ${isCorrect ? "border-green-500/40" : "border-red-500/40"}`}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your answer: <span className={isCorrect ? "text-green-600" : "text-red-600"}>{userAnswers[idx]}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {q.correct_answer}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button
            onClick={() => {
              setResult(null);
              setShowResults(false);
            }}
            className="w-full"
          >
            Take Another Quiz
          </Button>
        </motion.div>
      )}
    </div>
  );
}
