const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendRegistrationEmail = async (to, event) => {
  console.log("📨 Email function called for:", to);

  try {
    const info = await transporter.sendMail({
      from: `"CampusFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🎉 Registration Confirmed for ${event.name}`,
      html: `
        <h2>Registration Successful!</h2>
        <p>You are registered for:</p>

        <b>Event:</b> ${event.name}<br/>
        <b>Date:</b> ${new Date(event.start_time).toLocaleString()}<br/>
        <b>Venue:</b> ${event.venue_name}<br/>

        <br/>
        <p>See you there! 🚀</p>
        <hr/>
        <small>CampusFlow Team</small>
      `,
    });

    console.log("✅ Email sent:", info.response);

  } catch (err) {
    console.error("❌ Email error:", err);
  }
};
