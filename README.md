# Diabetic Retinopathy Detection

An end-to-end deep learning system that **detects and grades diabetic retinopathy (DR)** from retinal fundus images. It also explains its predictions with **Grad-CAM** heatmaps, so a clinician can see which parts of the retina drove the result.

Diabetic retinopathy is one of the leading causes of preventable blindness. Early detection matters, but large-scale screening is limited by how few ophthalmologists are available. This project goes from raw images to a screening tool: preprocessing, model training, explainability and a web interface.

## What's inside

| Part | Folder | What it does |
| --- | --- | --- |
| **Model** | [`model/`](model) | PyTorch pipeline: data exploration, preprocessing, a baseline CNN, a ResNet-50 transfer-learning model, Grad-CAM, and a Gradio demo app |
| **Dashboard** | [`dashboard/`](dashboard) | Next.js web dashboard for uploading images and viewing the predicted stage, confidence, risk level and Grad-CAM overlay |

## DR severity classes

| Label | Stage |
| --- | --- |
| 0 | No DR |
| 1 | Mild NPDR |
| 2 | Moderate NPDR |
| 3 | Severe NPDR |
| 4 | Proliferative DR |

## Pipeline

```
APTOS 2019 fundus images
        │
        ▼
preprocessing.py   circular crop · resize 512×512 · CLAHE contrast · normalise · 70/15/15 split → .npy
        │
        ├──▶ train_baseline_cnn.py   custom CNN from scratch (BatchNorm, Dropout, GAP, class-weighted loss)
        └──▶ train_resnet50.py       ResNet-50 (ImageNet) + 2048→512→5 head, Focal Loss for class imbalance
                │
                ▼
        gradcam.py    heatmaps on the last conv layer + attention statistics
                │
                ▼
        app.py (Gradio)  /  dashboard (Next.js)   upload → stage, confidence, clinical note, heatmap
```

### Training details

| | Baseline CNN | ResNet-50 |
| --- | --- | --- |
| Input | 512 × 512 | 512 × 512 |
| Batch size | 16 | 16 |
| Epochs | up to 50 | up to 30 |
| Learning rate | 1e-3 | 1e-4 |
| Loss | Class-weighted cross-entropy | Focal loss (γ = 2) with class weights |
| Optimizer | Adam + ReduceLROnPlateau | Adam + ReduceLROnPlateau |
| Early stopping | patience 10 | patience 10 |
| Checkpoint | `models/best_model.pth` | `models/resnet50_best.pth` |

Evaluation covers accuracy, precision, recall, F1, the confusion matrix and per-class accuracy, with particular attention to catching early-stage disease and keeping false negatives low.

## Getting started

### 1. Model

```bash
cd model
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
```

Download the [APTOS 2019 Blindness Detection](https://www.kaggle.com/competitions/aptos2019-blindness-detection/data) dataset from Kaggle, then put `train.csv` and the `train_images/` folder inside `model/`. Run the scripts in this order:

```bash
python exploration.py          # class balance, image properties, quality checks
python preprocessing.py        # → preprocessed_data/ (train/val/test splits)
python train_baseline_cnn.py   # → models/best_model.pth, results/
python train_resnet50.py       # → models/resnet50_best.pth, results/
python gradcam.py              # → results/gradcam/
```

A GPU is strongly recommended for training.

### 2. Gradio demo

```bash
cd model
python app.py
```

It loads `models/resnet50_best.pth` by default. To use weights stored somewhere else, set the `MODEL_PATH` environment variable.

### 3. Web dashboard

```bash
cd dashboard
pnpm install     # or npm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard currently returns a mock prediction. To connect it to the trained model, see [`dashboard/README.md`](dashboard/README.md).

## Repository layout

```
model/
  exploration.py          dataset exploration + plots
  preprocessing.py        cropping, CLAHE, normalisation, splits
  train_baseline_cnn.py   custom CNN
  train_resnet50.py       ResNet-50 transfer learning
  gradcam.py              Grad-CAM explainability
  app.py                  Gradio demo app
  requirements.txt
dashboard/                Next.js + Tailwind + shadcn/ui front end
```

The dataset, trained weights (`*.pth`) and generated results are not committed because of their size.

## Tech stack

PyTorch · torchvision · OpenCV · scikit-learn · Gradio · Next.js · Tailwind CSS · shadcn/ui

## Ethics and limitations

- Predictions are based on the image alone. No demographic data is used as model input.
- The system is meant to **assist** clinicians, not replace them.
- Future work: EfficientNet backbones, cross-dataset testing (IDRiD), better sensitivity for early-stage disease, and studies of where humans and the model disagree.

## Disclaimer

This is a research and educational project, **not a medical device**. Do not use it for clinical diagnosis without professional supervision.
