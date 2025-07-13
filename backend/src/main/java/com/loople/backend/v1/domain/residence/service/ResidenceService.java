package com.loople.backend.v1.domain.residence.service;

import com.loople.backend.v1.domain.residence.entity.Residence;

public interface ResidenceService {
    Residence findOrCreate(String address, String regionCode, double gpsLat, double gpsLng);
}
