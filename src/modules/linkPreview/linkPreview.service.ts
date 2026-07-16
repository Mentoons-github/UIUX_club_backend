import fetch from "node-fetch";
import * as cheerio from "cheerio";
import LinkPreviewCache from "./linkPreview.models";

export const getLinkPreviewService = async (url: string) => {
  const cached = await LinkPreviewCache.findOne({ url });

  if (cached) {
    return cached.data;
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch URL");
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const getTag = (property: string) =>
    $(`meta[property="${property}"]`).attr("content") ??
    $(`meta[name="${property}"]`).attr("content") ??
    null;

  const origin = new URL(url).origin;

  const toAbsolute = (href?: string) => {
    if (!href) return null;
    if (href.startsWith("http")) return href;
    return `${origin}${href.startsWith("/") ? "" : "/"}${href}`;
  };

  const imageUrl = getTag("og:image");

  const logoUrl = toAbsolute(
    $('link[rel="icon"][sizes="144x144"]').attr("href") ??
      $('link[rel="apple-touch-icon"]').attr("href") ??
      $('link[rel="icon"]').attr("href"),
  );

  const data = {
    url,
    title: getTag("og:title") ?? $("title").text() ?? null,
    description: getTag("og:description") ?? null,
    image: imageUrl ? { url: imageUrl } : logoUrl ? { url: logoUrl } : null,
    logo: logoUrl ? { url: logoUrl } : null,
    publisher: getTag("og:site_name") ?? null,
    author: getTag("article:author") ?? null,
  };

  await LinkPreviewCache.create({
    url,
    data,
  });

  return data;
};
