import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

# Dataset yükle
df = pd.read_csv("water quality prediction.csv")

# Gereksiz sütun kaldır
if "Index" in df.columns:
    df = df.drop(columns=["Index"])

# Eksik verileri temizle 
df = df.dropna()

# X ve y ayır (Hedef: 0: Güvenli, 1: Riskli)
X = df.drop(columns=["Target"])
y = df["Target"]

# ---- DEĞİŞİKLİK: İstenmeyen sütunları X içinden çıkarıyoruz ----
dropped_features = ["Water Temperature", "Air Temperature", "Month", "Day", "Time of Day"]
X = X.drop(columns=dropped_features, errors="ignore")

# ---- DEĞİŞİKLİK: "Month" sütununu kategorik listeden çıkardık ----
categorical_cols = [
    "Color",
    "Source"
]

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_cols
        )
    ],
    remainder="passthrough"
)

# Model
rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced" 
)

# Pipeline
pipeline = ImbPipeline([
    ("preprocessor", preprocessor),
    ("smote", SMOTE(random_state=42)), 
    ("model", rf_model)
])

# Eğitim/Test
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Eğit
pipeline.fit(
    X_train,
    y_train
)

# Tahmin
y_pred = pipeline.predict(
    X_test
)

# Sonuçlar
# ─── 1. MODEL PERFORMANS SONUÇLARI (3.3.4 Bölümü İçin) ──────────────────────

print("="*60)
print("             MODEL EVALUATION METRICS")
print("="*60)

# Genel Doğruluk Skoru (Accuracy)
acc = accuracy_score(y_test, y_pred)
print(f"Overall Accuracy: {acc:.4f}\n")

# Klasifikasyon Raporu (Precision, Recall, F1-Score)
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Karmaşıklık Matrisi (Confusion Matrix)
print("Confusion Matrix Array:")
cm = confusion_matrix(y_test, y_pred)
print(cm)
print(f"\nTrue Negatives (Safe correctly classified): {cm[0][0]}")
print(f"False Positives (Safe misclassified as Risky): {cm[0][1]}")
print(f"False Negatives (Risky misclassified as Safe): {cm[1][0]}")
print(f"True Positives (Risky correctly classified): {cm[1][1]}")
print("="*60)


# ─── 2. KEŞİFÇİ VERİ ANALİZİ - EDA (3.3.1.1 Bölümü İçin) ───────────────────

print("\n" + "="*60)
print("             EXPLORATORY DATA ANALYSIS (EDA)")
print("="*60)
print(f"Total rows (after dropna): {len(df)}")
print(f"Total features used for prediction: {X.shape[1]}")

print("\nClass Distribution in Dataset (Target):")
counts = df["Target"].value_counts()
for cls, count in counts.items():
    label = "Safe (0)" if cls == 0 else "Risky (1)"
    percentage = (count / len(df)) * 100
    print(f"  {label}: {count} samples ({percentage:.2f}%)")
print("="*60)


# ─── 3. ÖZNİTELİK ÖNEM SIRALAMASI - FEATURE IMPORTANCE ──────────────────────

print("\n" + "="*60)
print("             TOP 10 FEATURE IMPORTANCE")
print("="*60)

# Pipeline içinden preprocessor ve model adımlarını çekiyoruz
importance = pipeline.named_steps["model"].feature_importances_
features = pipeline.named_steps["preprocessor"].get_feature_names_out()

# Temiz görünmesi için "remainder__" veya "cat__" eklerini temizliyoruz
clean_features = [f.split("__")[-1] for f in features]

# En önemli ilk 10 parametreyi listeliyoruz
top_features = sorted(zip(clean_features, importance), key=lambda x: x[1], reverse=True)[:10]

for idx, (f, i) in enumerate(top_features, 1):
    print(f"{idx}. {f:<25} : {i:.4f} ({i*100:.2f}%)")
print("="*60)

# Kaydet
joblib.dump(
    pipeline,
    "su_kalite_modeli_2.pkl"
)

print("\nModel kaydedildi.")
print("\nVeri Setindeki Sınıf Dağılımı (0: Güvenli, 1: Riskli):")
print(df["Target"].value_counts())

# ─── CONFUSION MATRIX GÖRSELLEŞTİRME EKLEME ──────────────────────────────────
import matplotlib.pyplot as plt
import seaborn as sns

print("\n[INFO] Confusion Matrix grafiği oluşturuluyor...")

# 1. Karmaşıklık matrisini hesapla
cm = confusion_matrix(y_test, y_pred)

# 2. Grafik boyutunu ve kalitesini ayarla (Akademik çözünürlük: 300 DPI)
plt.figure(figsize=(6, 5), dpi=300)

# 3. Isı haritasını (Heatmap) çizdir
sns.heatmap(
    cm, 
    annot=True,          # Hücrelerin içine sayısal değerleri yaz
    fmt="d",             # Tam sayı (integer) formatında göster
    cmap="Blues",        # Proje diline uygun mavi tonları
    cbar=False,          # Yan taraftaki renk skalasını gizle
    xticklabels=["Safe (0)", "Risky (1)"], 
    yticklabels=["Safe (0)", "Risky (1)"],
    annot_kws={"size": 14, "weight": "bold"}
)

# 4. Başlıkları ve eksen etiketlerini ekle
plt.title("AquaShield AI - Confusion Matrix", fontsize=14, pad=20, weight="bold")
plt.xlabel("Predicted Class", fontsize=12, labelpad=10)
plt.ylabel("Actual Class", fontsize=12, labelpad=10)
plt.tight_layout()

# 5. Resmi proje klasörüne kaydet
plt.savefig("confusion_matrix.png", bbox_inches="tight")
plt.close()

print("[SUCCESS] 'confusion_matrix.png' başarıyla kaydedildi!")
print("="*60)