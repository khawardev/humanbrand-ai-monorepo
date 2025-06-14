// pages/api/read-txt.ts
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), '../../../knowledge_base.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  res.status(200).send(content);
}
