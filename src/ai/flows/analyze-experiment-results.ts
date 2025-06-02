'use server';

/**
 * @fileOverview An AI agent for analyzing experiment results.
 *
 * - analyzeExperimentResults - A function that handles the experiment results analysis process.
 * - AnalyzeExperimentResultsInput - The input type for the analyzeExperimentResults function.
 * - AnalyzeExperimentResultsOutput - The return type for the analyzeExperimentResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeExperimentResultsInputSchema = z.object({
  experimentResults: z
    .string()
    .describe(
      'The experiment results data, including metrics and any relevant visualizations.'
    ),
  query: z.string().describe('The specific question or analysis request.'),
});
export type AnalyzeExperimentResultsInput = z.infer<typeof AnalyzeExperimentResultsInputSchema>;

const AnalyzeExperimentResultsOutputSchema = z.object({
  analysis: z.string().describe('The AI analysis of the experiment results.'),
  insights: z.string().describe('Key insights and suggestions for improvement.'),
  statisticalSignificance: z
    .string()
    .describe('Assessment of the statistical significance of the results.'),
  robustnessAssessment: z
    .string()
    .describe('Assessment of the robustness of the model.'),
});
export type AnalyzeExperimentResultsOutput = z.infer<typeof AnalyzeExperimentResultsOutputSchema>;

export async function analyzeExperimentResults(
  input: AnalyzeExperimentResultsInput
): Promise<AnalyzeExperimentResultsOutput> {
  return analyzeExperimentResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeExperimentResultsPrompt',
  input: {schema: AnalyzeExperimentResultsInputSchema},
  output: {schema: AnalyzeExperimentResultsOutputSchema},
  prompt: `You are an expert data scientist specializing in analyzing machine learning experiment results.

You will use the provided experiment results data and the user's query to provide a comprehensive analysis.
Include an assessment of the statistical significance and robustness of the results.  Provide key insights and suggestions for improvement.

Experiment Results:
{{{experimentResults}}}

Query: {{{query}}}`,
});

const analyzeExperimentResultsFlow = ai.defineFlow(
  {
    name: 'analyzeExperimentResultsFlow',
    inputSchema: AnalyzeExperimentResultsInputSchema,
    outputSchema: AnalyzeExperimentResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
