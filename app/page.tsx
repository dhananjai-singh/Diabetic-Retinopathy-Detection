"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Info, Activity } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { PredictionResults } from "@/components/prediction-results"
import { Progress } from "@/components/ui/progress"

export default function DiabeticRetinopathyDashboard() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [predictionResults, setPredictionResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setPredictionResults(null)
    setShowResults(false)
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setShowResults(false)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate API call - Replace with actual API endpoint
    setTimeout(() => {
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      const mockResults = {
        stage: 2,
        stageName: "Moderate NPDR",
        confidence: 87.5,
        riskLevel: "medium",
        gradcamUrl: "/medical-heatmap-gradcam.jpg",
      }

      setPredictionResults(mockResults)

      setTimeout(() => {
        setIsAnalyzing(false)
        setShowResults(true)
      }, 500)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-primary">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Diabetic Retinopathy Detection</h1>
                <p className="text-xs text-muted-foreground">
                  AI-assisted retinal screening with explainable deep learning
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-medical-primary/30 text-medical-primary">
              <Info className="mr-1 h-3 w-3" />
              Medical Disclaimer
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-700 ${showResults ? "grid gap-8 lg:grid-cols-2 items-start" : "flex items-center justify-center min-h-[calc(100vh-200px)]"}`}
        >
          <div className={`transition-all duration-700 ${showResults ? "animate-slide-up" : "w-full max-w-2xl"}`}>
            <ImageUpload
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
              showResults={showResults}
              gradcamUrl={predictionResults?.gradcamUrl}
            />

            {isAnalyzing && (
              <div className="mt-6 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Analyzing retinal image...</span>
                  <span className="font-semibold text-medical-primary">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {analysisProgress < 40 && "Preprocessing image..."}
                  {analysisProgress >= 40 && analysisProgress < 70 && "Running deep learning model..."}
                  {analysisProgress >= 70 && analysisProgress < 100 && "Generating explainability map..."}
                  {analysisProgress === 100 && "Analysis complete!"}
                </p>
              </div>
            )}
          </div>

          {showResults && (
            <div className="animate-slide-up-right">
              <PredictionResults results={predictionResults} isAnalyzing={false} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              Medical AI Research Project • Not for clinical use without validation
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Deep Learning
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Explainable AI
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Medical Imaging
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
