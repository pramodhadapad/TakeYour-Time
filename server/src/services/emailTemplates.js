/**
 * Professional HTML email templates for Take Your Time
 */

const bookingConfirmationStudent = ({ studentName, tutorName, tutorEmail, sessionTitle, scheduledAt, duration, mode, location, price, currency, bookingId }) => {
  const dateObj = new Date(scheduledAt);
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const endTime = new Date(dateObj.getTime() + duration * 60000);
  const endTimeStr = endTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const locationText = mode === 'online' ? '🌐 Online Session' : `📍 ${location || 'To be shared'}`;
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e293b 0%,#1e1b4b 50%,#2563eb 100%);padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                Take<span style="color:#60a5fa;">Your</span>Time
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Your learning journey continues</p>
            </td>
          </tr>

          <!-- Success Icon & Title -->
          <tr>
            <td style="padding:32px 40px 16px;text-align:center;">
              <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);margin:0 auto 16px;line-height:64px;font-size:32px;">
                ✓
              </div>
              <h2 style="margin:0;color:#1e293b;font-size:22px;font-weight:700;">Your slot has been booked!</h2>
              <p style="margin:8px 0 0;color:#64748b;font-size:15px;">
                Hi ${studentName}, your session has been successfully booked.
              </p>
            </td>
          </tr>

          <!-- Session Details Card -->
          <tr>
            <td style="padding:8px 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                
                <!-- Session Title -->
                <tr>
                  <td style="padding:20px 24px 12px;" colspan="2">
                    <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Session Details</p>
                    <h3 style="margin:6px 0 0;color:#1e293b;font-size:18px;font-weight:700;">${sessionTitle}</h3>
                  </td>
                </tr>

                <!-- Details Grid -->
                <tr>
                  <td style="padding:8px 24px;" width="50%">
                    <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">📅 DATE</p>
                    <p style="margin:4px 0 0;color:#334155;font-size:14px;font-weight:500;">${dateStr}</p>
                  </td>
                  <td style="padding:8px 24px;" width="50%">
                    <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">⏰ TIME</p>
                    <p style="margin:4px 0 0;color:#334155;font-size:14px;font-weight:500;">${timeStr} — ${endTimeStr}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px;" width="50%">
                    <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">👨‍🏫 TUTOR</p>
                    <p style="margin:4px 0 0;color:#334155;font-size:14px;font-weight:500;">${tutorName}</p>
                  </td>
                  <td style="padding:8px 24px;" width="50%">
                    <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">⏱ DURATION</p>
                    <p style="margin:4px 0 0;color:#334155;font-size:14px;font-weight:500;">${duration} minutes</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px;" width="50%">
                    <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">📍 MODE</p>
                    <p style="margin:4px 0 0;color:#334155;font-size:14px;font-weight:500;">${locationText}</p>
                  </td>
                  <td style="padding:8px 24px 20px;" width="50%">
                    <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;">💰 PRICE</p>
                    <p style="margin:4px 0 0;color:#334155;font-size:14px;font-weight:700;">${currencySymbol}${price}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tutor Contact -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff,#f0f9ff);border:1px solid #bfdbfe;border-radius:12px;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="margin:0;color:#1d4ed8;font-size:13px;font-weight:600;">💬 Need to reach your tutor?</p>
                    <p style="margin:4px 0 0;color:#3b82f6;font-size:14px;">
                      <a href="mailto:${tutorEmail}" style="color:#2563eb;text-decoration:none;font-weight:500;">${tutorEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- About Take Your Time -->
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="background-color:#f1f5f9;border-radius:12px;padding:16px 20px;">
                <p style="margin:0;color:#334155;font-size:13px;line-height:1.6;">
                  <strong style="color:#0f172a;">About Take Your Time:</strong> We are a dedicated platform designed to connect passionate learners with expert tutors for meaningful and personalized educational experiences. Thank you for choosing us for your learning journey!
                </p>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="${process.env.CLIENT_URL || 'https://take-yourtime.vercel.app'}/student/dashboard"
                style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                View My Bookings →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                Booking ID: ${bookingId}<br>
                This is an automated confirmation from <strong>Take Your Time</strong>.<br>
                Please do not reply to this email.
              </p>
              <p style="margin:12px 0 0;color:#cbd5e1;font-size:11px;">
                © ${new Date().getFullYear()} Take Your Time. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};


const bookingNotificationTutor = ({ tutorName, studentName, studentEmail, sessionTitle, scheduledAt, duration, price, currency, bookingId }) => {
  const dateObj = new Date(scheduledAt);
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e293b 0%,#1e1b4b 50%,#2563eb 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                Take<span style="color:#60a5fa;">Your</span>Time
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 8px;color:#1e293b;font-size:20px;">📚 New Booking Received!</h2>
              <p style="margin:0 0 20px;color:#64748b;font-size:15px;">
                Hi ${tutorName}, a student has booked a session with you.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 12px;"><strong style="color:#334155;">Student:</strong> <span style="color:#1e293b;">${studentName}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#334155;">Email:</strong> <a href="mailto:${studentEmail}" style="color:#2563eb;text-decoration:none;">${studentEmail}</a></p>
                    <p style="margin:0 0 12px;"><strong style="color:#334155;">Session:</strong> <span style="color:#1e293b;">${sessionTitle}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#334155;">Date:</strong> <span style="color:#1e293b;">${dateStr} at ${timeStr}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#334155;">Duration:</strong> <span style="color:#1e293b;">${duration} min</span></p>
                    <p style="margin:0;"><strong style="color:#334155;">Price:</strong> <span style="color:#16a34a;font-weight:700;">${currencySymbol}${price}</span></p>
                  </td>
                </tr>
              </table>

              <div style="text-align:center;margin-top:24px;">
                <a href="${process.env.CLIENT_URL || 'https://take-yourtime.vercel.app'}/tutor/dashboard"
                  style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;">
                  View Dashboard →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 40px 24px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Booking ID: ${bookingId} | © ${new Date().getFullYear()} Take Your Time
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};


module.exports = {
  bookingConfirmationStudent,
  bookingNotificationTutor
};
