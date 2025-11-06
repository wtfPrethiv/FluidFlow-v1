'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { LossData, SimulationParameters } from '@/lib/types';
import { Beaker, BrainCircuit, Server } from 'lucide-react';

type PhysicsAnalysisProps = {
  lossData: LossData;
  handleAnalyze: () => Promise<void>;
  analysis: string | null;
  isAnalyzing: boolean;
  parameters: SimulationParameters;
};

export function PhysicsAnalysis({
  lossData,
  handleAnalyze,
  analysis,
  isAnalyzing,
  parameters,
}: PhysicsAnalysisProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Physics-Informed Losses</CardTitle>
          <CardDescription>
            Live metrics from the PINN's physics loss functions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {Object.entries(lossData).map(([key, value]) => (
              <li key={key} className="flex justify-between items-center rounded-md bg-muted/50 p-2">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-mono font-medium text-foreground">{value.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin mr-2"><path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"/><path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"/></svg>
                Analyzing...
              </>
            ) : (
                <>
                    <Beaker className="mr-2 h-4 w-4" />
                    Explain Discrepancies with AI
                </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isAnalyzing && (
        <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <CardTitle>AI Analysis in Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
      )}

      {analysis && !isAnalyzing && (
        <Alert>
            <BrainCircuit className="h-4 w-4" />
            <AlertTitle>AI-Powered Explanation</AlertTitle>
            <AlertDescription className="prose prose-sm prose-invert max-w-none">
                <p>{analysis}</p>
            </AlertDescription>
        </Alert>
      )}
      
      {parameters.reynoldsNumber === 50 && (
         <Alert variant="destructive">
            <Server className="h-4 w-4" />
            <AlertTitle>Backend Status</AlertTitle>
            <AlertDescription>
              Retrieved from backend
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
