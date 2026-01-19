import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RotateCw, BookmarkPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { apiClient, FlashcardResponse } from "@/lib/api";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export default function FlashcardsTab() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FlashcardResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const create = useMutation(api.studySessions.create);
  const saveContent = useMutation(api.savedContent.save);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    const cardCount = parseInt(count) || 5;
    if (cardCount < 1 || cardCount > 20) {
      toast.error("Please enter a count between 1 and 20");
      return;
    }

    setLoading(true);
    try {
      await create({ subject: topic, topic, notes: `Flashcards: ${cardCount}` });
      const response = await apiClient.generateFlashcards({ topic, count: cardCount });
      setResult(response);
      setCurrentIndex(0);
      setFlipped(false);
      toast.success(`${response.flashcards.length} flashcards generated!`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate flashcards. Make sure the Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveContent({
        type: "flashcards",
        topic: result.topic,
        content: JSON.stringify(result),
      });
      toast.success("Flashcards saved!");
    } catch (error) {
      toast.error("Failed to save flashcards");
    }
  };

  const nextCard = () => {
    if (result && currentIndex < result.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const currentCard = result?.flashcards[currentIndex];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="flashcard-topic">Topic</Label>
          <Input
            id="flashcard-topic"
            placeholder="e.g., Spanish Vocabulary, Biology Terms"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="count">Number of Flashcards</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RotateCw className="mr-2 h-4 w-4" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>

      {result && currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {result.flashcards.length}
            </p>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save All
            </Button>
          </div>

          <motion.div
            key={currentIndex}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setFlipped(!flipped)}
            className="cursor-pointer"
          >
            <Card className="min-h-[300px] border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="flex items-center justify-center p-8 h-[300px]">
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    {flipped ? "Answer" : "Question"}
                  </p>
                  <p className="text-lg font-medium">
                    {flipped ? currentCard.answer : currentCard.question}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <p className="text-xs text-muted-foreground">Click card to flip</p>
            <Button
              variant="outline"
              onClick={nextCard}
              disabled={currentIndex === result.flashcards.length - 1}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
