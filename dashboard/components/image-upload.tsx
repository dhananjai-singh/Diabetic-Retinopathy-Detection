"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  uploadedImage: string | null
  isAnalyzing: boolean
  onAnalyze: () => void
  showResults: boolean
  gradcamUrl?: string
}

export function ImageUpload({
  onImageUpload,
  uploadedImage,
  isAnalyzing,
  onAnalyze,
  showResults,
  gradcamUrl,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          onImageUpload(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImageUpload(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (showResults && gradcamUrl) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Grad-CAM Heatmap</CardTitle>
              <CardDescription>Model attention visualization</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onImageUpload("")} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={gradcamUrl || "/placeholder.svg"}
              alt="Grad-CAM heatmap"
              className="h-auto w-full max-h-[500px] object-contain"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("transition-all duration-500", showResults && "opacity-0")}>
      <CardHeader>
        <CardTitle className="text-lg">Upload Retinal Image</CardTitle>
        <CardDescription>Upload a fundus photograph for diabetic retinopathy analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            isDragging
              ? "border-medical-primary bg-medical-primary/5"
              : "border-border bg-muted/30 hover:border-medical-primary/50 hover:bg-muted/50",
          )}
        >
          {uploadedImage ? (
            <div className="relative h-full w-full">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Uploaded retinal fundus"
                className="h-full w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-medical-primary/10">
                <Upload className="h-8 w-8 text-medical-primary" />
              </div>
              <p className="mb-2 text-center text-sm font-medium text-foreground">Drag and drop your image here</p>
              <p className="text-center text-xs text-muted-foreground">or click to browse files</p>
              <p className="mt-2 text-center text-xs text-muted-foreground">Supported formats: JPG, PNG (max 10MB)</p>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
            </label>
          )}
        </div>

        {uploadedImage && !showResults && (
          <div className="flex gap-2">
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
            >
              {isAnalyzing ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Analyze Image
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onImageUpload("")} disabled={isAnalyzing}>
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
