import nodemailer from "nodemailer";
import dns from "dns";
export const sendResetOTPEmail = async (email, otp) => {
  try {
    dns.setDefaultResultOrder("ipv4first");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    await transporter.sendMail({
      from: `"Chattee support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p><strong>Mã OTP của bạn là:</strong></p>
      <h1 style="letter-spacing: 5px; color: #6b21a8;">${otp}</h1>
      <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <hr />
      <p style="font-size: 12px; color: gray;">
        Đây là email tự động, vui lòng không trả lời.
      </p>
      </div>
      `,
    });
  } catch (error) {
    console.error("Send OTP email error:", error);
    throw error;
  }
};
