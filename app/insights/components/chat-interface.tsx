"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Sparkles, FileText, User } from "lucide-react";
import { analyzeExperimentResults, AnalyzeExperimentResultsInput, AnalyzeExperimentResultsOutput } from "@/ai/flows/analyze-experiment-results";
import { generateExperimentSummary, GenerateExperimentSummaryInput, GenerateExperimentSummaryOutput } from "@/ai/flows/generate-experiment-summary";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  type: "user" | "ai" | "summary";
  content: string | AnalyzeExperimentResultsOutput | GenerateExperimentSummaryOutput;
  rawInput?: AnalyzeExperimentResultsInput | GenerateExperimentSummaryInput;
}

export function AiInsightsChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [experimentResultsData, setExperimentResultsData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Summary generation states
  const [summaryExperimentName, setSummaryExperimentName] = useState("");
  const [summaryMetrics, setSummaryMetrics] = useState("");
  const [summaryVisData, setSummaryVisData] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !experimentResultsData.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Query: ${query}\n\nExperiment Data: ${experimentResultsData.substring(0,100)}...`,
      rawInput: { experimentResults: experimentResultsData, query },
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuery(""); // Clear input after sending

    try {
      const input: AnalyzeExperimentResultsInput = { experimentResults: experimentResultsData, query };
      const result = await analyzeExperimentResults(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: result,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error analyzing experiment results:", error);
      toast({
        title: "Error",
        description: "Failed to get AI insights. Please try again.",
        variant: "destructive",
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!summaryExperimentName.trim() || !summaryMetrics.trim() || !summaryVisData.trim() || isGeneratingSummary) {
        toast({ title: "Missing Information", description: "Please fill all fields for summary generation.", variant: "destructive"});
        return;
    }
    
    const rawInput: GenerateExperimentSummaryInput = {
        experimentName: summaryExperimentName,
        // Attempt to parse metrics, expecting JSON string like {"accuracy": 0.9, "loss": 0.1}
        metrics: (() => { try { return JSON.parse(summaryMetrics); } catch { return { error: "Invalid metrics JSON" }; } })(),
        visualizationData: summaryVisData,
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Generate summary for: ${summaryExperimentName}`,
      rawInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsGeneratingSummary(true);

    try {
      const result = await generateExperimentSummary(rawInput);
      const summaryMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "summary",
        content: result,
      };
      setMessages((prev) => [...prev, summaryMessage]);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "summary",
        content: "Sorry, I encountered an error generating the summary.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (typeof message.content === 'string') {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
    if (message.type === 'ai' && 'analysis' in message.content) {
      const content = message.content as AnalyzeExperimentResultsOutput;
      return (
        <div className="space-y-2">
          <h4 className="font-semibold">AI Analysis:</h4>
          <p className="whitespace-pre-wrap">{content.analysis}</p>
          <h5 className="font-semibold pt-2">Key Insights:</h5>
          <p className="whitespace-pre-wrap">{content.insights}</p>
          <h5 className="font-semibold pt-2">Statistical Significance:</h5>
          <p className="whitespace-pre-wrap">{content.statisticalSignificance}</p>
          <h5 className="font-semibold pt-2">Robustness Assessment:</h5>
          <p className="whitespace-pre-wrap">{content.robustnessAssessment}</p>
        </div>
      );
    }
    if (message.type === 'summary' && 'summary' in message.content) {
        const content = message.content as GenerateExperimentSummaryOutput;
        return (
          <div className="space-y-2">
            <h4 className="font-semibold">Experiment Summary:</h4>
            <p className="whitespace-pre-wrap">{content.summary}</p>
            <h5 className="font-semibold pt-2">Key Findings:</h5>
            <ul className="list-disc list-inside">
                {content.keyFindings.map((finding, idx) => <li key={idx}>{finding}</li>)}
            </ul>
          </div>
        );
    }
    return <p>Unsupported message format.</p>;
  };


  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      <Card className="md:col-span-1 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle>Data Input for AI</CardTitle>
          <CardDescription>Provide data and query for analysis, or details for summary generation.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 overflow-y-auto">
          <div>
            <Label htmlFor="experimentResultsData" className="text-sm font-medium">Experiment Results Data</Label>
            <Textarea
              id="experimentResultsData"
              value={experimentResultsData}
              onChange={(e) => setExperimentResultsData(e.target.value)}
              placeholder="Paste your experiment results here (e.g., metrics, logs, config JSON)"
              className="mt-1 h-32"
              disabled={isLoading}
            />
             <p className="text-xs text-muted-foreground mt-1">This data will be used for the 'Analyze Experiment' feature.</p>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-md font-semibold mb-2">Generate Experiment Summary</h3>
            <div className="space-y-2">
                 <div>
                    <Label htmlFor="summaryExperimentName">Experiment Name</Label>
                    <Input id="summaryExperimentName" value={summaryExperimentName} onChange={e => setSummaryExperimentName(e.target.value)} placeholder="e.g., Image Classification v2" disabled={isGeneratingSummary} />
                </div>
                <div>
                    <Label htmlFor="summaryMetrics">Metrics (JSON)</Label>
                    <Input id="summaryMetrics" value={summaryMetrics} onChange={e => setSummaryMetrics(e.target.value)} placeholder='e.g., {"accuracy": 0.92, "loss": 0.15}' disabled={isGeneratingSummary} />
                </div>
                <div>
                    <Label htmlFor="summaryVisData">Visualization Data (Description)</Label>
                    <Textarea id="summaryVisData" value={summaryVisData} onChange={e => setSummaryVisData(e.target.value)} placeholder="e.g., Line chart showing accuracy trend over epochs." className="h-20" disabled={isGeneratingSummary} />
                </div>
                <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary || isLoading} className="w-full">
                    {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Generate Summary
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 flex flex-col h-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-accent" /> AI Insights Chat</CardTitle>
          <CardDescription>Ask questions about your experiment results or generate summaries.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type !== "user" && (
                    <div className="bg-primary text-primary-foreground rounded-full p-2 h-9 w-9 flex items-center justify-center shrink-0">
                      {message.type === 'ai' ? <Sparkles size={18} /> : <FileText size={18} />}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-xl p-3 shadow ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                   {message.type === "user" && (
                     <div className="bg-accent text-accent-foreground rounded-full p-2 h-9 w-9 flex items-center justify-center shrink-0">
                       <User size={18} />
                     </div>
                   )}
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles size={48} className="mx-auto mb-2" />
                  <p>No messages yet. Enter experiment data and a query, or generate a summary to start.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleAnalyzeSubmit} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your analysis query here..."
              disabled={isLoading || isGeneratingSummary}
            />
            <Button type="submit" disabled={isLoading || isGeneratingSummary || !query.trim() || !experimentResultsData.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
