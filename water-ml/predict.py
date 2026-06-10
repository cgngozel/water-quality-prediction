import pandas as pd
import joblib

model = joblib.load(
    "su_kalite_modeli_2.pkl"
)

def predict_water(data):
    df = pd.DataFrame([data])

    # Sadece olasılıkları alıyoruz
    probability = model.predict_proba(df)
    
    prob_0 = float(probability[0][0])
    prob_1 = float(probability[0][1])

    # Manuel Karar Eşiği
    custom_threshold = 0.35
    custom_prediction = 1 if prob_1 >= custom_threshold else 0

    print("Prediction:", custom_prediction)
    print("Probability:", probability[0])

    return {
        "prediction": custom_prediction,
        "probability_0": prob_0,
        "probability_1": prob_1,
        "threshold_used": custom_threshold
    }

# Feature importance kısmı
importance = model.named_steps[
    "model"
].feature_importances_

features = model.named_steps[
    "preprocessor"
].get_feature_names_out()

for f, i in sorted(
    zip(features, importance),
    key=lambda x: x[1],
    reverse=True
)[:15]:
    print(f, i)