package com.etour.booking.service;

import com.etour.booking.entity.Booking;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    public String generatePaymentLink(Booking booking) {
        String method = booking.getPaymentMethod().toUpperCase();
        Long bookingId = booking.getId();
        BigDecimal price = booking.getTotalPrice();

        try {
            String encodedTitle = URLEncoder.encode(booking.getTour().getTitle(), StandardCharsets.UTF_8.toString());
            
            if ("VNPAY".equals(method)) {
                // Return a simulated VNPay sandbox payment redirect
                return String.format(
                    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=%s&vnp_Command=pay&vnp_CreateDate=20260526&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+tour+id+%d&vnp_OrderType=other&vnp_ReturnUrl=http%%3A%%2F%%2Flocalhost%%3A3000%%2Fpayment-callback%%3FbookingId%%3D%d&vnp_TxnRef=%d",
                    price.multiply(BigDecimal.valueOf(100)).toBigInteger().toString(), // VNPay requires price * 100
                    bookingId,
                    bookingId,
                    bookingId
                );
            } else if ("MOMO".equals(method)) {
                // Return a simulated MoMo sandbox deep link
                return String.format(
                    "https://payment.momo.vn/v2/gateway/api/create?partnerCode=MOMO&requestId=%d&amount=%s&orderId=%d&orderInfo=Thanh+toan+tour+%s&redirectUrl=http%%3A%%2F%%2Flocalhost%%3A3000%%2Fpayment-callback&ipnUrl=http%%3A%%2F%%2Flocalhost%%3A8081%%2Fapi%%2Fbookings%%2Fpayment-ipn",
                    bookingId,
                    price.toBigInteger().toString(),
                    bookingId,
                    encodedTitle
                );
            }
        } catch (Exception e) {
            // Log error
        }

        // Default local cash payment mock fallback
        return "http://localhost:3000/checkout/success?bookingId=" + bookingId;
    }
}
