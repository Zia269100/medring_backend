import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

export async function sendSMS(to, message) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to
    });

    console.log("SMS sent");
  } catch (err) {
    console.error("SMS failed:", err.message);
  }
}
