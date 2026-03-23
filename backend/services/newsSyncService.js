const axios = require('axios');
const { NewsArticle } = require('../models');

const GNEWS_BASE_URL = 'https://gnews.io/api/v4/search';

async function syncF1News() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error('Hiányzik a GNEWS_API_KEY a .env fájlból.');
  }

  const response = await axios.get(GNEWS_BASE_URL, {
    params: {
      q: 'Formula 1 OR F1',
      lang: 'en',
      max: 10,
      sortby: 'publishedAt',
      apikey: apiKey,
    },
  });

  const articles = response.data?.articles || [];
  let processed = 0;

  for (const article of articles) {
    if (!article.url || !article.title) continue;

    await NewsArticle.upsert({
      source_name: article?.source?.name || null,
      title: article.title,
      description: article.description || null,
      url: article.url,
      image_url: article.image || null,
      published_at: article.publishedAt || null,
      content_snippet: article.content || null,
      is_active: true,
      last_synced_at: new Date(),
    });

    processed += 1;
  }

  return {
    success: true,
    processed,
  };
}

module.exports = {
  syncF1News,
};