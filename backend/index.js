const express = require("express");
const dotenv = require("dotenv");
const bp = require("body-parser");
const OpenAI = require("openai");
const cors = require("cors");

const port = process.env.port || 5000;
dotenv.config();

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());

const openai = new OpenAI();

app.get("/", (req, res) => res.send("Notion AI Backend is live!"));

app.post("/translateDocument", async (req, res) => {
  const { documentData, targetLanguage } = req.body;

  try {
    const prompt = `Summarize and Translate the following text to ${targetLanguage}:\n\n"${documentData}"`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    res.json({
      ok: true,
      translatedText: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error translating text:", error.message);
    res.json({
      ok: false,
      translatedText: error.message,
    });
  }
});

app.post("/chatToDocument", async (req, res) => {
  const { documentData, question } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `You're an assistant helping the user to understand the contents of the document. Using the document content given, answer the question. Document Content:\n "${documentData}"`,
        },
        { role: "user", content: "My question is " + question },
      ],
    });

    res.json({
      ok: true,
      summary: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error translating text:", error.message);
    res.json({
      ok: false,
      summary: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;