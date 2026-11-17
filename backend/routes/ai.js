const express = require("express");
const router = express.Router();

const SYSTEM_PROMPT = `You are NestBot, the friendly AI campus assistant for NearNest (a hyperlocal circular marketplace for students and campus residents).
NearNest allows students to:
1. Buy, Rent (with daily pricing), and Donate items for free.
2. Prevent scams using a 4-digit Pickup Handshake Code at campus meetups.
3. Broadcast requests on the "I Need This" demand board.
4. Find items nearby using live distance badges and Leaflet map pickers.
5. Safe campus meetups: daylight hours, crowded spots like canteen, library gate, hostel entrance.
Keep answers friendly, concise (2-4 sentences max), student-focused, and helpful.`;

// Quick fallback answers for offline or non-API key runs
function getLocalFallback(msg = "") {
  const q = msg.toLowerCase();
  if (q.includes("rent")) {
    return "To rent an item, click 'Rent Item' on the product card, choose how many days you need it, and submit! Once the seller accepts, meet up safely and exchange the 4-digit pickup code.";
  }
  if (q.includes("pickup") || q.includes("code") || q.includes("handshake")) {
    return "When an order is confirmed, the buyer gets a unique 4-digit Pickup Code. At the meetup, after verifying the item, the buyer gives this code to the seller to complete the handover safely!";
  }
  if (q.includes("need") || q.includes("request")) {
    return "Looking for something not listed? Switch to the 'I Need This' tab and post a request with your budget and timeframe. Nearby students will see it and reach out!";
  }
  if (q.includes("safe") || q.includes("meet") || q.includes("where")) {
    return "For campus safety, always meet during daylight in busy areas like the Central Library gate, Student Canteen, or Main Academic Block. Never exchange money beforehand!";
  }
  if (q.includes("sell") || q.includes("list") || q.includes("post")) {
    return "To list an item, click 'Post an Item' in the top navbar. You can choose to Sell, Rent (per day), or Donate it for free to help fellow campus students.";
  }
  return "Hey there! I'm NestBot, your NearNest campus helper. Ask me anything about renting items, the 4-digit pickup code, safe meetup spots, or posting on the 'I Need This' board!";
}

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Use Gemini API if key is present
    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nStudent asks: ${message}` }] }
            ],
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return res.json({ reply: reply.trim() });
        }
      } catch (apiErr) {
        console.warn("Gemini API fetch error, falling back to local:", apiErr.message);
      }
    }

    // Local smart fallback
    const reply = getLocalFallback(message);
    res.json({ reply });
  } catch (err) {
    console.error("NestBot error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
