"use client";
import { Button } from "@/components/ui/button";
import { ModelTable } from "./components/model-table";
import { DeployModelDialog } from "./components/deploy-model-dialog";
import { UploadCloud, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Model } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ModelManagementPage() {
  const { toast } = useToast();
  const [_, setForceUpdate] = useState(0); // To re-render and show new model in table (conceptual)

  const handleDeployModel = (modelDetails: Partial<Model>) => {
    const newModel: Model = {
      id: `m${Date.now()}`,
      deploymentDate: new Date().toISOString().split("T")[0],
      ...modelDetails,
    } as Model;
    // In a real app, you'd update a global state or refetch models
    // For this example, we'll just toast and conceptually update
    toast({
      title: "Model Deployment Started",
      description: `${newModel.name} ${newModel.version} is being deployed to ${newModel.status}.`,
    });
    // This is a hack to simulate the table updating.
    // In a real app, ModelTable would manage its own state or receive it via props from a provider/server.
    // Or `onDeployModel` would be passed down to ModelTable to update its internal state.
    // For now, ModelTable uses its own initialModels, so this won't actually add to it.
    setForceUpdate(val => val + 1); 
  };
  
  // This function would be passed to ModelTable if it were to manage its own state mutation.
  // However, for this example, ModelTable has its own state.
  const addDeployedModelToTable = (model: Model) => {
    // This is where you would update the state that ModelTable reads from.
    console.log("Model to add to table:", model);
  };


  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Model Management</h1>
        <div className="flex gap-2">
          <DeployModelDialog onDeploy={handleDeployModel}>
            <Button>
              <UploadCloud className="mr-2 h-4 w-4" />
              Deploy New Model
            </Button>
          </DeployModelDialog>
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Monitoring Overview
          </Button>
        </div>
      </div>

      <ModelTable onDeployModel={addDeployedModelToTable} />

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>Model Monitoring</CardTitle>
          <CardDescription>
            Overview of a selected model's performance and health. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">Monitoring data and charts will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
