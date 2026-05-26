package com.etour.booking.service;

import com.etour.booking.entity.Booking;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendBookingConfirmationEmail(Booking booking) {
        String recipientEmail = booking.getCustomerEmail();
        String subject = "🔔 XÁC NHẬN ĐẶT TOUR THÀNH CÔNG - E-TOUR SYSTEM (MÃ ĐƠN: #" + booking.getId() + ")";
        
        String htmlContent = String.format(
            "<html>" +
            "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
            "  <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>" +
            "    <h2 style='color: #4f46e5; text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;'>CẢM ƠN QUÝ KHÁCH ĐÃ ĐẶT TOUR!</h2>" +
            "    <p>Xin chào <strong>%s</strong>,</p>" +
            "    <p>Yêu cầu đặt tour của bạn đã được xác nhận thanh toán thành công. Dưới đây là thông tin chi tiết hóa đơn:</p>" +
            "    " +
            "    <table style='width: 100%%; border-collapse: collapse; margin: 20px 0;'>" +
            "      <tr style='background: #f8fafc;'>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Mã hóa đơn:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>#%d</td>" +
            "      </tr>" +
            "      <tr>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Tên Tour:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>%s</td>" +
            "      </tr>" +
            "      <tr style='background: #f8fafc;'>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Điểm đến:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>%s</td>" +
            "      </tr>" +
            "      <tr>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Ngày khởi hành:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>%s</td>" +
            "      </tr>" +
            "      <tr style='background: #f8fafc;'>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Số lượng vé:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>%d vé</td>" +
            "      </tr>" +
            "      <tr style='font-size: 1.1em; color: #e11d48; font-weight: bold;'>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>Tổng số tiền:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>%s VND</td>" +
            "      </tr>" +
            "      <tr>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Phương thức thanh toán:</td>" +
            "        <td style='padding: 10px; border: 1px solid #e2e8f0;'>%s</td>" +
            "      </tr>" +
            "    </table>" +
            "    " +
            "    <div style='background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 4px; margin-top: 20px;'>" +
            "      <p style='margin: 0; font-weight: bold; color: #166534;'>Lưu ý hành trình:</p>" +
            "      <p style='margin: 5px 0 0 0; font-size: 0.9em;'>Vui lòng có mặt tại điểm đón trước 30 phút. Mang theo Căn cước công dân hoặc Passport để thực hiện thủ tục nhận đoàn.</p>" +
            "    </div>" +
            "    " +
            "    <p style='margin-top: 30px; text-align: center; font-size: 0.8em; color: #64748b;'>Đây là email tự động từ hệ thống E-Tour Booking. Mọi thông tin cần hỗ trợ xin vui lòng phản hồi email này hoặc liên hệ hotline: 1900-ETOUR.</p>" +
            "  </div>" +
            "</body>" +
            "</html>",
            booking.getCustomerName(),
            booking.getId(),
            booking.getTour().getTitle(),
            booking.getTour().getDestination(),
            booking.getTour().getDepartureDate().toString(),
            booking.getTicketsCount(),
            booking.getTotalPrice().toString(),
            booking.getPaymentMethod()
        );

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(recipientEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("📧 Email xác nhận đặt vé thành công đã được gửi tới: {}", recipientEmail);
                return;
            } catch (Exception e) {
                log.error("⚠️ Lỗi gửi email thực tế (Kiểm tra lại cấu hình SMTP): {}", e.getMessage());
            }
        }

        // Beautiful formatted Console Mock Log if mailSender isn't initialized or failed
        log.info("\n================ MOCK EMAIL INVOICE SENT ================\n" +
                 "To: {}\n" +
                 "Subject: {}\n" +
                 "Content (Mock HTML rendered in Log):\n" +
                 "Dear {},\n" +
                 "Your order ID #{} for Tour \"{}\" (Destination: {}) is confirmed PAID.\n" +
                 "Tickets count: {} | Total: {} VND via {}\n" +
                 "===========================================================",
                 recipientEmail, subject, booking.getCustomerName(), booking.getId(),
                 booking.getTour().getTitle(), booking.getTour().getDestination(),
                 booking.getTicketsCount(), booking.getTotalPrice(), booking.getPaymentMethod());
    }
}
