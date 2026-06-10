from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <-- EKLE
from pydantic import BaseModel, Field
from predict import predict_water

app = FastAPI()

# Spring Boot veya React'ın doğrudan erişebilmesi için CORS izinleri
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Güvenlik için buraya sadece Spring'in adresini de yazabilirsiniz (örn: "http://localhost:8080")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Gelen verinin şemasını ve sınırlarını tanımlıyoruz (Validation)
# DEĞİŞİKLİK: Water_Temperature, Air_Temperature, Month, Day, Time_of_Day alanları kaldırıldı.
class WaterQualityInput(BaseModel):
    pH: float = Field(..., ge=0.0, le=14.0, description="pH değeri 0-14 arasında olmalı")
    Iron: float = Field(..., ge=0.0)
    Nitrate: float = Field(..., ge=0.0)
    Chloride: float = Field(..., ge=0.0)
    Lead: float = Field(..., ge=0.0)
    Zinc: float = Field(..., ge=0.0)
    Color: str = Field(..., description="Colorless, Near Colorless, Faint Yellow vb.")
    Turbidity: float = Field(..., ge=0.0)
    Fluoride: float = Field(..., ge=0.0)
    Copper: float = Field(..., ge=0.0)
    Odor: float = Field(..., ge=0.0)
    Sulfate: float = Field(..., ge=0.0)
    Conductivity: float = Field(..., ge=0.0)
    Chlorine: float = Field(..., ge=0.0)
    Manganese: float = Field(..., ge=0.0)
    Total_Dissolved_Solids: float = Field(..., ge=0.0, alias="Total Dissolved Solids")
    Source: str

    class Config:
        populate_by_name = True

@app.post("/predict")
def predict(data: WaterQualityInput): 
    try:
        # Pydantic nesnesini predict_water fonksiyonunun beklediği sözlük (dict) formatına çeviriyoruz
        input_dict = data.model_dump(by_alias=True)
        
        result = predict_water(input_dict)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))