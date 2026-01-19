import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Trash2, BookOpen, GraduationCap, Calendar, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";

export default function SavedTab() {
  const [selectedType, setSelectedType] = useState<"all" | "explanation" | "flashcards" | "quiz" | "schedule">("all");

  const allContent = useQuery(api.savedContent.getByType, selectedType === "all" ? {} : { type: selectedType as any });
  const favorites = useQuery(api.savedContent.getFavorites);

  const toggleFavorite = useMutation(api.savedContent.toggleFavorite);
  const removeContent = useMutation(api.savedContent.remove);

  const handleToggleFavorite = async (id: Id<"savedContent">) => {
    try {
      await toggleFavorite({ contentId: id });
      toast.success("Updated favorites");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: Id<"savedContent">) => {
    try {
      await removeContent({ id });
      toast.success("Content deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "explanation": return <Lightbulb className="h-4 w-4" />;
      case "flashcards": return <BookOpen className="h-4 w-4" />;
      case "quiz": return <GraduationCap className="h-4 w-4" />;
      case "schedule": return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  const ContentCard = ({ item }: { item: any }) => {
    let preview = "";
    try {
      const parsed = JSON.parse(item.content);
      if (item.type === "explanation") {
        preview = parsed.explanation?.substring(0, 150) + "...";
      } else if (item.type === "flashcards") {
        preview = `${parsed.flashcards?.length || 0} flashcards`;
      } else if (item.type === "quiz") {
        preview = `${parsed.questions?.length || 0} questions`;
      } else if (item.type === "schedule") {
        preview = `${parsed.schedule?.length || 0} study blocks`;
      }
    } catch {
      preview = "Saved content";
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {getIcon(item.type)}
                  <h3 className="font-semibold">{item.topic}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{preview}</p>
                <p className="text-xs text-muted-foreground">
                  Saved {new Date(item._creationTime).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(item._id)}
                >
                  <Star
                    className={`h-4 w-4 ${item.isFavorite ? "fill-primary text-primary" : ""}`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedType} onValueChange={(v: any) => setSelectedType(v)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="explanation">Explained</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quizzes</TabsTrigger>
          <TabsTrigger value="schedule">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4 mt-6">
          {allContent && allContent.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No saved content yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start using the other tabs to generate and save content
                </p>
              </CardContent>
            </Card>
          ) : (
            allContent?.map((item) => <ContentCard key={item._id} item={item} />)
          )}
        </TabsContent>
      </Tabs>

      {favorites && favorites.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Favorites
          </h2>
          {favorites.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
