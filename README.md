# Diabetic Retinopathy Detection Dashboard

A web dashboard for **AI-assisted diabetic retinopathy (DR) screening**. A clinician uploads a retinal fundus image, the app runs it through a classifier, and the result shows the predicted DR stage, the model's confidence and a risk level. It also shows a **Grad-CAM heatmap** that highlights which regions of the retina drove the prediction.

> **Status:** this repository is the front end. Analysis currently returns a **mock prediction** so the full flow can be demoed. Connect it to a real model API to use it for actual screening (see below).

## Features

- Drag-and-drop or click-to-upload for retinal images (JPG/PNG)
- Animated analysis progress
- Results card: DR stage (0 to 4), stage name, confidence and a colour-coded risk badge (low / medium / high)
- **Explainability**: a Grad-CAM heatmap overlay with a short explanation of how to read it
- Responsive, accessible UI with light/dark theme support

### DR stages

| Stage | Name |
| --- | --- |
| 0 | No DR |
| 1 | Mild NPDR |
| 2 | Moderate NPDR |
| 3 | Severe NPDR |
| 4 | Proliferative DR |

*NPDR = non-proliferative diabetic retinopathy.*

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com) components (Radix UI) + lucide-react icons

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) (or npm / yarn)

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # lint
```

## Connecting a real model

The mock call is in `handleAnalyze` in `app/page.tsx`. Replace the `setTimeout` block with a request to your inference service. It should return:

```ts
{
  stage: number          // 0–4
  stageName: string      // e.g. "Moderate NPDR"
  confidence: number     // 0–100
  riskLevel: "low" | "medium" | "high"
  gradcamUrl: string     // URL or data URI of the Grad-CAM overlay
}
```

A typical backend is a CNN (e.g. EfficientNet or ResNet) trained on a public fundus dataset such as APTOS 2019 or EyePACS, served with FastAPI or Flask, with Grad-CAM generated from the final convolutional layer.

## Project structure

```
app/                     Layout, global styles and the dashboard page
components/
  image-upload.tsx       Upload area + heatmap view
  prediction-results.tsx Stage / confidence / risk card
  explainability-section.tsx  Grad-CAM explanation
  ui/                    shadcn/ui components
hooks/  lib/             Small utilities
public/                  Icons and the sample Grad-CAM image
```

## Disclaimer

This is a research and educational project, **not a medical device**. Its output must not be used for diagnosis. Always consult a qualified ophthalmologist.
