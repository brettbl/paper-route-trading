// pages/api/proxy.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { u, n, e } = req.query;

    const url = `${process.env.NEXT_PUBLIC_IXKIO_URL}`;

    const params = new URLSearchParams();
    params.append('a', process.env.NEXT_PUBLIC_IXKIO_ACCOUNT_ID || '');
    params.append('u', String(u));
    params.append('n', String(n));
    params.append('e', String(e));

    try {
        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
}