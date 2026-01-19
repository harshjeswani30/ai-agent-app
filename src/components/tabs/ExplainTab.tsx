import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lightbulb, BookmarkPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useAction } from "convex/react";
import { api } from "convex/_generated/api";

export default function ExplainTab() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const create = useMutation(api.studySessions.create);
  const saveContent = useMutation(api.savedContent.save);
  const explainTopic = useAction(api.ai.explainTopic);

  const handleExplain = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      await create({ type: "explanation", subject: topic, topic, notes: `Explanation: ${depth}` });
      const response = await explainTopic({ topic, depth });
      setResult(response);
      toast.success("Explanation generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate explanation");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveContent({
        type: "explanation",
        topic: result.topic,
        content: JSON.stringify(result),
      });
      toast.success("Explanation saved!");
    } catch (error) {
      toast.error("Failed to save explanation");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic to Explain</Label>
          <Input
            id="topic"
            placeholder="e.g., Photosynthesis, Quantum Computing, World War II"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExplain()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="depth">Depth Level</Label>
          <Select value={depth} onValueChange={(v: any) => setDepth(v)}>
            <SelectTrigger id="depth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExplain} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Explain Topic
            </>
          )}
        </Button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{result.topic}</h3>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-primary">Explanation</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
              </div>

              {result.key_points && result.key_points.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Key Points</h4>
                  <ul className="space-y-2">
                    {result.key_points.map((point: string, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {result.examples && result.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Examples</h4>
                  <ul className="space-y-2">
                    {result.examples.map((example: string, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (result.key_points?.length || 0 + idx) * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Lightbulb className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{example}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}