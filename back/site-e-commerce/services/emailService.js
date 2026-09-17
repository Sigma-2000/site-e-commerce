const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, idempotencyKey }) => {
  const { data, error } = await resend.emails.send(
    {
      from: process.env.ORDER_EMAIL_FROM,
      to,
      replyTo: process.env.ADMIN_ORDER_EMAIL,
      subject,
      html,
    },
    {
      idempotencyKey,
    },
  );

  if (error) {
    throw new Error(error.message || "Resend email failed");
  }

  return data;
};

module.exports = {
  sendEmail,
};
