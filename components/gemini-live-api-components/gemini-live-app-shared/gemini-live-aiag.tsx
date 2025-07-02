import ControlTray from "@/components/gemini-live-api-components/control-tray/ControlTray";
import { LiveClientOptions } from "./types";
import { KnowledgeBaseAudioPrompt} from "@/components/gemini-live-api-components/KnowledgeBaseAudioPrompt";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";


const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY! as string;
if (typeof API_KEY !== "string" || !API_KEY) {
  throw new Error("set GOOGLE_GENERATIVE_AI_API_KEY in .env.local");
}
const apiOptions: LiveClientOptions = {
  apiKey: API_KEY,
};

function Gemini_Live_AIAG({ user }:any) {
  return (
    <div>
      <LiveAPIProvider options={apiOptions}>
        <KnowledgeBaseAudioPrompt />
        <ControlTray user={user} />
      </LiveAPIProvider>
    </div>
  );
}

export default Gemini_Live_AIAG;