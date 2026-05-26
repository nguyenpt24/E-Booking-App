package com.etour.booking.config;

import com.etour.booking.entity.Tour;
import com.etour.booking.entity.User;
import com.etour.booking.repository.TourRepository;
import com.etour.booking.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Đang kiểm tra và khởi tạo dữ liệu mẫu tự động trong PostgreSQL...");

        // 1. Seed Accounts if empty
        if (userRepository.count() == 0) {
            log.info("👤 Cơ sở dữ liệu tài khoản trống. Tiến hành tạo tài khoản mẫu...");

            // Create admin
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("adminpassword"),
                    "admin@etour.com",
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            log.info("🔑 Đã tạo tài khoản ADMIN mặc định: [admin / adminpassword]");

            // Create standard customer
            User customer = new User(
                    "customer",
                    passwordEncoder.encode("customerpassword"),
                    "customer@gmail.com",
                    "ROLE_CUSTOMER"
            );
            userRepository.save(customer);
            log.info("👤 Đã tạo tài khoản KHÁCH HÀNG mặc định: [customer / customerpassword]");
        }

        // 2. Seed Tours if empty
        if (tourRepository.count() == 0) {
            log.info("🌍 Cơ sở dữ liệu Tour du lịch trống. Tiến hành nạp dữ liệu tour mẫu cao cấp...");

            // Tour 1: Da Nang - Hoi An
            Tour tour1 = new Tour(
                    "Siêu Phẩm Tour Đà Nẵng - Hội An - Bà Nà Hills 4 ngày 3 đêm",
                    "Đà Nẵng, Việt Nam",
                    BigDecimal.valueOf(3500000),
                    LocalDate.now().plusDays(20),
                    "Ngày 1: Đón đoàn tại Sân bay Đà Nẵng. Nhận phòng khách sạn, nghỉ ngơi. Chiều tham quan Ngũ Hành Sơn, phố cổ Hội An lãng mạn dưới ánh đèn lồng rực rỡ.\n" +
                    "Ngày 2: Chinh phục đỉnh Bà Nà Hills, tham quan Cầu Vàng nổi tiếng thế giới, vui chơi tại Fantasy Park.\n" +
                    "Ngày 3: Khám phá Bán đảo Sơn Trà, viếng chùa Linh Ứng. Tự do tắm biển Mỹ Khê.\n" +
                    "Ngày 4: Mua sắm đặc sản Chợ Hàn. Tiễn đoàn ra sân bay.",
                    15,
                    "https://images.unsplash.com/photo-1559592481-74f4b16279f7?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour1);

            // Tour 2: Ha Long cruise tour
            Tour tour2 = new Tour(
                    "Kỳ Quan Thiên Nhiên Vịnh Hạ Long - Nghỉ Dưỡng Du Thuyền 5 Sao",
                    "Quảng Ninh, Việt Nam",
                    BigDecimal.valueOf(5200000),
                    LocalDate.now().plusDays(15),
                    "Ngày 1: Di chuyển từ Hà Nội đi Hạ Long. Check-in du thuyền 5 sao sang trọng. Ăn trưa buffet hải sản trên vịnh. Chiều chèo thuyền Kayak tại Hang Luồn, tắm biển đảo Titop.\n" +
                    "Ngày 2: Tập Thái Cực Quyền đón bình minh trên boong tàu. Tham quan Hang Sửng Sốt - một trong những hang động đẹp nhất vịnh. Dùng bữa trưa nhẹ và quay trở lại bến tàu. Tiễn đoàn về Hà Nội.",
                    8,
                    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour2);

            // Tour 3: Phu Quoc Island
            Tour tour3 = new Tour(
                    "Thiên Đường Nghỉ Dưỡng Đảo Ngọc Phú Quốc - Trọn Gói",
                    "Kiên Giang, Việt Nam",
                    BigDecimal.valueOf(6800000),
                    LocalDate.now().plusDays(25),
                    "Ngày 1: Đón sân bay Phú Quốc. Khám phá Bắc Đảo, tham quan VinWonders hoành tráng.\n" +
                    "Ngày 2: Cano 4 đảo, lặn ngắm san hô tại Hòn Móng Tay, Hòn Mây Rút. Trải nghiệm cáp treo vượt biển Hòn Thơm dài nhất thế giới.\n" +
                    "Ngày 3: Check-in Sunset Sanato ngắm hoàng hôn tuyệt đẹp. Thưởng thức chợ đêm hải sản Dương Đông.\n" +
                    "Ngày 4: Viếng chùa Hộ Quốc, mua sắm ngọc trai. Tiễn sân bay.",
                    20,
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour3);

            // Tour 4: Singapore - Malaysia International Tour
            Tour tour4 = new Tour(
                    "Liên Tuyến Quốc Tế Singapore - Malaysia Hè Rực Rỡ 5 ngày 4 đêm",
                    "Singapore & Malaysia",
                    BigDecimal.valueOf(12900000),
                    LocalDate.now().plusDays(30),
                    "Ngày 1: Đáp chuyến bay đến Singapore. Check-in công viên Sư Tử Biển Merlion Park, Marina Bay Sands.\n" +
                    "Ngày 2: Vui chơi tại Gardens by the Bay, hòn đảo Sentosa kỳ thú. Chiều di chuyển qua biên giới Malaysia đi Malacca.\n" +
                    "Ngày 3: Khám phá thành phố cổ Malacca, di chuyển về thủ đô Kuala Lumpur. Tham quan Tháp Đôi Petronas.\n" +
                    "Ngày 4: Chinh phục Động Batu linh thiêng, vui chơi Genting Highlands.\n" +
                    "Ngày 5: Mua sắm đặc sản, tiễn sân bay Kuala Lumpur về Việt Nam.",
                    12,
                    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour4);

            log.info("✅ Đã nạp thành công 4 Tour du lịch cao cấp vào Cơ sở dữ liệu!");
        } else {
            log.info("⭐ Cơ sở dữ liệu đã có sẵn dữ liệu Tour. Bỏ qua bước khởi tạo mẫu.");
        }
    }
}
