package org.example.watertemp.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "water_quality")
public class WaterQuality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Python şemasındaki büyük/küçük harflere duyarlı olarak alanları eşliyoruz
    @Column(name = "ph")
    private Double pH;

    @Column(name = "iron")
    private Double Iron;

    @Column(name = "nitrate")
    private Double Nitrate;

    @Column(name = "chloride")
    private Double Chloride;

    @Column(name = "lead")
    private Double Lead;

    @Column(name = "zinc")
    private Double Zinc;

    @Column(name = "color")
    private String Color;

    @Column(name = "turbidity")
    private Double Turbidity;

    @Column(name = "fluoride")
    private Double Fluoride;

    @Column(name = "copper")
    private Double Copper;

    @Column(name = "odor")
    private Double Odor;

    @Column(name = "sulfate")
    private Double Sulfate;

    @Column(name = "conductivity")
    private Double Conductivity;

    @Column(name = "chlorine")
    private Double Chlorine;

    @Column(name = "manganese")
    private Double Manganese;

    // Python FastAPI'deki alias ("Total Dissolved Solids") ile tam uyum sağlar
    @JsonProperty("Total Dissolved Solids")
    @Column(name = "total_dissolved_solids")
    private Double totalDissolvedSolids;

    @Column(name = "source")
    private String Source;

    // ML Modelinden Geri Dönecek Tahmin Sonuçları
    @Column(name = "prediction")
    private Integer prediction;

    @Column(name = "probability_0")
    private Double probability0;

    @Column(name = "probability_1")
    private Double probability1;

    @Column(name = "threshold_used")
    private Double thresholdUsed;

    // --- GETTER VE SETTER METOTLARI ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getPH() { return pH; }
    public void setPH(Double pH) { this.pH = pH; }

    public Double getIron() { return Iron; }
    public void setIron(Double iron) { this.Iron = iron; }

    public Double getNitrate() { return Nitrate; }
    public void setNitrate(Double nitrate) { this.Nitrate = nitrate; }

    public Double getChloride() { return Chloride; }
    public void setChloride(Double chloride) { this.Chloride = chloride; }

    public Double getLead() { return Lead; }
    public void setLead(Double lead) { this.Lead = lead; }

    public Double getZinc() { return Zinc; }
    public void setZinc(Double zinc) { this.Zinc = zinc; }

    public String getColor() { return Color; }
    public void setColor(String color) { this.Color = color; }

    public Double getTurbidity() { return Turbidity; }
    public void setTurbidity(Double turbidity) { this.Turbidity = turbidity; }

    public Double getFluoride() { return Fluoride; }
    public void setFluoride(Double fluoride) { this.Fluoride = fluoride; }

    public Double getCopper() { return Copper; }
    public void setCopper(Double copper) { this.Copper = copper; }

    public Double getOdor() { return Odor; }
    public void setOdor(Double odor) { this.Odor = odor; }

    public Double getSulfate() { return Sulfate; }
    public void setSulfate(Double sulfate) { this.Sulfate = sulfate; }

    public Double getConductivity() { return Conductivity; }
    public void setConductivity(Double conductivity) { this.Conductivity = conductivity; }

    public Double getChlorine() { return Chlorine; }
    public void setChlorine(Double chlorine) { this.Chlorine = chlorine; }

    public Double getManganese() { return Manganese; }
    public void setManganese(Double manganese) { this.Manganese = manganese; }

    public Double getTotalDissolvedSolids() { return totalDissolvedSolids; }
    public void setTotalDissolvedSolids(Double totalDissolvedSolids) { this.totalDissolvedSolids = totalDissolvedSolids; }

    public String getSource() { return Source; }
    public void setSource(String source) { this.Source = source; }

    public Integer getPrediction() { return prediction; }
    public void setPrediction(Integer prediction) { this.prediction = prediction; }

    public Double getProbability0() { return probability0; }
    public void setProbability0(Double probability0) { this.probability0 = probability0; }

    public Double getProbability1() { return probability1; }
    public void setProbability1(Double probability1) { this.probability1 = probability1; }

    public Double getThresholdUsed() { return thresholdUsed; }
    public void setThresholdUsed(Double thresholdUsed) { this.thresholdUsed = thresholdUsed; }
}