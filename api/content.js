const { redis } = require("./_redis");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const v = await redis(["GET", "zul:content"]);
    res.status(200).json({ data: v ? JSON.parse(v) : null });
  } catch (e) {
    res.status(200).json({ data: null });
  }
};
