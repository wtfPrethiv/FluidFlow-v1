'use client';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { SimulationView } from '@/components/simulation/simulation-view';
import { ControlPanel } from '@/components/controls/control-panel';
import { handleGenerateFlow, handleExplainDiscrepancies } from '@/app/actions';
import type { Geometry, LossData, SimulationParameters, SimulationImages } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  DEFAULT_SIMULATION_PARAMETERS,
  MOCK_LOSS_DATA,
  GRID_WIDTH,
  GRID_HEIGHT,
  createInitialGeometry,
} from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const { toast } = useToast();
  const [parameters, setParameters] = useState<SimulationParameters>(DEFAULT_SIMULATION_PARAMETERS);
  const [geometry, setGeometry] = useState<Geometry>(() => createInitialGeometry(GRID_WIDTH, GRID_HEIGHT));
  const [lossData] = useState<LossData>(MOCK_LOSS_DATA);
  const [simulationImages, setSimulationImages] = useState<SimulationImages>({ streamline: null, pressure: null });
  const [analysis, setAnalysis] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onGenerate = async () => {
    setIsGenerating(true);
    setSimulationImages({ streamline: null, pressure: null });
    setAnalysis(null);
    const result = await handleGenerateFlow(parameters);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error,
      });
    } else if (result.data) {
      setSimulationImages(result.data);
      toast({
        title: 'Success!',
        description: 'Flow generated from your API.',
      });
    }
    setIsGenerating(false);
  };

  const onAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    const result = await handleExplainDiscrepancies({
      simulationParameters: parameters,
      geometry,
    });
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    } else if (result.data) {
      setAnalysis(result.data);
    }
    setIsAnalyzing(false);
  };

  return (
    <main className="flex h-dvh w-full flex-col lg:flex-row bg-background text-foreground">
      <div className="flex-1 p-4 lg:p-6 lg:order-2 flex flex-col">
        <SimulationView isLoading={isGenerating} simulationImages={simulationImages} />
      </div>
      <div className="w-full lg:w-[480px] lg:max-w-md xl:w-[520px] xl:max-w-xl shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-card lg:order-1 overflow-hidden">
        <div className="p-4 lg:p-6 flex-1 flex flex-col min-h-0">
          <Header />
          <ScrollArea className="flex-1 -mr-6 pr-6">
            <ControlPanel
              parameters={parameters}
              setParameters={setParameters}
              geometry={geometry}
              setGeometry={setGeometry}
              lossData={lossData}
              handleGenerate={onGenerate}
              handleAnalyze={onAnalyze}
              analysis={analysis}
              isAnalyzing={isAnalyzing}
            />
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
