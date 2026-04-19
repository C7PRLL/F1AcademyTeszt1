const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(to, name, token) {
  const activationLink = `${process.env.FRONTEND_URL}/activate-account?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Fiók aktiválása - F1 Academy',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Szia ${name}!</h2>
        <p>Köszönjük a regisztrációt az F1 Academy rendszerébe.</p>
        <p>A fiókod aktiválásához kattints az alábbi linkre:</p>
        <p>
          <a href="${activationLink}" target="_blank">${activationLink}</a>
        </p>
        <p>A link 24 óráig érvényes.</p>
        <p>Ha nem te regisztráltál, ezt az emailt figyelmen kívül hagyhatod.</p>
      </div>
    `,
  });
}

async function sendAdminRegistrationEmail(user, token) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: 'Új regisztráció történt - F1 Academy',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3>Új felhasználó regisztrált</h3>
        <p><strong>Név:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Verification token:</strong> ${token}</p>
        <p><strong>Felhasználó ID:</strong> ${user.id}</p>
      </div>
    `,
  });
}

module.exports = {
  sendVerificationEmail,
  sendAdminRegistrationEmail,
};