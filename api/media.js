module.exports = async (req, res) => {
  const token = process.env.IG_TOKEN;
  const userId = process.env.IG_USER_ID;

  if (!token || !userId) {
    res.status(500).json({ error: "Нет IG_TOKEN или IG_USER_ID в настройках Vercel" });
    return;
  }

  try {
    const fields = "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count";
    const url = "https://graph.facebook.com/v23.0/" + userId +
      "/media?fields=" + fields + "&limit=25&access_token=" + token;

    const r = await fetch(url);
    const data = await r.json();

    if (!r.ok || data.error) {
      res.status(500).json({ error: data.error ? data.error.message : "Ошибка Instagram" });
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data.data);
  } catch (e) {
    res.status(500).json({ error: "Не удалось связаться с Instagram" });
  }
};
