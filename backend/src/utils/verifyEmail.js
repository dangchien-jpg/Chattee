import nodemailer from "nodemailer";

export const sendVerifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const verifyLink = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;

    const mailConfig = {
      from: `"Chattee support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Xác minh tài khoản Chattee",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Xác minh tài khoản</h2>
          <p>Chào bạn,</p>
          <p>Vui lòng bấm vào nút bên dưới để xác minh tài khoản:</p>

          <a href="${verifyLink}" 
             style="
               display: inline-block;
               padding: 10px 20px;
               background-color: #6a0dad;
               color: white;
               text-decoration: none;
               border-radius: 5px;
               margin-top: 10px;
             ">
             Xác minh email
          </a>

          <p style="margin-top: 20px;">
            Hoặc copy link này:
          </p>
          <p>${verifyLink}</p>

          <p style="color: gray; margin-top: 20px;">
            Nếu bạn không đăng ký, hãy bỏ qua email này.
          </p>
        </div>
      `,
    };
   await transporter.sendMail(mailConfig);
  } catch (error) {
    console.error("Send email error:", error);
    throw error;
  }
};
