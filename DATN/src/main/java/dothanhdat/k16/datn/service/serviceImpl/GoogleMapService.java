package dothanhdat.k16.datn.service.serviceImpl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class GoogleMapService {
    private final RestTemplate restTemplate = new RestTemplate();

    public double[] getLatLngFromAddress(String address) throws JSONException {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://nominatim.openstreetmap.org/search")
                .queryParam("q", address)
                .queryParam("format", "json")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "shipping-app");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        JSONArray results = new JSONArray(response.getBody());

        if (results.length() > 0) {
            // Duyệt qua tất cả kết quả trả về để tìm tọa độ
            for (int i = 0; i < results.length(); i++) {
                JSONObject location = results.getJSONObject(i);
                String displayName = location.optString("display_name", "");
                String type = location.optString("class", "");

                // Nếu không phải là địa chỉ chính xác, nhưng là một loại đối tượng có thể dùng được (đường, khu vực, v.v.)
                if (!displayName.contains("railway") && !displayName.contains("station")) {
                    // Lấy tọa độ từ kết quả
                    double lat = Double.parseDouble(location.getString("lat"));
                    double lon = Double.parseDouble(location.getString("lon"));
                    return new double[]{lat, lon};
                }
            }

            // Nếu không tìm thấy tọa độ hợp lệ, thông báo lỗi
            throw new RuntimeException("Không tìm thấy tọa độ cho địa chỉ: " + address);
        }

        // Nếu không có kết quả trả về
        throw new RuntimeException("Không tìm thấy tọa độ cho địa chỉ: " + address);
    }


    public double calculateDrivingDistanceKm(double[] from, double[] to) throws JSONException {
        String url = String.format(
                "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=false",
                from[1], from[0], to[1], to[0]
        );

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        JSONObject json = new JSONObject(response.getBody());
        JSONArray routes = json.getJSONArray("routes");

        if (routes.length() > 0) {
            double distanceMeters = routes.getJSONObject(0).getDouble("distance");
            return distanceMeters / 1000.0;
        }

        throw new RuntimeException("Không tính được khoảng cách giữa hai điểm.");
    }
}