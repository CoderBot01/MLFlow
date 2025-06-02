export interface Model {
  id: string;
  name: string;
  version: string;
  status: "Development" | "Staging" | "Production" | "Archived";
  deploymentDate: string;
  description: string;
  metrics?: Record<string, number>;
}

export interface Experiment {
  id: string;
  name: string;
  date: string;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1?: number;
    loss?: number;
    [key: string]: number | undefined;
  };
  params: Record<string, string | number>;
  chartData?: { epoch: number; loss?: number; accuracy?: number; [key: string]: number | undefined }[];
}

export interface KpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}
