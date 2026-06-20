# AquaPredict: AI-Based Water Quality Prediction System 

AquaPredict AI is an enterprise-grade, multi-tier environmental engineering software system designed to predict, monitor, and catalog water quality metrics in real-time.

Operating at the intersection of full-stack software architecture and supervised machine learning, the platform uncovers intricate, non-linear chemical and sensory correlations within a given water matrix to assess potability and identify public health hazards instantly.

---

## Repository Architecture (Monorepo)

This project is organized as a decoupled, loosely coupled multi-tier ecosystem to enforce structural security, high horizontal scalability, and a strict separation of concerns.

```text
water-quality-prediction/
├── water-ml/                # Python Machine Learning API (FastAPI) & Preprocessing Pipeline
├── water-quality-ui/        # Vite + React Frontend Dashboard Layer
└── WaterTemp-main/          # Spring Boot Enterprise Backend Middleware & Gateway
```

---

## Dataset & Pre-trained Model Setup

To maintain a lightweight and optimized code repository, large data and binary model files are managed externally via version control exclusions.

### Download Pre-trained Model (.pkl)

Download the trained model file and place it inside:

```text
water-ml/su_kalite_modeli_2.pkl
```
https://drive.google.com/drive/folders/1hyrjloigMP-QdNd16hCC49XeSNzQFupC?usp=drive_link
---

## Microservices Architecture

### 1. Machine Learning Core Layer (`water-ml`)

**Core Stack**

* Python
* FastAPI
* Scikit-Learn
* Imbalanced-Learn (SMOTE)
* Pydantic
* Joblib

**Data Pipeline**

Automatically removes transient temporal and climatic variables:

* Water Temperature
* Air Temperature
* Month
* Day
* Time of Day

This ensures the model focuses exclusively on true water chemistry characteristics using:

* 15 numerical features
* 2 categorical features

**Algorithmic Framework**

* RandomForestClassifier
* SMOTE balancing during training
* Decision threshold coefficient: `0.35`

---

### 2. Service Gateway Middleware Layer (`WaterTemp-main`)

**Core Stack**

* Java
* Spring Boot
* Spring Data JPA
* Jackson
* H2 Database

**Responsibilities**

* Data routing
* ORM management
* Telemetry storage
* Inter-service communication via RestTemplate
* Global exception handling

---

### 3. Presentation Layer (`water-quality-ui`)

**Core Stack**

* React
* Vite
* Tailwind CSS

**Features**

* Dark-themed dashboard
* Manual parameter entry panel
* Drag-and-drop JSON upload
* Real-time prediction visualization
* Dynamic circular gauges
* Color-coded risk indicators

---

## Local Installation & Setup

Run all three services in separate terminal windows.

### Prerequisites

* Python 3.10+
* Java JDK 17+
* Node.js 18+

---

### Phase 1: Machine Learning API (`water-ml`)

```bash
cd water-ml

python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn app:app --reload --port 8000
```

FastAPI Swagger UI:

```text
http://localhost:8000/docs
```

---

### Phase 2: Enterprise Backend Gateway (`WaterTemp-main`)

```bash
cd WaterTemp-main

# Windows
mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

Spring Boot starts on:

```text
http://localhost:8080
```

---

### Phase 3: Presentation Dashboard (`water-quality-ui`)

```bash
cd water-quality-ui

npm install
npm run dev
```

Dashboard URL:

```text
http://localhost:5173
```

---

## 📈 Model Verification Metrics

The optimized ImbPipeline was evaluated using an independent 20% validation split.

### Performance Results

| Class     | Precision | Recall | F1-Score |
| --------- | --------- | ------ | -------- |
| Safe (0)  | 0.98      | 0.84   | 0.91     |
| Risky (1) | 0.64      | 0.95   | 0.76     |

### Overall Metrics

* Accuracy: **87%**
* Hazard Recall: **95%**

### Most Influential Features

* Manganese
* Color
* pH
* Chloride

---

## 👥 Contributors

### Istanbul Aydın University – Computer Engineering

* Çağan Eren Gözel (B2205.010071)
* Yusuf Develi (B2105.010061)
* Oğuz Yavçın (B2205.010072)

---

## License

Distributed under the MIT License.
