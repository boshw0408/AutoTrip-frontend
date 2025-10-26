import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Proxy requests to backend
  const { method, url, body } = req;
  const backendUrl = `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  }/api${url}`;

  fetch(backendUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((response) => response.json())
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
}
