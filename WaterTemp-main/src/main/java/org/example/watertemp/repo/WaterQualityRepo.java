package org.example.watertemp.repo;

import org.example.watertemp.entity.WaterQuality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterQualityRepo extends JpaRepository<WaterQuality, Long>{

}
