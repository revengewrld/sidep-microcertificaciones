import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function enviarCorreoRecuperacion(
  correoDestino: string,
  nombreUsuario: string,
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/restablecer/${token}`;

  await transporter.sendMail({
    from: `"SIDEP" <${process.env.EMAIL_USER}>`,
    to: correoDestino,
    subject: "Restablece tu contraseña - SIDEP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1b3a5c;">Restablece tu contraseña</h2>
        <p>Hola ${nombreUsuario},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en SIDEP. Haz clic en el siguiente botón para elegir una nueva:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background-color: #1b3a5c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Restablecer contraseña
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `,
  });
}