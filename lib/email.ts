import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWinnerEmail(to: string, amount: number) {
  return resend.emails.send({
    from: "Golf Charity <noreply@golfcharity.app>",
    to,
    subject: "You have won this month's draw",
    html: `<p>Congratulations. Your prize amount is <strong>£${amount.toFixed(2)}</strong>.</p>`,
  });
}
