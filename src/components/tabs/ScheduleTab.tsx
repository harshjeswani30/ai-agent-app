import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Calendar, Plus, X, BookmarkPlus, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiClient, ScheduleResponse } from "@/lib/api";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ScheduleTab() {
  const [topics, setTopics] = useState<string[]>([""]);
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [days, setDays] = useState("7");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResponse | null>(null);

  const createSession = useMutation(api.studySessions.create);
  const saveContent = useMutation(api.savedContent.save);

  const addTopic = () => {
    setTopics([...topics, ""]);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleGenerate = async () => {
    const validTopics = topics.filter((t) => t.trim());
    if (validTopics.length === 0) {
      toast.error("Please enter at least one topic");
      return;
    }

    const hours = parseInt(hoursPerDay) || 2;
    const numDays = parseInt(days) || 7;

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
      await createSession({ topic: validTopics.join(", "), type: "schedule" });
      const response = await apiClient.createSchedule({
        topics: validTopics,
        hours_per_day: hours,
        days: numDays,
      });
      setResult(response);
      toast.success("Study schedule created!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create schedule. Make sure the Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveContent({
        type: "schedule",
        topic: topics.filter((t) => t.trim()).join(", "),
        content: JSON.stringify(result),
      });
      toast.success("Schedule saved!");
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const groupedSchedule = result?.schedule.reduce(
    (acc, block) => {
      if (!acc[block.day]) {
        acc[block.day] = [];
      }
      acc[block.day].push(block);
      return acc;
    },
    {} as Record<number, typeof result.schedule>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Topics to Study</Label>
          <div className="space-y-2">
            {topics.map((topic, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder={`Topic ${idx + 1}`}
                  value={topic}
                  onChange={(e) => updateTopic(idx, e.target.value)}
                />
                {topics.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeTopic(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addTopic} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
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
              Create Schedule
            </>
          )}
        </Button>
      </div>

      {result && groupedSchedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total: {result.total_hours} hours</p>
              <p className="text-xs text-muted-foreground">{Object.keys(groupedSchedule).length} days</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save Schedule
            </Button>
          </div>

          {Object.entries(groupedSchedule).map(([day, blocks]) => (
            <Card key={day} className="border-primary/20">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Day {day}
                </h3>
                <div className="space-y-2">
                  {blocks.map((block, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{block.topic}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {block.duration} min
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{block.focus_area}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Study Tips</h3>
              <ul className="space-y-2">
                {result.tips.map((tip, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-sm flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
