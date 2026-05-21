import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const publicDir = path.join(process.cwd(), "public");

function loadAttachment(filename: string): { filename: string; cid: string; content: Buffer } | null {
  try {
    const filePath = path.join(publicDir, filename);
    return {
      filename: path.basename(filename),
      cid: filename.replace(/\//g, "_").replace(/\./g, "_"),
      content: fs.readFileSync(filePath),
    };
  } catch {
    return null;
  }
}

const lightLogo = loadAttachment("images/logo_light.png");
const darkLogo = loadAttachment("images/logo_dark.png");

export const logoCids = {
  light: lightLogo?.cid || "",
  dark: darkLogo?.cid || "",
};

export const logoAttachments = [lightLogo, darkLogo].filter(Boolean) as { filename: string; cid: string; content: Buffer }[];

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
    attachments: logoAttachments,
  });
}
