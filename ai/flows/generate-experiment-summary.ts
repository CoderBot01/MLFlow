'use server';

/**
 * @fileOverview A flow to generate summaries of experiment insights from metrics and visualizations.
 *
 * - generateExperimentSummary - A function that handles the generation of experiment summaries.
 * - GenerateExperimentSummaryInput - The input type for the generateExperimentSummary function.
 * - GenerateExperimentSummaryOutput - The return type for the generateExperimentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExperimentSummaryInputSchema = z.object({
  experimentName: z.string().describe('The name of the experiment.'),
  metrics: z.record(z.number()).describe('A record of metrics for the experiment.'),
  visualizationData: z.string().describe('Data for visualizations related to the experiment.'),
});
export type GenerateExperimentSummaryInput = z.infer<typeof GenerateExperimentSummaryInputSchema>;

const GenerateExperimentSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the experiment insights.'),
  keyFindings: z.array(z.string()).describe('Key findings from the experiment.'),
});
export type GenerateExperimentSummaryOutput = z.infer<typeof GenerateExperimentSummaryOutputSchema>;

export async function generateExperimentSummary(input: GenerateExperimentSummaryInput): Promise<GenerateExperimentSummaryOutput> {
  return generateExperimentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExperimentSummaryPrompt',
  input: {schema: GenerateExperimentSummaryInputSchema},
  output: {schema: GenerateExperimentSummaryOutputSchema},
  prompt: `You are an AI assistant helping data scientists summarize experiment results.

  Given the following experiment details, generate a concise summary of the experiment insights and highlight the key findings.

  Experiment Name: {{{experimentName}}}
  Metrics: {{{metrics}}}
  Visualization Data: {{{visualizationData}}}

  Summary:
  Key Findings:`, // Ensure the LLM outputs a summary and key findings
});

const generateExperimentSummaryFlow = ai.defineFlow(
  {
    name: 'generateExperimentSummaryFlow',
    inputSchema: GenerateExperimentSummaryInputSchema,
    outputSchema: GenerateExperimentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
