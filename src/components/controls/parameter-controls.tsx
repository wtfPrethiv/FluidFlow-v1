'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { SimulationParameters } from '@/lib/types';
import { Waves, Droplets, Weight, Sparkles, HelpCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin mr-2"><path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"/><path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"/></svg>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flow
              </>
            )}
        </Button>
    );
}

type ParameterControlsProps = {
  parameters: SimulationParameters;
  setParameters: (params: SimulationParameters) => void;
  handleGenerate: () => Promise<void>;
};

export function ParameterControls({ parameters, setParameters, handleGenerate }: ParameterControlsProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Parameters</CardTitle>
        <CardDescription>
          Adjust fluid properties and generate the initial state.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
            <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="reynolds" className="flex items-center gap-2">
                            <Waves className="h-4 w-4 text-muted-foreground" />
                            Reynolds Number (Re)
                        </Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="text-center">
                                <p className="font-bold mb-2">Flow Regimes by Reynolds Number (Re)</p>
                                <ul className="text-left list-disc list-inside space-y-1">
                                    <li><span className="font-semibold">Re &lt; 40:</span> Laminar (smooth flow)</li>
                                    <li><span className="font-semibold">Re 40-100:</span> Flow separation</li>
                                    <li><span className="font-semibold">Re 100-400:</span> Vortex shedding (oscillating)</li>
                                    <li><span className="font-semibold">Re &gt; 400:</span> Turbulent</li>
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                <div className="flex items-center gap-4">
                    <Slider
                    id="reynolds"
                    min={0}
                    max={1000}
                    step={10}
                    value={[parameters.reynoldsNumber]}
                    onValueChange={(value) =>
                        setParameters({ ...parameters, reynoldsNumber: value[0] })
                    }
                    className="w-full"
                    />
                    <Input
                    type="number"
                    value={parameters.reynoldsNumber}
                    onChange={(e) =>
                        setParameters({ ...parameters, reynoldsNumber: Number(e.target.value) })
                    }
                    className="w-24"
                    />
                </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="viscosity" className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            Kinematic Viscosity (ν)
                        </Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="text-center">
                                <p className="font-bold mb-2">Common Kinematic Viscosities (m²/s)</p>
                                <ul className="text-left list-disc list-inside space-y-1">
                                    <li><span className="font-semibold">Water:</span> 1e-6 (0.000001)</li>
                                    <li><span className="font-semibold">Air:</span> 1.5e-5 (0.000015)</li>
                                    <li><span className="font-semibold">Oil:</span> 1e-4 (0.0001)</li>
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-4">
                        <Slider
                        id="viscosity"
                        min={0.00001}
                        max={0.001}
                        step={0.00001}
                        value={[parameters.kinematicViscosity]}
                        onValueChange={(value) =>
                            setParameters({ ...parameters, kinematicViscosity: value[0] })
                        }
                        className="w-full"
                        />
                        <Input
                        type="number"
                        value={parameters.kinematicViscosity}
                        onChange={(e) =>
                            setParameters({ ...parameters, kinematicViscosity: Number(e.target.value) })
                        }
                        className="w-24"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="density" className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-muted-foreground" />
                            Fluid Density (ρ)
                        </Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="max-w-xs text-center">
                                <p className="font-bold mb-2">Common Fluid Densities (kg/m³)</p>
                                <ul className="text-left list-disc list-inside space-y-1">
                                    <li><span className="font-semibold">Water:</span> ~1000</li>
                                    <li><span className="font-semibold">Air:</span> ~1.2</li>
                                    <li><span className="font-semibold">Oil:</span> ~900</li>
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-4">
                        <Slider
                        id="density"
                        min={0.1}
                        max={1200.0}
                        step={0.1}
                        value={[parameters.fluidDensity]}
                        onValueChange={(value) =>
                            setParameters({ ...parameters, fluidDensity: value[0] })
                        }
                        className="w-full"
                        />
                        <Input
                        type="number"
                        value={parameters.fluidDensity}
                        onChange={(e) =>
                            setParameters({ ...parameters, fluidDensity: Number(e.target.value) })
                        }
                        className="w-24"
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="prompt">
                    Initial State Prompt
                </Label>
                <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="e.g., 'A vortex spinning in the center of the domain' or 'Laminar flow from left to right'"
                    className="min-h-[100px] resize-y"
                    disabled
                />
                <p className="text-xs text-muted-foreground">Describe the initial conditions for the simulation. The AI will generate a visual representation.</p>
            </div>
             <Button onClick={handleGenerate} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flow
            </Button>
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
