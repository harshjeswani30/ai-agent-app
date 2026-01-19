import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Lightbulb, BookmarkPlus, X } from "lucide-react";
import { toast } from "sonner";
import { apiClient, ScheduleResponse } from "@/lib/api";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ScheduleTab() {
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [days, setDays] = useState("7");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResponse | null>(null);

  const createSession = useMutation(api.studySessions.create);
  const saveContent = useMutation(api.savedContent.save);

  const addTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
      setTopics([...topics, currentTopic.trim()]);
      setCurrentTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic));
  };

  const handleGenerate = async () => {
    if (topics.length === 0) {
      toast.error("Please add at least one topic");
      return;
    }

    const hours = parseInt(hoursPerDay);
    const numDays = parseInt(days);

    if (hours < 1 || hours > 12) {
      toast.error("Please enter hours between 1 and 12");
      return;
    }

    if (numDays < 1 || numDays > 30) {
      toast.error("Please enter days between 1 and 30");
      return;
    }

    setLoading(true);
    try {
      await createSession({ topic: topics.join(", "), type: "schedule" });
      const response = await apiClient.createSchedule({
        topics,
        hours_per_day: hours,
        days: numDays,
      });
      setResult(response);
      toast.success("Study schedule generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate schedule. Make sure the Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveContent({
        type: "schedule",
        topic: topics.join(", "),
        content: JSON.stringify(result),
      });
      toast.success("Schedule saved!");
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const groupedSchedule = result?.schedule.reduce(
    (acc, block) => {
      if (!acc[block.day]) acc[block.day] = [];
      acc[block.day].push(block);
      return acc;
    },
    {} as Record<number, typeof result.schedule>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="topic-input">Add Topics</Label>
          <div className="flex gap-2">
            <Input
              id="topic-input"
              placeholder="e.g., Calculus, Spanish, Physics"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTopic()}
            />
            <Button onClick={addTopic} variant="outline" type="button">
              Add
            </Button>
          </div>
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-sm">
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hours">Hours per Day</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="12"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Number of Days</Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
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
              <Calendar className="mr-2 h-4 w-4" />
              Generate Schedule
            </>
          )}
        </Button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Your Study Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Total: {result.total_hours} hours over {days} days
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>

          {/* Schedule Days */}
          <div className="space-y-4">
            {groupedSchedule && Object.entries(groupedSchedule).map(([day, blocks]) => (
              <Card key={day} className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Day {day}</h4>
                  </div>

                  <div className="space-y-3">
                    {blocks.map((block, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-primary">{block.topic}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {block.focus_area}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                            <Clock className="h-4 w-4" />
                            {block.duration} min
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Study Tips */}
          {result.tips && result.tips.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Study Tips</h4>
                </div>
                <ul className="space-y-2">
                  {result.tips.map((tip, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm flex gap-2"
                    >
                      <span className="text-primary">•</span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
