const express = require("express");
const router = express.Router();
const Paste = require("../models/Paste");
const { nanoid } = require("nanoid/non-secure");
const { getNow } = require("../utils/time");
const escapeHtml = require("escape-html");

/* HEALTH */
router.get("/healthz", async (req, res) => {
  try {
    await Paste.findOne();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

/* CREATE PASTE */
router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Content required" });

  if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1))
    return res.status(400).json({ error: "ttl_seconds must be >=1 integer" });

  if (max_views && (!Number.isInteger(max_views) || max_views < 1))
    return res.status(400).json({ error: "max_views must be >=1 integer" });

  const id = nanoid(6);
  const now = new Date();

  const expiresAt = ttl_seconds
    ? new Date(now.getTime() + ttl_seconds * 1000)
    : null;

  await Paste.create({
    pasteId: id,
    content,
    expiresAt,
    maxViews: max_views || null,
    views: 0
  });

  res.json({
    id,
    url: `${process.env.BASE_URL}/p/${id}`
  });
});

/* API FETCH */
router.get("/pastes/:id", async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  if (paste.expiresAt && now > paste.expiresAt)
    return res.status(404).json({ error: "Expired" });

  if (paste.maxViews && paste.views >= paste.maxViews)
    return res.status(404).json({ error: "View limit exceeded" });

  /* ATOMIC INCREMENT */
  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views: paste.maxViews
      ? Math.max(0, paste.maxViews - paste.views)
      : null,
    expires_at: paste.expiresAt
  });
});

/* HTML VIEW */
router.get("/html/:id", async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.status(404).send("Not Found");

  const now = getNow(req);

  if (paste.expiresAt && now > paste.expiresAt)
    return res.status(404).send("Expired");

  if (paste.maxViews && paste.views >= paste.maxViews)
    return res.status(404).send("View Limit Exceeded");

  paste.views += 1;
  await paste.save();

  const safeContent = escapeHtml(paste.content);

  res.send(`
    <html>
      <body style="font-family:Arial;padding:40px;">
        <h2>Paste</h2>
        <pre>${safeContent}</pre>
      </body>
    </html>
  `);
});

module.exports = router;
