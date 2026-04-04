const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_NEWSLETTER_DB_ID;

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://rabbithole.consulting");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || !email.includes("@") || email.length < 5) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    // Check for duplicate
    const existing = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Email",
        title: { equals: email.toLowerCase().trim() },
      },
      page_size: 1,
    });

    if (existing.results.length > 0) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }

    // Add new subscriber
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Email: {
          title: [{ text: { content: email.toLowerCase().trim() } }],
        },
        Source: {
          select: { name: "website" },
        },
        Status: {
          select: { name: "active" },
        },
      },
    });

    return res.status(200).json({ message: "You're in! Stay tuned for AI insights." });
  } catch (err) {
    console.error("Newsletter subscribe error:", err.message);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
