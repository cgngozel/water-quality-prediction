package org.example.watertemp.controller;


import jakarta.validation.Valid;

import java.util.List;

import org.example.watertemp.entity.WaterQuality;
import org.example.watertemp.service.WaterQualityServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/water-quality")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class WaterQualityCont {

    @Autowired
    private WaterQualityServ service;

    @PostMapping("/analyze")
    public ResponseEntity<WaterQuality> analyzeWater(@RequestBody WaterQuality waterData) {
        WaterQuality result = service.saveAndPredict(waterData);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/history")
    public ResponseEntity<List<WaterQuality>> getHistory() {
        return ResponseEntity.ok(service.getAllRecords());
    }}