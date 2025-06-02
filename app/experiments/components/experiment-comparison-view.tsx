"use client";

import { useState, useMemo } from "react";
import type { Experiment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GitCompareArrows, Info, LineChart as LineChartIcon, BarChart2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from "recharts";

const mockExperiments: Experiment[] = [
  {
    id: "exp1", name: "ResNet50 - Adam", date: "2023-11-01",
    metrics: { accuracy: 0.85, precision: 0.82, recall: 0.88, f1: 0.85, loss: 0.35 },
    params: { learning_rate: 0.001, batch_size: 32, optimizer: "Adam" },
    chartData: Array.from({ length: 10 }, (_, i) => ({ epoch: i + 1, accuracy: 0.6 + i * 0.025 + Math.random()*0.05, loss: 0.5 - i*0.015 + Math.random()*0.05 })),
  },
  {
    id: "exp2", name: "ResNet50 - SGD", date: "2023-11-05",
    metrics: { accuracy: 0.82, precision: 0.80, recall: 0.85, f1: 0.82, loss: 0.40 },
    params: { learning_rate: 0.01, batch_size: 32, optimizer: "SGD", momentum: 0.9 },
    chartData: Array.from({ length: 10 }, (_, i) => ({ epoch: i + 1, accuracy: 0.55 + i * 0.027 + Math.random()*0.05, loss: 0.6 - i*0.020 + Math.random()*0.05 })),
  },
  {
    id: "exp3", name: "EfficientNetB0 - AdamW", date: "2023-11-10",
    metrics: { accuracy: 0.90, precision: 0.88, recall: 0.92, f1: 0.90, loss: 0.25 },
    params: { learning_rate: 0.0005, batch_size: 64, optimizer: "AdamW" },
    chartData: Array.from({ length: 10 }, (_, i) => ({ epoch: i + 1, accuracy: 0.65 + i * 0.025 + Math.random()*0.03, loss: 0.45 - i*0.020 + Math.random()*0.03 })),
  },
  {
    id: "exp4", name: "ViT Small - Adam", date: "2023-11-12",
    metrics: { accuracy: 0.88, precision: 0.86, recall: 0.90, f1: 0.88, loss: 0.30 },
    params: { learning_rate: 0.001, batch_size: 16, optimizer: "Adam", patch_size: 16 },
    chartData: Array.from({ length: 10 }, (_, i) => ({ epoch: i + 1, accuracy: 0.62 + i * 0.026 + Math.random()*0.04, loss: 0.52 - i*0.022 + Math.random()*0.04 })),
  },
];


const chartConfigAccuracy = (exp1?: Experiment, exp2?: Experiment) => ({
  [exp1?.id || 'exp1_accuracy']: { label: exp1?.name ? `${exp1.name} Acc.` : 'Exp 1 Acc.', color: "hsl(var(--chart-1))" },
  [exp2?.id || 'exp2_accuracy']: { label: exp2?.name ? `${exp2.name} Acc.` : 'Exp 2 Acc.', color: "hsl(var(--chart-2))" },
});

const chartConfigLoss = (exp1?: Experiment, exp2?: Experiment) => ({
  [exp1?.id || 'exp1_loss']: { label: exp1?.name ? `${exp1.name} Loss` : 'Exp 1 Loss', color: "hsl(var(--chart-3))" },
  [exp2?.id || 'exp2_loss']: { label: exp2?.name ? `${exp2.name} Loss` : 'Exp 2 Loss', color: "hsl(var(--chart-4))" },
});


export function ExperimentComparisonView() {
  const [selectedExp1Id, setSelectedExp1Id] = useState<string | undefined>(mockExperiments[0]?.id);
  const [selectedExp2Id, setSelectedExp2Id] = useState<string | undefined>(mockExperiments[1]?.id);

  const selectedExp1 = mockExperiments.find(exp => exp.id === selectedExp1Id);
  const selectedExp2 = mockExperiments.find(exp => exp.id === selectedExp2Id);

  const combinedChartData = useMemo(() => {
    if (!selectedExp1?.chartData && !selectedExp2?.chartData) return [];
    const epochs = Math.max(selectedExp1?.chartData?.length || 0, selectedExp2?.chartData?.length || 0);
    return Array.from({ length: epochs }, (_, i) => {
      const epoch = i + 1;
      const data: any = { epoch };
      if (selectedExp1?.chartData?.[i]?.accuracy) data[`${selectedExp1.id}_accuracy`] = selectedExp1.chartData[i].accuracy;
      if (selectedExp1?.chartData?.[i]?.loss) data[`${selectedExp1.id}_loss`] = selectedExp1.chartData[i].loss;
      if (selectedExp2?.chartData?.[i]?.accuracy) data[`${selectedExp2.id}_accuracy`] = selectedExp2.chartData[i].accuracy;
      if (selectedExp2?.chartData?.[i]?.loss) data[`${selectedExp2.id}_loss`] = selectedExp2.chartData[i].loss;
      return data;
    });
  }, [selectedExp1, selectedExp2]);

  const metricsForBarChart = useMemo(() => {
    const metrics: { name: string; [key: string]: number | string }[] = [];
    if (!selectedExp1 || !selectedExp2) return [];
    
    const metricKeys = Array.from(new Set([...Object.keys(selectedExp1.metrics), ...Object.keys(selectedExp2.metrics)]));
    metricKeys.forEach(key => {
      if(key === 'loss') return; // Often different scale, handle separately or omit from simple bar
      metrics.push({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        [selectedExp1.id]: selectedExp1.metrics[key] || 0,
        [selectedExp2.id]: selectedExp2.metrics[key] || 0,
      });
    });
    return metrics;
  }, [selectedExp1, selectedExp2]);


  if (!selectedExp1 || !selectedExp2) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Select Experiments</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Select two experiments to compare.</AlertTitle>
                <AlertDescription>
                Choose one experiment for each dropdown below to start the comparison.
                </AlertDescription>
            </Alert>
             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select onValueChange={setSelectedExp1Id} defaultValue={selectedExp1Id}>
                    <SelectTrigger><SelectValue placeholder="Select Experiment 1" /></SelectTrigger>
                    <SelectContent>{mockExperiments.map(exp => <SelectItem key={exp.id} value={exp.id}>{exp.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select onValueChange={setSelectedExp2Id} defaultValue={selectedExp2Id}>
                    <SelectTrigger><SelectValue placeholder="Select Experiment 2" /></SelectTrigger>
                    <SelectContent>{mockExperiments.map(exp => <SelectItem key={exp.id} value={exp.id} disabled={exp.id === selectedExp1Id}>{exp.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><GitCompareArrows className="mr-2 h-5 w-5 text-primary" /> Experiment Selection</CardTitle>
          <CardDescription>Choose two experiments to compare their metrics and performance.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={setSelectedExp1Id} value={selectedExp1Id}>
            <SelectTrigger><SelectValue placeholder="Select Experiment 1" /></SelectTrigger>
            <SelectContent>{mockExperiments.map(exp => <SelectItem key={exp.id} value={exp.id}>{exp.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={setSelectedExp2Id} value={selectedExp2Id}>
            <SelectTrigger><SelectValue placeholder="Select Experiment 2" /></SelectTrigger>
            <SelectContent>{mockExperiments.map(exp => <SelectItem key={exp.id} value={exp.id} disabled={exp.id === selectedExp1Id}>{exp.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {[selectedExp1, selectedExp2].map((exp, index) => (
          <Card key={exp.id} className="shadow-md">
            <CardHeader>
              <CardTitle>Experiment {index + 1}: {exp.name}</CardTitle>
              <CardDescription>Date: {exp.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2 text-sm">Key Metrics:</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Metric</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
                <TableBody>
                  {Object.entries(exp.metrics).map(([key, value]) => (
                    <TableRow key={key}><TableCell>{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell><TableCell>{value?.toFixed(4)}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
              <h4 className="font-semibold mt-4 mb-2 text-sm">Parameters:</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Parameter</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
                <TableBody>
                  {Object.entries(exp.params).map(([key, value]) => (
                    <TableRow key={key}><TableCell>{key}</TableCell><TableCell>{String(value)}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" /> Metrics Comparison</CardTitle>
          <CardDescription>Side-by-side comparison of key performance metrics.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{
                [selectedExp1.id]: { label: selectedExp1.name, color: "hsl(var(--chart-1))" },
                [selectedExp2.id]: { label: selectedExp2.name, color: "hsl(var(--chart-2))" },
            }} className="h-[350px] w-full">
                <BarChart data={metricsForBarChart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0,1]}/>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <RechartsLegend content={<ChartLegendContent />} />
                    <Bar dataKey={selectedExp1.id} fill={`var(--color-${selectedExp1.id})`} radius={[4, 4, 0, 0]} />
                    <Bar dataKey={selectedExp2.id} fill={`var(--color-${selectedExp2.id})`} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><LineChartIcon className="mr-2 h-5 w-5 text-primary" /> Training Performance: Accuracy</CardTitle>
          <CardDescription>Accuracy over epochs for selected experiments.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigAccuracy(selectedExp1, selectedExp2)} className="h-[350px] w-full">
            <LineChart data={combinedChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="epoch" type="number" allowDecimals={false} />
              <YAxis domain={[0.5, 1]} />
              <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
              <RechartsLegend content={<ChartLegendContent />} />
              {selectedExp1?.chartData && <Line type="monotone" dataKey={`${selectedExp1.id}_accuracy`} stroke={`var(--color-${selectedExp1.id}_accuracy)`} strokeWidth={2} dot={false} name={`${selectedExp1.name} Acc.`}/>}
              {selectedExp2?.chartData && <Line type="monotone" dataKey={`${selectedExp2.id}_accuracy`} stroke={`var(--color-${selectedExp2.id}_accuracy)`} strokeWidth={2} dot={false} name={`${selectedExp2.name} Acc.`}/>}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><LineChartIcon className="mr-2 h-5 w-5 text-primary" /> Training Performance: Loss</CardTitle>
          <CardDescription>Loss over epochs for selected experiments.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigLoss(selectedExp1, selectedExp2)} className="h-[350px] w-full">
            <LineChart data={combinedChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="epoch" type="number" allowDecimals={false}/>
              <YAxis domain={[0, 1]}/>
              <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
              <RechartsLegend content={<ChartLegendContent />} />
              {selectedExp1?.chartData && <Line type="monotone" dataKey={`${selectedExp1.id}_loss`} stroke={`var(--color-${selectedExp1.id}_loss)`} strokeWidth={2} dot={false} name={`${selectedExp1.name} Loss`} />}
              {selectedExp2?.chartData && <Line type="monotone" dataKey={`${selectedExp2.id}_loss`} stroke={`var(--color-${selectedExp2.id}_loss)`} strokeWidth={2} dot={false} name={`${selectedExp2.name} Loss`} />}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
