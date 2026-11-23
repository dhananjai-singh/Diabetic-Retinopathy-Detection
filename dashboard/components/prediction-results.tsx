"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface PredictionResultsProps {
  results: {
    stage: number
    stageName: string
    confidence: number
    riskLevel: "low" | "medium" | "high"
  } | null
  isAnalyzing: boolean
}

const stageInfo = {
  0: { name: "No DR", color: "text-medical-success", bgColor: "bg-medical-success/10", icon: CheckCircle },
  1: { name: "Mild NPDR", color: "text-medical-warning", bgColor: "bg-medical-warning/10", icon: AlertCircle },
  2: { name: "Moderate NPDR", color: "text-medical-warning", bgColor: "bg-medical-warning/10", icon: AlertCircle },
  3: { name: "Severe NPDR", color: "text-medical-danger", bgColor: "bg-medical-danger/10", icon: AlertTriangle },
  4: { name: "Proliferative DR", color: "text-medical-danger", bgColor: "bg-medical-danger/10", icon: AlertTriangle },
}

const riskBadgeConfig = {
  low: { label: "Low Risk", className: "bg-medical-success/10 text-medical-success border-medical-success/30" },
  medium: { label: "Medium Risk", className: "bg-medical-warning/10 text-medical-warning border-medical-warning/30" },
  high: { label: "High Risk", className: "bg-medical-danger/10 text-medical-danger border-medical-danger/30" },
}

export function PredictionResults({ results, isAnalyzing }: PredictionResultsProps) {
  if (isAnalyzing) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Analysis Results</CardTitle>
          <CardDescription>AI model prediction and classification</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-medical-primary/20 border-t-medical-primary" />
            <p className="text-sm text-muted-foreground">Analyzing retinal image...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Analysis Results</CardTitle>
          <CardDescription>AI model prediction and classification</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Upload and analyze an image to see results</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stageConfig = stageInfo[results.stage as keyof typeof stageInfo]
  const Icon = stageConfig.icon
  const riskConfig = riskBadgeConfig[results.riskLevel]

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Analysis Results</CardTitle>
        <CardDescription>AI model prediction and classification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predicted Stage */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Predicted DR Stage</p>
          <div className={`flex items-center gap-3 rounded-lg p-4 ${stageConfig.bgColor}`}>
            <Icon className={`h-6 w-6 ${stageConfig.color}`} />
            <div>
              <p className={`text-lg font-semibold ${stageConfig.color}`}>Stage {results.stage}</p>
              <p className={`text-sm font-medium ${stageConfig.color}`}>{stageConfig.name}</p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Confidence Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-medical-primary">{results.confidence}%</span>
            <span className="text-sm text-muted-foreground">model certainty</span>
          </div>
        </div>

        {/* Risk Level */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Risk Assessment</p>
          <Badge variant="outline" className={`${riskConfig.className} px-3 py-1 text-sm font-medium`}>
            {riskConfig.label}
          </Badge>
        </div>

        {/* Clinical Notes */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-medium text-foreground">Clinical Note</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {results.stage === 0 && "No signs of diabetic retinopathy detected. Continue routine screening."}
            {results.stage === 1 && "Mild non-proliferative retinopathy detected. Annual follow-up recommended."}
            {results.stage === 2 && "Moderate changes observed. Consider more frequent monitoring."}
            {results.stage >= 3 && "Severe findings detected. Immediate ophthalmologist consultation recommended."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
