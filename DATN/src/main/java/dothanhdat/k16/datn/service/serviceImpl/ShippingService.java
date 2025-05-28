package dothanhdat.k16.datn.service.serviceImpl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dothanhdat.k16.datn.dto.request.ShippingRequest;
import dothanhdat.k16.datn.dto.response.ShippingResponse;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.repository.UserAddressRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static java.util.Map.entry;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ShippingService {
    private final String GHN_TOKEN = "027d9104-2c81-11f0-afab-c2dd849a5f98";

    private UserAddressRepository userAddressRepository;
    UserRepository userRepository;

    private static final Map<String, Double> DISTANCE_FROM_HANOI = Map.ofEntries(
            entry("Hà Giang", 300.0),
            entry("Cao Bằng", 280.0),
            entry("Lạng Sơn", 160.0),
            entry("Bắc Kạn", 220.0),
            entry("Thái Nguyên", 80.0),
            entry("Tuyên Quang", 150.0),
            entry("Phú Thọ", 90.0),
            entry("Bắc Giang", 60.0),
            entry("Bắc Ninh", 30.0),
            entry("Quảng Ninh", 150.0),
            entry("Hải Dương", 60.0),
            entry("Hải Phòng", 100.0),
            entry("Hưng Yên", 50.0),
            entry("Nam Định", 90.0),
            entry("Thái Bình", 110.0),
            entry("Hà Nam", 60.0),
            entry("Ninh Bình", 100.0),
            entry("Vĩnh Phúc", 60.0),
            entry("Yên Bái", 180.0),
            entry("Lào Cai", 290.0),
            entry("Sơn La", 320.0),
            entry("Điện Biên", 470.0),
            entry("Hòa Bình", 90.0),
            entry("Lai Châu", 420.0),
            entry("Thanh Hóa", 150.0),
            entry("Nghệ An", 300.0),
            entry("Hà Tĩnh", 370.0),
            entry("Quảng Bình", 500.0),
            entry("Quảng Trị", 600.0),
            entry("Thừa Thiên Huế", 670.0),
            entry("Đà Nẵng", 770.0),
            entry("Quảng Nam", 820.0),
            entry("Quảng Ngãi", 880.0),
            entry("Bình Định", 1020.0),
            entry("Phú Yên", 1120.0),
            entry("Khánh Hòa", 1280.0),
            entry("Ninh Thuận", 1360.0),
            entry("Bình Thuận", 1420.0),
            entry("Kon Tum", 1000.0),
            entry("Gia Lai", 1070.0),
            entry("Đắk Lắk", 1250.0),
            entry("Đắk Nông", 1300.0),
            entry("Lâm Đồng", 1450.0),
            entry("TP.HCM", 1700.0),
            entry("Bình Dương", 1680.0),
            entry("Đồng Nai", 1650.0),
            entry("Tây Ninh", 1750.0),
            entry("Bà Rịa - Vũng Tàu", 1720.0),
            entry("Long An", 1650.0),
            entry("Tiền Giang", 1700.0),
            entry("Bến Tre", 1730.0),
            entry("Trà Vinh", 1760.0),
            entry("Vĩnh Long", 1740.0),
            entry("Cần Thơ", 1750.0),
            entry("Hậu Giang", 1770.0),
            entry("Sóc Trăng", 1800.0),
            entry("Bạc Liêu", 1850.0),
            entry("Cà Mau", 1900.0),
            entry("An Giang", 1800.0),
            entry("Đồng Tháp", 1720.0),
            entry("Kiên Giang", 1880.0),
            entry("Bình Phuước", 1500.0),
            entry("Hà Nội", 10.0)

    );

    private int calculateShippingCost(String region) {
        return switch (region) {
            case "NOI_MIEN" -> 36000 + (2 * 2100);
            case "CAN_MIEN" -> 38000 + (2 * 3000);
            case "LIEN_MIEN" -> 40000 + (2 * 4000);
            default -> throw new RuntimeException("Unknown region");
        };
    }


    public ShippingResponse calculateShippingFee(ShippingRequest request) {
        User admin = userRepository.findByUsername("admin").orElseThrow();
        UserAddress from = admin.getUserAddresses().get(0);

        UserAddress to = userAddressRepository.findById(request.getToAddressId()).orElseThrow();
        System.out.println("Địa chỉ đến: " + to.getAddress());

        String region = getRegion(to.getProvince());

        int shippingCost = calculateShippingCost(region);

        ShippingResponse res = new ShippingResponse();
        res.setDistanceKm(0);
        res.setShippingFee(shippingCost);
        res.setFromAddress(from.getAddress());
        res.setToAddress(to.getAddress());

        return res;
    }


    private String getRegion(String province) {
        // Nội miền: các tỉnh miền Bắc gần Hà Nội
        Set<String> noiMien = Set.of("Hà Nội", "Hải Dương", "Hưng Yên", "Bắc Ninh", "Nam Định", "Ninh Bình", "Hà Nam", "Thái Bình", "Vĩnh Phúc");
        Set<String> canMien = Set.of("Thanh Hóa", "Nghệ An", "Tuyên Quang", "Phú Thọ", "Thái Nguyên");

        if (noiMien.contains(province)) return "NOI_MIEN";
        if (canMien.contains(province)) return "CAN_MIEN";
        return "LIEN_MIEN";
    }



//    public double getDistanceInKm(double lat1, double lng1, double lat2, double lng2) {
//        String apiKey = "YOUR_GOOGLE_API_KEY";
//        String url = String.format(
//                "https://maps.googleapis.com/maps/api/distancematrix/json?origins=%f,%f&destinations=%f,%f&key=%s",
//                lat1, lng1, lat2, lng2, apiKey
//        );
//
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
//
//        try {
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(response.getBody());
//            double distanceInMeters = root.path("rows").get(0).path("elements").get(0).path("distance").path("value").asDouble();
//            return distanceInMeters / 1000.0; // Chuyển sang km
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi lấy khoảng cách từ Google API", e);
//        }
//    }

    private double getDistanceToProvince(String address) {
        for (String province : DISTANCE_FROM_HANOI.keySet()) {
            if (address.contains(province)) {
                return DISTANCE_FROM_HANOI.get(province);
            }
        }
        // Nếu không tìm thấy tỉnh phù hợp, dùng khoảng cách mặc định
        return 10.0;
    }


//    public ShippingResponse calculateShippingFee(ShippingRequest request) {
//        User admin = userRepository.findByUsername("admin").orElseThrow();
//        UserAddress from = admin.getUserAddresses().get(0); // giả sử admin có ít nhất 1 địa chỉ
//
//       // UserAddress from = userAddressRepository.findById(1).orElseThrow();
//        UserAddress to = userAddressRepository.findById(request.getToAddressId()).orElseThrow();
//        System.out.println("to: "+to.getAddress());
//
//        double distance = getDistanceToProvince(to.getAddress());
//        double fee = distance * 50;
//
//        ShippingResponse res = new ShippingResponse();
//        res.setDistanceKm(distance);
//        res.setShippingFee(fee);
//        res.setFromAddress(from.getAddress());
//        res.setToAddress(to.getAddress());
//
//        return res;
//    }

    public ResponseEntity<String> getGHNProvinces() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHN_TOKEN);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate rest = new RestTemplate();
        return rest.exchange("https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                HttpMethod.GET, entity, String.class);
    }

    public ResponseEntity<String> getGHNDistricts() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHN_TOKEN);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate rest = new RestTemplate();
        return rest.exchange("https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                HttpMethod.GET, entity, String.class);
    }

    public ResponseEntity<String> getGHNWards(int districtId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", GHN_TOKEN);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Integer> body = new HashMap<>();
        body.put("district_id", districtId);

        HttpEntity<Map<String, Integer>> entity = new HttpEntity<>(body, headers);
        RestTemplate rest = new RestTemplate();
        return rest.exchange("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                HttpMethod.POST, entity, String.class);
    }
}