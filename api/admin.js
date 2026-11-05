const crypto = require("crypto");
const { redis } = require("./_redis");
const SPEC = {
  projects: ["year", "name", "desc", "link", "code"],
  scripts: ["name", "desc", "link", "code"],
  packages: ["name", "desc", "link", "code"]
};
const hash = (s) => crypto.createHash("sha256").update(String(s)).digest();
const str = (v, n) => String(v == null ? "" : v).slice(0, n);
function clean(d) {
  const out = {};
  for (const k in SPEC) {
    const arr = Array.isArray(d && d[k]) ? d[k].slice(0, 300) : [];
    out[k] = arr.map((it) => {
      const o = {};
      for (const f of SPEC[k]) {
        if (f === "year") o.year = Number(it.year) || 2023;
        else o[f] = str(f === "link" ? (it.link || it.file) : it[f], f === "code" ? 20000 : 1000);
      }
      return o;
    });
  }
  return out;
}
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  let b = req.body || {};
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const pass = process.env.ADMIN_PASSWORD || require("./_config").password;
  if (!pass || pass.length < 8) return res.status(500).json({ error: "No owner password set yet. Open api/_config.js and type a password of 8 or more characters." });
  if (!crypto.timingSafeEqual(hash(b.password), hash(pass))) {
    await new Promise((r) => setTimeout(r, 600));
    return res.status(401).json({ error: "Wrong password" });
  }
  if (b.action === "check") return res.status(200).json({ ok: true });
  if (b.action === "save") {
    try {
      const s = JSON.stringify(clean(b.data));
      if (s.length > 800000) return res.status(413).json({ error: "Too much content" });
      await redis(["SET", "zul:content", s]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "Storage error: " + e.message });
    }
  }
  res.status(400).json({ error: "Unknown action" });
};
