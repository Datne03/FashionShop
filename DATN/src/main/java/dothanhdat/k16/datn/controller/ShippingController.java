package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.request.ShippingRequest;
import dothanhdat.k16.datn.dto.response.ShippingResponse;
import dothanhdat.k16.datn.service.serviceImpl.ShippingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ShippingController {
    ShippingService shippingService;

    @PostMapping("/calculate")
    public ResponseEntity<ShippingResponse> calculateShipping(@RequestBody ShippingRequest request) throws JSONException {
        return ResponseEntity.ok(shippingService.calculateShippingFee(request));
    }

    @GetMapping("/provinces")
    public ResponseEntity<String> getProvinces() {
        return shippingService.getGHNProvinces();
    }

    @GetMapping("/districts")
    public ResponseEntity<String> getDistricts() {
        return shippingService.getGHNDistricts();
    }

    @PostMapping("/wards")
    public ResponseEntity<String> getWards(@RequestBody Map<String, Integer> body) {
        return shippingService.getGHNWards(body.get("district_id"));
    }
}
