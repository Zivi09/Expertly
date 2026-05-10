const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a booking confirmation email
 * @param {Object} booking 
 * @param {Object} expert 
 */
const sendConfirmationEmail = async (booking, expert) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not provided. Skipping email.');
      return;
    }

    // Note: If you haven't verified your domain on Resend, 
    // you can only send from 'onboarding@resend.dev' 
    // and only to the email you signed up with.
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Expertly <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [booking.email],
      subject: `Booking Confirmed: Session with ${expert.name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 16px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0F52BA; font-size: 28px; margin-bottom: 8px;">Booking Confirmed!</h1>
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
            <h3 style="margin-top: 0; color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Guest Information</h3>
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
            <p>If you need to reschedule or cancel, please use the <strong>Expertly</strong> mobile app.</p>
            <p style="margin-top: 20px;">&copy; 2026 Expertly App. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return;
    }

    console.log('Email sent successfully via Resend:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
  }
};

module.exports = { sendConfirmationEmail };
