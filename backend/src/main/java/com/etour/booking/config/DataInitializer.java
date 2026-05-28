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
            admin.setFullName("Administrator");
            admin.setPhoneNumber("0999999999");
            userRepository.save(admin);
            log.info("🔑 Đã tạo tài khoản ADMIN mặc định: [admin / adminpassword]");

            // Create standard customer
            User customer = new User(
                    "customer",
                    passwordEncoder.encode("customerpassword"),
                    "customer@gmail.com",
                    "ROLE_CUSTOMER"
            );
            customer.setFullName("Nguyễn Văn Khách");
            customer.setPhoneNumber("0987654321");
            userRepository.save(customer);
            log.info("👤 Đã tạo tài khoản KHÁCH HÀNG mặc định: [customer / customerpassword]");
        }

        // 2. Seed Tours if empty
        if (tourRepository.count() == 0) {
            log.info("🌍 Cơ sở dữ liệu Tour du lịch trống. Tiến hành nạp dữ liệu tour mẫu cao cấp...");

            // Tour 1: Da Nang - Hoi An
            Tour tour1 = new Tour(
                    "Siêu Phẩm Tour Đà Nẵng - Hội An - Bà Nà Hills 4 ngày 3 đêm",
                    "Đà Nẵng - Hội An",
                    BigDecimal.valueOf(3500000),
                    LocalDate.now().plusDays(20),
                    "Ngày 1: Đón đoàn tại Sân bay Đà Nẵng. Nhận phòng khách sạn, nghỉ ngơi. Chiều tham quan Ngũ Hành Sơn, phố cổ Hội An lãng mạn dưới ánh đèn lồng rực rỡ.\n" +
                    "Ngày 2: Chinh phục đỉnh Bà Nà Hills, tham quan Cầu Vàng nổi tiếng thế giới, vui chơi tại Fantasy Park.\n" +
                    "Ngày 3: Khám phá Bán đảo Sơn Trà, viếng chùa Linh Ứng. Tự do tắm biển Mỹ Khê.\n" +
                    "Ngày 4: Mua sắm đặc sản Chợ Hàn. Tiễn đoàn ra sân bay.",
                    15,
                    "https://images.unsplash.com/photo-1559592481-74f4b16279f7?auto=format&fit=crop&w=800&q=80",
                    15
            );
            tourRepository.save(tour1);

            // Tour 2: Ha Long cruise tour
            Tour tour2 = new Tour(
                    "Kỳ Quan Thiên Nhiên Vịnh Hạ Long - Nghỉ Dưỡng Du Thuyền 5 Sao",
                    "Hạ Long",
                    BigDecimal.valueOf(5200000),
                    LocalDate.now().plusDays(15),
                    "Ngày 1: Di chuyển từ Hà Nội đi Hạ Long. Check-in du thuyền 5 sao sang trọng. Ăn trưa buffet hải sản trên vịnh. Chiều chèo thuyền Kayak tại Hang Luồn, tắm biển đảo Titop.\n" +
                    "Ngày 2: Tập Thái Cực Quyền đón bình minh trên boong tàu. Tham quan Hang Sửng Sốt - một trong những hang động đẹp nhất vịnh. Dùng bữa trưa nhẹ và quay trở lại bến tàu. Tiễn đoàn về Hà Nội.",
                    8,
                    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
                    10
            );
            tourRepository.save(tour2);

            // Tour 3: Phu Quoc Island
            Tour tour3 = new Tour(
                    "Thiên Đường Nghỉ Dưỡng Đảo Ngọc Phú Quốc - Trọn Gói",
                    "Phú Quốc",
                    BigDecimal.valueOf(6800000),
                    LocalDate.now().plusDays(25),
                    "Ngày 1: Đón sân bay Phú Quốc. Khám phá Bắc Đảo, tham quan VinWonders hoành tráng.\n" +
                    "Ngày 2: Cano 4 đảo, lặn ngắm san hô tại Hòn Móng Tay, Hòn Mây Rút. Trải nghiệm cáp treo vượt biển Hòn Thơm dài nhất thế giới.\n" +
                    "Ngày 3: Check-in Sunset Sanato ngắm hoàng hôn tuyệt đẹp. Thưởng thức chợ đêm hải sản Dương Đông.\n" +
                    "Ngày 4: Viếng chùa Hộ Quốc, mua sắm ngọc trai. Tiễn sân bay.",
                    20,
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    20
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

            // Tour 5: Ha Noi
            Tour tour5 = new Tour(
                    "Tinh Hoa Hà Nội - Khám Phá 36 Phố Phường - Lăng Bác - Văn Miếu",
                    "Hà Nội",
                    BigDecimal.valueOf(1800000),
                    LocalDate.now().plusDays(10),
                    "Ngày 1: Đón khách tại khách sạn phố cổ. Khám phá Lăng Bác, Chùa Một Cột, Hoàng thành Thăng Long. Ăn trưa phở Hà Nội gia truyền.\n" +
                    "Ngày 2: Tham quan Văn Miếu Quốc Tử Giám, Hồ Tây, Chùa Trấn Quốc. Chiều tự do mua sắm tại hồ Hoàn Kiếm, xem múa rối nước.",
                    15,
                    "https://images.unsplash.com/photo-1509060464153-4466739f78d0?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour5);

            // Tour 6: Sa Pa
            Tour tour6 = new Tour(
                    "Chinh Phục Đỉnh Fansipan - Nóc Nhà Đông Dương - Sa Pa Mộng Mơ",
                    "Sa Pa",
                    BigDecimal.valueOf(3200000),
                    LocalDate.now().plusDays(12),
                    "Ngày 1: Xe giường nằm cao cấp đưa quý khách lên Sa Pa. Chiều tham quan Bản Cát Cát xinh đẹp của người H'Mông.\n" +
                    "Ngày 2: Đi cáp treo Fansipan ngắm thung lũng Mường Hoa, chạm tay vào cột mốc Fansipan 3.143m.\n" +
                    "Ngày 3: Khám phá núi Hàm Rồng, chụp ảnh toàn cảnh thị trấn Sa Pa trong sương. Chiều lên xe về lại Hà Nội.",
                    20,
                    "https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour6);

            // Tour 7: Ha Giang
            Tour tour7 = new Tour(
                    "Kỳ Vĩ Hà Giang - Chinh Phục Đèo Mã Pí Lèng - Cột Cờ Lũng Cú",
                    "Hà Giang",
                    BigDecimal.valueOf(3900000),
                    LocalDate.now().plusDays(18),
                    "Ngày 1: Di chuyển từ Hà Nội đi Hà Giang. Check-in cột mốc Km 0, khám phá Quản Bạ, núi đôi Cô Tiên.\n" +
                    "Ngày 2: Khám phá cao nguyên đá Đồng Văn, dinh thự vua Mèo. Chinh phục đèo Mã Pí Lèng - một trong tứ đại đỉnh đèo, du thuyền sông Nho Quế qua hẻm Tu Sản.\n" +
                    "Ngày 3: Viếng cột cờ Lũng Cú - điểm cực Bắc Tổ quốc. Chiều di chuyển về Hà Nội.",
                    10,
                    "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour7);

            // Tour 8: Ninh Binh
            Tour tour8 = new Tour(
                    "Tuyệt Tác Ninh Bình - Danh Thắng Tràng An - Chùa Bái Đính",
                    "Ninh Bình",
                    BigDecimal.valueOf(1500000),
                    LocalDate.now().plusDays(8),
                    "Ngày 1: Xe đón khởi hành đi Ninh Bình. Viếng chùa Bái Đính - ngôi chùa lớn nhất Đông Nam Á.\n" +
                    "Ngày 2: Đi thuyền khám phá quần thể danh thắng Tràng An xinh đẹp, check-in phim trường King Kong. Thử thách leo 500 bậc đá lên đỉnh Hang Múa ngắm toàn cảnh Tam Cốc xinh đẹp.",
                    25,
                    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour8);

            // Tour 9: Phong Nha
            Tour tour9 = new Tour(
                    "Khám Phá Kỳ Quan Quảng Bình - Động Phong Nha - Động Thiên Đường",
                    "Quảng Bình",
                    BigDecimal.valueOf(2800000),
                    LocalDate.now().plusDays(22),
                    "Ngày 1: Đón khách tại Đồng Hới. Xuôi thuyền trên sông Son vào khám phá Động Phong Nha - hang động nước kỳ vĩ nhất thế giới.\n" +
                    "Ngày 2: Chinh phục Động Thiên Đường - hoàng cung trong lòng đất với những thạch nhũ lung linh huyền ảo. Chiều vui chơi zip-line, tắm bùn tại Hang Tối.",
                    12,
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour9);

            // Tour 10: Hue
            Tour tour10 = new Tour(
                    "Hành Trình Di Sản Cố Đô Huế - Ca Huế Trên Sông Hương",
                    "Huế",
                    BigDecimal.valueOf(2200000),
                    LocalDate.now().plusDays(16),
                    "Ngày 1: Đón khách tham quan Đại Nội Huế (Hoàng Cung của 13 vị vua triều Nguyễn), viếng chùa Thiên Mụ cổ kính. Tối du thuyền nghe ca Huế trên sông Hương thơ mộng.\n" +
                    "Ngày 2: Khám phá các lăng tẩm hoàng gia: Lăng Khải Định lộng lẫy, lăng Tự Đức thơ mộng. Mua sắm quà lưu niệm đặc sản kẹo mè xửng, nón lá tại chợ Đông Ba.",
                    15,
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour10);

            // Tour 11: Quy Nhon
            Tour tour11 = new Tour(
                    "Quy Nhơn Biển Xanh - Kỳ Co - Eo Gió - Check-in Hòn Khô",
                    "Quy Nhơn",
                    BigDecimal.valueOf(3800000),
                    LocalDate.now().plusDays(24),
                    "Ngày 1: Đón khách sân bay Phù Cát. Chiều check-in Eo Gió - nơi ngắm hoàng hôn đẹp nhất Việt Nam, viếng tịnh xá Ngọc Hòa.\n" +
                    "Ngày 2: Đi cano cao tốc ra đảo Kỳ Co, tắm biển hòa mình vào làn nước trong vắt, lặn ngắm san hô tại bãi Dứa. Chiều ghé Hòn Khô trải nghiệm con đường đi bộ giữa biển độc đáo.",
                    18,
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour11);

            // Tour 12: Nha Trang
            Tour tour12 = new Tour(
                    "Vịnh Ngọc Nha Trang - Du Thuyền Ngắm Hoàng Hôn - Tour 3 Đảo",
                    "Nha Trang",
                    BigDecimal.valueOf(4500000),
                    LocalDate.now().plusDays(14),
                    "Ngày 1: Check-in Nha Trang. Tận hưởng chiều nghỉ ngơi trên bãi biển Trần Phú. Tối lên du thuyền 5 sao thưởng thức buffet hải sản ngắm hoàng hôn lãng mạn trên vịnh Nha Trang.\n" +
                    "Ngày 2: Khám phá Hòn Tằm tắm bùn khoáng cao cấp, đi bộ dưới đáy biển ngắm san hô tại bãi Tranh. Tối tự do khám phá chợ đêm Nha Trang.",
                    20,
                    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour12);

            // Tour 13: Da Lat
            Tour tour13 = new Tour(
                    "Đà Lạt Mộng Mơ - Săn Mây Đại Ngàn - Check-in Thung Lũng Tình Yêu",
                    "Đà Lạt",
                    BigDecimal.valueOf(2900000),
                    LocalDate.now().plusDays(9),
                    "Ngày 1: Đón khách lên Đà Lạt. Chiều check-in Quảng trường Lâm Viên, Hồ Xuân Hương, ga Đà Lạt cổ kính.\n" +
                    "Ngày 2: 4h00 sáng trải nghiệm săn mây đồi chè Cầu Đất siêu thực. Trưa tham quan Thung lũng Tình Yêu, Thác Datanla trải nghiệm xe trượt ống cảm giác mạnh.\n" +
                    "Ngày 3: Tham quan chùa Linh Phước, chợ Đà Lạt. Tiễn đoàn.",
                    22,
                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour13);

            // Tour 14: Mui Ne
            Tour tour14 = new Tour(
                    "Thiên Đường Cát Mũi Né - Phan Thiết - Trải Nghiệm Xe Jeep",
                    "Mũi Né",
                    BigDecimal.valueOf(2400000),
                    LocalDate.now().plusDays(11),
                    "Ngày 1: Di chuyển từ TP.HCM đi Mũi Né. Chiều nhận phòng nghỉ dưỡng tại resort sát biển, tự do tắm biển bãi Rạng.\n" +
                    "Ngày 2: 4h30 sáng xe Jeep đón đi ngắm bình minh trên Đồi Cát Trắng, chơi trượt cát, lái môtô địa hình. Ghé thăm Đồi Cát Đỏ thơ mộng, Suối Tiên lung linh thạch nhũ tự nhiên và làng chài cổ xưa.",
                    15,
                    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour14);

            // Tour 15: TP. Ho Chi Minh
            Tour tour15 = new Tour(
                    "Hành Trình Sài Gòn Năng Động - Dinh Độc Lập - Địa Đạo Củ Chi",
                    "TP. Hồ Chí Minh",
                    BigDecimal.valueOf(1600000),
                    LocalDate.now().plusDays(7),
                    "Ngày 1: Tham quan trung tâm thành phố: Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm Sài Gòn. Thưởng thức cà phê bệt và ăn tối ngắm sông Sài Gòn trên du thuyền.\n" +
                    "Ngày 2: Chuyến hành trình lịch sử khám phá Địa đạo Củ Chi kỳ vĩ dưới lòng đất. Chiều mua sắm chợ Bến Thành.",
                    30,
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour15);

            // Tour 16: Can Tho
            Tour tour16 = new Tour(
                    "Đậm Đà Miền Tây - Chợ Nổi Cái Răng Cần Thơ - Vườn Trái Cây",
                    "Cần Thơ",
                    BigDecimal.valueOf(1450000),
                    LocalDate.now().plusDays(6),
                    "Ngày 1: Khởi hành từ Sài Gòn đi Cần Thơ. Viếng thiền viện trúc lâm Phương Nam. Chiều tối dạo bến Ninh Kiều, thưởng thức đặc sản lẩu mắm miền Tây.\n" +
                    "Ngày 2: 5h30 sáng đi thuyền khám phá chợ nổi Cái Răng - nét văn hóa giao thương độc đáo miền Tây sông nước. Ghé lò hủ tiếu truyền thống, tham quan vườn trái cây trĩu quả.",
                    25,
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            );
            tourRepository.save(tour16);

            log.info("✅ Đã nạp thành công 16 Tour du lịch cao cấp bao trùm Việt Nam vào Cơ sở dữ liệu!");
        } else {
            log.info("⭐ Cơ sở dữ liệu đã có sẵn dữ liệu Tour. Bỏ qua bước khởi tạo mẫu.");
        }
    }
}
