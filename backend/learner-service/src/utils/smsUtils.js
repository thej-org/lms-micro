import axios from "axios";

async function sendSMS(message) {
  const url = `https://app.notify.lk/api/v1/send?user_id=27148&api_key=7FEWXLvm1PUTs6YUur5S&sender_id=NotifyDEMO&to=94765842442&message=${message}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to send SMS: " + error.message);
  }
}

export default sendSMS;
