package org.example.watertemp.service;

import java.util.List;

import org.example.watertemp.entity.WaterQuality;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.example.watertemp.repo.WaterQualityRepo;
import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class WaterQualityServ {

    @Autowired
    private WaterQualityRepo repo;

    @Autowired
    private RestTemplate restTemplate;

    // FastAPI yerel çalışma adresi (predict endpoint'i)
    private final String PYTHON_API_URL = "http://localhost:8000/predict";

    public WaterQuality saveAndPredict(WaterQuality waterData) {
        try {
            // 1. Spring RestTemplate ile Python FastAPI'ye POST isteği gönderiyoruz.
            // waterData nesnesi gönderilirken "Total Dissolved Solids" anotasyonu sayesinde doğru isimlendirmeyle gider.
            PredictionResponse response = restTemplate.postForObject(PYTHON_API_URL, waterData, PredictionResponse.class);
            
            if (response != null) {
                // 2. Python'dan dönen veri kümesini alıp veri tabanına yazılacak nesneye setliyoruz
                waterData.setPrediction(response.getPrediction());
                waterData.setProbability0(response.getProbability0());
                waterData.setProbability1(response.getProbability1());
                waterData.setThresholdUsed(response.getThresholdUsed());
            }
        } catch (Exception e) {
            // Python API çalışmıyorsa veya ağ hatası varsa uygulamanın çökmesini engellemek için hata loglanır
            System.err.println("FastAPI Python sunucusu ile iletişim kurulurken bir hata oluştu: " + e.getMessage());
            
            // Hata durumunda jüriye/kullanıcıya bilgi vermek amacıyla varsayılan değerler atanabilir
            waterData.setPrediction(-1); // -1: Tahmin Başarısız / Sistem Çevrimdışı anlamında kullanılabilir
        }

        // 3. Verileri (ve eğer başarılıysa tahmin sonuçlarını) veritabanına kaydet
        return repo.save(waterData);
    }
public List<WaterQuality> getAllRecords() {
    return repo.findAll(); // Veritabanındaki tüm eski analizleri listeler
} }
/**
 * Python predict.py dosyasından dönen şu JSON verisini karşılayan iç DTO (Data Transfer Object) sınıfı:
 * {
 * "prediction": 0,
 * "probability_0": 0.75,
 * "probability_1": 0.25,
 * "threshold_used": 0.35
 * }
 */
class PredictionResponse {
    
    private int prediction;
    
    @JsonProperty("probability_0")
    private double probability0;
    
    @JsonProperty("probability_1")
    private double probability1;
    
    @JsonProperty("threshold_used")
    private double thresholdUsed;

    // --- GETTER VE SETTER METOTLARI ---

    public int getPrediction() { return prediction; }
    public void setPrediction(int prediction) { this.prediction = prediction; }

    public double getProbability0() { return probability0; }
    public void setProbability0(double probability0) { this.probability0 = probability0; }

    public double getProbability1() { return probability1; }
    public void setProbability1(double probability1) { this.probability1 = probability1; }

    public double getThresholdUsed() { return thresholdUsed; }
    public void setThresholdUsed(double thresholdUsed) { this.thresholdUsed = thresholdUsed; }
}