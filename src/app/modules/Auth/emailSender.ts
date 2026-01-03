import nodemailer from "nodemailer";
import config from "../../config";
const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "asikhosen865575@gmail.com",
      pass: "vjseskycrvtuzemg",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Authroze Check" <asikhosen865575@gmail.com>',
    to: email,
    subject: "Reset Password Link ✔",
    html,
  });
  console.log("Message sent:%s", info.messageId);
};

export default emailSender;
