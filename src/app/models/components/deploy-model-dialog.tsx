"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Model } from "@/types";

interface DeployModelDialogProps {
  onDeploy: (modelDetails: Partial<Model>) => void;
  children: React.ReactNode;
}

export function DeployModelDialog({ onDeploy, children }: DeployModelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelVersion, setModelVersion] = useState("");
  const [description, setDescription] = useState("");
  const [targetEnvironment, setTargetEnvironment] = useState<Model["status"] | "">("");

  const handleSubmit = () => {
    if (!modelName || !modelVersion || !targetEnvironment) {
        // Basic validation
        alert("Please fill in all required fields.");
        return;
    }
    onDeploy({
      name: modelName,
      version: modelVersion,
      description,
      status: targetEnvironment as Model["status"], // Assume staging for new deployments
    });
    setIsOpen(false);
    // Reset form
    setModelName("");
    setModelVersion("");
    setDescription("");
    setTargetEnvironment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deploy New Model</DialogTitle>
          <DialogDescription>
            Provide details for the new model deployment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelName" className="text-right">
              Model Name
            </Label>
            <Input
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Fraud Detection"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelVersion" className="text-right">
              Version
            </Label>
            <Input
              id="modelVersion"
              value={modelVersion}
              onChange={(e) => setModelVersion(e.target.value)}
              className="col-span-3"
              placeholder="e.g., v1.2.0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Briefly describe the model and its purpose."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetEnvironment" className="text-right">
              Environment
            </Label>
            <Select
              value={targetEnvironment}
              onValueChange={(value) => setTargetEnvironment(value as Model["status"])}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Staging">Staging</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Deploy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
