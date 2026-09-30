import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarCodigoVerificacion = async (correo, codigo) => {
  const mailOptions = {
    from: `"Shopware" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Código de Verificación - Shopware',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #181616; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #D99B6A; text-align: center;">¡Bienvenido a Shopware!</h2>
        <p style="color: #cccccc; text-align: center;">Usa el siguiente código de 6 dígitos para completar tu registro:</p>
        <div style="background-color: #211F1F; font-size: 32px; font-weight: bold; color: #D99B6A; padding: 15px; text-align: center; border-radius: 8px; letter-spacing: 6px; margin: 20px 0; border: 1px solid #332F2E;">
          ${codigo}
        </div>
        <p style="font-size: 12px; color: #888888; text-align: center;">Este código es válido durante 15 minutos.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};