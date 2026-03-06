import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { setCorsHeaders } from './_shared/cors';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (setCorsHeaders(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, email, company, message, consentMarketing, consentTransactional } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required fields.' });
        }

        const data = await resend.emails.send({
            from: 'Task Rig Contact Form <onboarding@resend.dev>',
            to: 'info@taskrig.ca',
            subject: `New Contact Form Submission from ${escapeHtml(name)}`,
            html: `
        <div style="font-family: sans-serif; color: #333;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(company || 'N/A')}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
            <br/>
            <h3>SMS Consent Details</h3>
            <p><strong>Marketing Texts:</strong> ${consentMarketing ? 'Provided' : 'Opted Out'}</p>
            <p><strong>Transactional / Reminder Texts:</strong> ${consentTransactional ? 'Provided' : 'Opted Out'}</p>
        </div>
      `,
        });

        if (data.error) {
            throw new Error(data.error.message);
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Resend Error:', err);
        res.status(500).json({ error: 'An error occurred while sending the email.' });
    }
}
