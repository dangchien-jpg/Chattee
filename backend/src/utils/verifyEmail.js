import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerifyEmail = async (token, email) => {
  try {
    const verifyLink = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "Chattee <noreply@chattee.io.vn>",
      to: email,
      subject: "Xác minh tài khoản Chattee",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Xác minh tài khoản</h2>

          <p>Chào bạn,</p>

          <p>Vui lòng bấm vào nút bên dưới để xác minh tài khoản:</p>

          <a
            href="${verifyLink}"
            style="
              display:inline-block;
              padding:10px 20px;
              background:#6a0dad;
              color:#fff;
              text-decoration:none;
              border-radius:5px;
              margin-top:10px;
            "
          >
            Xác minh Email
          </a>

          <p style="margin-top:20px">
            Hoặc copy đường dẫn dưới đây:
          </p>

          <p>${verifyLink}</p>

          <p style="margin-top:20px;color:gray">
            Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Verify email sent:", data);
    return data;
  } catch (error) {
    console.error("Send verify email error:", error);
    throw error;
  }
};