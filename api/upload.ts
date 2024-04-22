// // pages/api/upload.ts

// import { NextApiRequest, NextApiResponse } from 'next';
// // import { AddFolderAPI } from '@/lib/fetch';

// export default async function uploadHandler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const files = req.body.files;

//     try {
//       const data = await AddFolderAPI(files);
//       res.status(200).json(data);
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       res.status(500).json({ error: "Failed to upload files" });
//     }
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// }
