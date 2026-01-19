import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, AtSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName?: string;
  currentUsername?: string;
}

export function ProfileDialog({
  open,
  onOpenChange,
  currentName,
  currentUsername,
}: ProfileDialogProps) {
  const [name, setName] = useState(currentName || "");
  const [username, setUsername] = useState(currentUsername || "");
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useMutation(api.users.updateProfile);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validate username (alphanumeric and underscore only)
      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        toast.error("Username can only contain letters, numbers, and underscores");
        return;
      }

      await updateProfile({
        name: name.trim() || undefined,
        username: username.trim() || undefined,
      });

      toast.success("Profile updated successfully!");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your display name and username. Your username must be unique.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Display Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              This is how your name will appear in the dashboard
            </p>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
              <AtSign className="h-4 w-4 text-muted-foreground" />
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="h-11 pl-7"
                maxLength={30}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                @
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Letters, numbers, and underscores only
            </p>
          </div>

          {/* Preview */}
          {(name || username) && (
            <div className="rounded-xl border-2 border-primary/20 bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <span className="text-lg font-bold text-primary">
                    {(name || username || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">
                    {name || "User"}
                  </p>
                  {username && (
                    <p className="text-sm text-muted-foreground">@{username}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
