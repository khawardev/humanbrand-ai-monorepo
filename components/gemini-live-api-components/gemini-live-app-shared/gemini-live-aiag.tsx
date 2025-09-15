import ControlTray from "@/components/gemini-live-api-components/control-tray/ControlTray";
import { LiveClientOptions } from "./types";
import { KnowledgeBaseAudioPrompt } from "@/components/gemini-live-api-components/KnowledgeBaseAudioPrompt";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";

const apiOptions: LiveClientOptions = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!,
};

function Gemini_Live_AIAG() {
  if (!apiOptions.apiKey) {
    console.error("Gemini API key is missing. Please set NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file.");
    return (
      <div className="text-red-500 text-center p-4">
        Configuration Error: Gemini API Key not found.
      </div>
    );
  }

  return (
    <div>
      <LiveAPIProvider options={apiOptions}>
        <KnowledgeBaseAudioPrompt />
        <ControlTray />
      </LiveAPIProvider>
    </div>
  );
}

export default Gemini_Live_AIAG;