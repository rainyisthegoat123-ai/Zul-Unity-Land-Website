exports.redis = async (cmd) => {
  const u = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const t = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!u || !t) throw new Error("Redis is not connected to this Vercel project");
  const r = await fetch(u, { method: "POST", headers: { Authorization: "Bearer " + t }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
};
