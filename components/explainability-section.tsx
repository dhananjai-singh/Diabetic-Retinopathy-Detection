"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"

interface ExplainabilitySectionProps {
  originalImage: string | null
  gradcamUrl: string
}

export function ExplainabilitySection({ originalImage, gradcamUrl }: ExplainabilitySectionProps) {
  const [showHeatmap, setShowHeatmap] = useState(true)

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Model Explainability (Grad-CAM)</CardTitle>
            <CardDescription>Visual explanation of the AI model's decision-making process</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="heatmap-toggle" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
            <Label htmlFor="heatmap-toggle" className="text-sm font-medium">
              {showHeatmap ? "Hide" : "Show"} Heatmap
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Original Image */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Original Retinal Image</h3>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              {originalImage && (
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="Original retinal fundus"
                  className="h-auto w-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Grad-CAM Heatmap */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Grad-CAM Heatmap Overlay</h3>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              {showHeatmap ? (
                <img
                  src={gradcamUrl || "/placeholder.svg"}
                  alt="Grad-CAM heatmap"
                  className="h-auto w-full object-contain"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
                  Heatmap hidden
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 rounded-lg border border-medical-secondary/20 bg-medical-secondary/5 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-medical-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Understanding the Heatmap</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                The highlighted regions (warmer colors) indicate areas of the retinal image that the deep learning model
                focused on while making its prediction. These areas typically correspond to lesions, microaneurysms,
                hemorrhages, or other pathological features associated with diabetic retinopathy.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
