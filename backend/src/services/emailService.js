const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: (process.env.SMTP_HOST || '').includes('gmail') ? 'gmail' : undefined,
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a booking confirmation email
 * @param {Object} booking 
 * @param {Object} expert 
 */
const sendConfirmationEmail = async (booking, expert) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not provided. Skipping email.');
      return;
    }

    const mailOptions = {
      from: `"Session Booking" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking Confirmed: Session with ${expert.name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 16px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF5722; font-size: 28px; margin-bottom: 8px;">Booking Confirmed</h1>
            <p style="color: #666; font-size: 16px;">Your session has been successfully scheduled.</p>
          </div>
          
          <div style="background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Session Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Expert:</strong></td>
                <td style="padding: 8px 0; color: #1a1a1a;">${expert.name} (${expert.category})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #1a1a1a;">${booking.date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #1a1a1a;">${booking.timeSlot}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #1a1a1a;">${booking.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #1a1a1a;">${booking.phone || 'N/A'}</td>
              </tr>
              ${booking.notes ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Notes:</strong></td>
                <td style="padding: 8px 0; color: #1a1a1a;">${booking.notes}</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="text-align: center; color: #999; font-size: 14px; margin-top: 40px;">
            <p>Thank you for choosing our platform. If you need to reschedule, please visit your profile or contact support.</p>
            <p style="margin-top: 20px;">&copy; 2026 Session Booking System. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendConfirmationEmail };
