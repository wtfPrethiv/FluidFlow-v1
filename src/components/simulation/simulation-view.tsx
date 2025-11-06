'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SimulationImages, SimulationViewType } from '@/lib/types';


type SimulationViewProps = {
  simulationImages: SimulationImages;
  isLoading: boolean;
};

export function SimulationView({ simulationImages, isLoading }: SimulationViewProps) {
  const [activeView, setActiveView] = useState<SimulationViewType>('streamline');
  const imageUrl = simulationImages[activeView];

  return (
    <div className="flex flex-col h-full gap-4">
      {simulationImages.streamline && simulationImages.pressure && !isLoading && (
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as SimulationViewType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="streamline">Streamline</TabsTrigger>
                <TabsTrigger value="pressure">Pressure</TabsTrigger>
            </TabsList>
        </Tabs>
      )}
      <Card className="h-full w-full overflow-hidden border-border shadow-lg flex-1">
        <CardContent className="relative h-full w-full p-0">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <div className="flex flex-col items-center gap-4 text-primary">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin"><path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"/><path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"/></svg>
                  <p className="font-semibold">PINN is generating flow fields...</p>
              </div>
            </div>
          )}
          {!isLoading && !imageUrl && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <BrainCircuit className="h-16 w-16" />
                <p className="max-w-xs text-center font-medium">
                  Define your simulation parameters and generate initial conditions to begin.
                </p>
              </div>
            </div>
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${activeView} simulation`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-muted/20" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
