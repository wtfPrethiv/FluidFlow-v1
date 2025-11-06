'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterControls } from './parameter-controls';
import { GeometryEditor } from './geometry-editor';
import { PhysicsAnalysis } from './physics-analysis';
import type { Geometry, SimulationParameters, LossData } from '@/lib/types';
import { SlidersHorizontal, LayoutGrid, TestTube2 } from 'lucide-react';

type ControlPanelProps = {
  parameters: SimulationParameters;
  setParameters: (params: SimulationParameters) => void;
  geometry: Geometry;
  setGeometry: (geom: Geometry) => void;
  lossData: LossData;
  handleGenerate: () => Promise<void>;
  handleAnalyze: () => Promise<void>;
  analysis: string | null;
  isAnalyzing: boolean;
};

export function ControlPanel({
  parameters,
  setParameters,
  geometry,
  setGeometry,
  lossData,
  handleGenerate,
  handleAnalyze,
  analysis,
  isAnalyzing,
}: ControlPanelProps) {
  return (
    <Tabs defaultValue="parameters" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="parameters">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Parameters
        </TabsTrigger>
        <TabsTrigger value="geometry">
          <LayoutGrid className="mr-2 h-4 w-4" />
          Geometry
        </TabsTrigger>
        <TabsTrigger value="analysis">
          <TestTube2 className="mr-2 h-4 w-4" />
          Analysis
        </TabsTrigger>
      </TabsList>
      <TabsContent value="parameters" className="mt-4">
        <ParameterControls
          parameters={parameters}
          setParameters={setParameters}
          handleGenerate={handleGenerate}
        />
      </TabsContent>
      <TabsContent value="geometry" className="mt-4">
        <GeometryEditor geometry={geometry} setGeometry={setGeometry} />
      </TabsContent>
      <TabsContent value="analysis" className="mt-4">
        <PhysicsAnalysis
          lossData={lossData}
          handleAnalyze={handleAnalyze}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          parameters={parameters}
        />
      </TabsContent>
    </Tabs>
  );
}
