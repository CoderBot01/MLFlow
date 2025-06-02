import { ExperimentComparisonView } from "./components/experiment-comparison-view";

export default function ExperimentComparisonPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Experiment Comparison</h1>
        {/* Add any global actions for this page here if needed */}
      </div>
      <ExperimentComparisonView />
    </div>
  );
}
