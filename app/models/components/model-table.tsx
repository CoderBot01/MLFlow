"use client";

import { useState } from "react";
import type { Model } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, PlayCircle, RotateCcw, ShieldAlert, Trash2, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


const initialModels: Model[] = [
  { id: "m1", name: "Sentiment Analyzer", version: "v2.1.0", status: "Production", deploymentDate: "2023-10-15", description: "Analyzes customer feedback sentiment." },
  { id: "m2", name: "Image Classifier", version: "v1.5.2", status: "Staging", deploymentDate: "2023-11-01", description: "Classifies images into predefined categories." },
  { id: "m3", name: "Fraud Detection", version: "v3.0.1", status: "Production", deploymentDate: "2023-09-20", description: "Detects fraudulent transactions in real-time." },
  { id: "m4", name: "Recommendation Engine", version: "v0.8.0", status: "Development", deploymentDate: "2023-11-10", description: "Provides personalized product recommendations." },
  { id: "m5", name: "Time Series Forecaster", version: "v1.2.0", status: "Archived", deploymentDate: "2023-05-01", description: "Forecasts future values based on historical data." },
];

export function ModelTable({ onDeployModel }: { onDeployModel: (model: Model) => void }) {
  const [models, setModels] = useState<Model[]>(initialModels);
  const { toast } = useToast();

  const handleAction = (action: string, modelId: string) => {
    const model = models.find(m => m.id === modelId);
    toast({
      title: `Action: ${action}`,
      description: `Performed "${action}" on model ${model?.name} ${model?.version}.`,
    });
    if (action === "Rollback") {
        // Example: update status or version
        setModels(models.map(m => m.id === modelId ? {...m, version: `v${parseFloat(m.version.substring(1)) - 0.1}.0` } : m));
    }
    if (action === "Promote to Production") {
      setModels(models.map(m => m.id === modelId ? {...m, status: "Production" } : m));
    }
  };

  const handleDelete = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    setModels(models.filter(m => m.id !== modelId));
    toast({
      title: "Model Deleted",
      description: `Model ${model?.name} ${model?.version} has been deleted.`,
      variant: "destructive"
    });
  }

  const getStatusBadgeVariant = (status: Model["status"]): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "Production": return "default"; // Primary color
      case "Staging": return "secondary"; 
      case "Development": return "outline";
      case "Archived": return "destructive"; // Or a grayed out outline
      default: return "outline";
    }
  };


  if (models.length === 0) {
    return (
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>No Models Found</AlertTitle>
        <AlertDescription>
          There are no models to display. Try deploying a new model to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deployment Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>{model.version}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(model.status)}>{model.status}</Badge>
              </TableCell>
              <TableCell>{model.deploymentDate}</TableCell>
              <TableCell className="max-w-xs truncate">{model.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Model Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleAction("View Details", model.id)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {model.status !== "Production" && (
                        <DropdownMenuItem onClick={() => handleAction("Promote to Production", model.id)}>
                            <PlayCircle className="mr-2 h-4 w-4" /> Promote to Production
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleAction("Rollback", model.id)}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Rollback
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 hover:!bg-red-500 hover:!text-white focus:!bg-red-500 focus:!text-white">
                               <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the model
                                <span className="font-semibold"> {model.name} ({model.version})</span>.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(model.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
