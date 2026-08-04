import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// HTML email template
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!process.env.EMAIL_ADDRESS || !process.env.GMAIL_PASSKEY) {
      return NextResponse.json({
        success: false,
        message: 'The contact form is not configured yet — email delivery is unavailable right now. Please reach out directly instead.',
      }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSKEY,
      },
    });

    await transporter.sendMail({
      from: 'Portfolio Contact Form',
      to: process.env.EMAIL_ADDRESS,
      subject: `New Message From ${name}`,
      text: `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${message}`,
      html: generateEmailTemplate(name, email, message),
      replyTo: email,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    }, { status: 500 });
  }
};
