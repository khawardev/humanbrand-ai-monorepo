"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check, X, Play, FastForward, Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const agents = [
    { id: "agent1", name: "Brand Perception" },
    { id: "agent2", name: "Social Media Audit" },
    { id: "agent3", name: "Website Audit" },
    { id: "agent4", name: "Earned Media Analysis" },
    { id: "agent5", name: "Synthesized Report" },
];

const sampleOutputs = {
    agent1: "This is the output from the Brand Perception agent. It includes analysis of customer sentiment and brand positioning.",
    agent2: "This is the output from the Social Media Audit agent. It covers engagement metrics, content performance, and audience demographics.",
    agent3: "This is the output from the Website Audit agent, focusing on SEO, user experience, and conversion rates.",
    agent4: "This is the output from the Earned Media Analysis agent, tracking mentions, press coverage, and backlinks.",
    agent5: "This is the final Synthesized Report, combining insights from all previous agents into a comprehensive overview.",
};

type ExecutionMode = "interactive" | "independent" | "sequential";

export default function BvoExecution({ bvo }: { bvo: { id: string; name: string; executionMode: string } }) {
    const [mode, setMode] = useState<ExecutionMode>(bvo.executionMode as ExecutionMode);
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const handleToggleAgent = (agentId: string) => {
        setSelectedAgents(prev =>
            prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
        );
    };

    const handleStartExecution = () => {
        setIsRunning(true);
        setCurrentStep(0);
        setIsFinished(false);
    };

    const handleNext = () => {
        if (currentStep < agents.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsFinished(true);
            setIsRunning(false);
        }
    };

    const handleEnd = () => {
        setIsFinished(true);
        setIsRunning(false);
    }

    const renderExecutionControls = () => (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Execution Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Current mode: <strong>{mode}</strong></p>
                    {/* <Button asChild variant="outline">
                        <Link href="/dashboard/bam/new">
                            <Plus className="h-4 w-4 " />
                            Create New BAM
                        </Link>
                    </Button> */}
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Execution Mode</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={mode} onValueChange={(value) => setMode(value as ExecutionMode)} className="mb-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="interactive" id="interactive" />
                            <Label htmlFor="interactive">Interactive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="independent" id="independent" />
                            <Label htmlFor="independent">Run Selected Agent Independently</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sequential" id="sequential" />
                            <Label htmlFor="sequential">Run Full Pipeline Sequentially</Label>
                        </div>
                    </RadioGroup>

                    {mode === 'independent' && (
                        <div className="space-y-2 mt-4">
                            <h4 className="font-medium">Select agents to run:</h4>
                            {agents.map(agent => (
                                <div key={agent.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={agent.id}
                                        checked={selectedAgents.includes(agent.id)}
                                        onCheckedChange={() => handleToggleAgent(agent.id)}
                                    />
                                    <Label htmlFor={agent.id}>{agent.name}</Label>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button onClick={handleStartExecution} className="mt-4">
                        {mode === 'interactive' ? <Play className="h-4 w-4 " /> : <FastForward className="h-4 w-4 " />}
                        Start Execution
                    </Button>
                </CardContent>
            </Card>
        </>
    );

    const renderInteractiveMode = () => {
        if (isFinished) return renderFinishedCard();
        const currentAgent:any = agents[currentStep];
        const output = sampleOutputs[currentAgent.id as keyof typeof sampleOutputs];
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Step {currentStep + 1}: {currentAgent.name}</CardTitle>
                        <Badge variant="outline">In Progress</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                        <p>{output}</p>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleNext}>
                            <Check className="h-4 w-4 " />
                            Accept & Next
                        </Button>
                        <Button variant="outline">
                            <Download className="h-4 w-4 " />
                            Download PDF
                        </Button>
                        <Button variant="destructive" onClick={handleEnd}>
                            <X className="h-4 w-4 " />
                            End and Finalize
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderIndependentMode = () => (
        <div className="space-y-6">
            {selectedAgents.map(agentId => {
                const agent = agents.find(a => a.id === agentId);
                if (!agent) return null;
                const output = sampleOutputs[agent.id as keyof typeof sampleOutputs];
                return (
                    <Card key={agent.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{agent.name}</CardTitle>
                                <Badge variant="secondary">Completed</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{output}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );

    const renderSequentialMode = () => (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Full Pipeline Execution</CardTitle>
                    <Badge color="green">Completed</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {agents.map(agent => {
                    const output = sampleOutputs[agent.id as keyof typeof sampleOutputs];
                    return (
                        <div key={agent.id}>
                            <h3 className="font-semibold text-lg">{agent.name}</h3>
                            <p className="text-muted-foreground">{output}</p>
                            <Separator className="my-4" />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );

    const renderFinishedCard = () => (
        <Card>
            <CardHeader>
                <CardTitle>Execution Finished</CardTitle>
            </CardHeader>
            <CardContent>
                <p>The BVO execution has been finalized. You can download the final report.</p>
                <Button className="mt-4">
                    <Download className="h-4 w-4 " />
                    Download Final Report
                </Button>
            </CardContent>
        </Card>
    );

    const renderExecutionContent = () => {
        if (!isRunning) return null;
        if (isFinished) return renderFinishedCard();

        switch (mode) {
            case "interactive":
                return renderInteractiveMode();
            case "independent":
                return renderIndependentMode();
            case "sequential":
                return renderSequentialMode();
            default:
                return <p>Select an execution mode to start.</p>;
        }
    };

    return (
        <div>
            {renderExecutionControls()}
            {renderExecutionContent()}
        </div>
    );
}
