// Next.js API route for avatar upload (POST)
// This is a placeholder. You must implement file upload logic or proxy to your backend as needed.
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // TODO: Handle avatar upload or proxy to backend
    return res.status(200).json({ success: true, url: null, user: null });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
