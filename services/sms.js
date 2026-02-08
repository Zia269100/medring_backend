import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

export const sendSMS = async (to, msg) => {
  await client.messages.create({
    body: msg,
    from: process.env.TWILIO_PHONE,
    to
  });
};