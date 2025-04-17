import nodemailer from "nodemailer";

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    // Creating a Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, //app password
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Learner Manager" <${process.env.EMAIL_USER}>`, // Sender's email address
      to: to, // Recipient's email address
      subject: subject, // Subject line
      text: text, // Plain text body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
