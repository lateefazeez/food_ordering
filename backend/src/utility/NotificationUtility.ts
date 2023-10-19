// Email

//  notifications

// OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = process.env.APP_TWILIO_ACCOUNT_SID;
  const authToken = process.env.APP_TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+12295955947",
    to: `+1${toPhoneNumber}`,
  });

  return response;
};

// payment notification or emails
