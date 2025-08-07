import ControlTray from "@/components/gemini-live-api-components/control-tray/ControlTray";
import { LiveClientOptions } from "./types";
import { KnowledgeBaseAudioPrompt} from "@/components/gemini-live-api-components/KnowledgeBaseAudioPrompt";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";


const apiOptions: LiveClientOptions = {
  apiKey: process?.env?.GOOGLE_GENERATIVE_AI_API_KEY! as string,
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