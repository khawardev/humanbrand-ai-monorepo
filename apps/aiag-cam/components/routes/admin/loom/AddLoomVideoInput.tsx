"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createLoomVideo } from "@/server/actions/loomActions";
import { SiLoom } from "react-icons/si";

export function AddLoomVideoInput() {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    if (!url) return;

    setLoading(true);

    try {
      const result = await createLoomVideo(url);
      if (result.success) {
        toast.success("Loom video added successfully");
        setIsAdding(false);
        setUrl("");
      } else {
        toast.error(result.error || "Failed to add video");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)}>
        <SiLoom />
        Add Loom Video
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="w-[300px]">
        <Input
          icon={<SiLoom className="h-4 w-4" />}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Loom URL ..."
          className="bg-background"
          autoFocus
          disabled={loading}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading || !url}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setIsAdding(false);
          setUrl("");
        }}
        disabled={loading}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
