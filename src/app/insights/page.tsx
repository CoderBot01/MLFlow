import { AiInsightsChat } from "./components/chat-interface";

export default function AiInsightsPage() {
  return (
    <div className="flex flex-col py-6 h-full">
       {/* The title is handled by AppShell now, if needed here, add it
        <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-semibold md:text-3xl">AI Insights</h1>
       </div> 
       */}
      <AiInsightsChat />
    </div>
  );
}
