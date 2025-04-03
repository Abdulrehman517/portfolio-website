"use server";

import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { validateString, getErrorMessage } from "@/lib/utils";

export default async function sendEmail(formData: FormData) {
  const senderEmail = formData.get("senderEmail") as string;
  const message = formData.get("message") as string;

  // Simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return { error: "Invalid sender email" };
  }
  if (!validateString(message, 5000)) {
    return { error: "Invalid message" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Contact Form <${process.env.GMAIL_USER}>`,
      to: "apnahihy@gmail.com",
      subject: "Message from contact form",
      replyTo: senderEmail,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return { data: "Email sent successfully!" };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}
