import { Resend } from 'resend';

// Initialize with minimal permissions key - in production use env var
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Golf Charity App <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to the Golf Charity Draw!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>You are now part of a community that plays golf for good.</p>
        <p>Next steps:</p>
        <ul>
            <li>Select your preferred charity</li>
            <li>Start logging your scores (1-45)</li>
            <li>Wait for the monthly draw!</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard">Go to Dashboard</a>
      `
    });
  } catch (error) {
    console.error('Failed to send welcome email', error);
  }
}

export async function sendWinNotification(email: string, amount: number, matchType: string) {
   try {
    await resend.emails.send({
      from: 'Golf Charity App <notifications@resend.dev>',
      to: email,
      subject: 'You Won! 🎉',
      html: `
        <h1>Congratulations!</h1>
        <p>You matched <strong>${matchType.replace('_', ' ')}</strong> numbers in the latest draw.</p>
        <p>Your prize: <strong>£${amount.toFixed(2)}</strong></p>
        <p>Please visit your dashboard to upload verification proof.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/winnings">Claim Prize</a>
      `
    });
  } catch (error) {
    console.error('Failed to send win email', error);
  }
}
