const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.SECURE === "false",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendRecoveryEmail = async (userEmail, recoveryLink, restaurantName) => {
  const mailOptions = {
    from: `"MenuNet" ${process.env.EMAIL_USER}`,
    to: userEmail,
    subject: "Recuperação de Senha",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f9f9;">
        <h2 style="color: #035373; text-align: center;">MenuNet</h2>
        <p>Olá, gerente do restaurante <strong>${restaurantName}</strong>,</p>
        <p>Recebemos um pedido para redefinir a senha da sua conta.</p>
        <p>Se não foi você simplesmente ignore esse email.</p>
        <p>Para prosseguir, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${recoveryLink}" style="background-color: #04bfbf; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Senha</a>
        </div>
        <p style="color: #666; font-size: 0.8rem;">Este link é válido por 1 hora.</p>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erro no servico de email: ", error);
    throw error;
  }
};

module.exports = { sendRecoveryEmail };
