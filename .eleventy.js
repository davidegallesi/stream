const fs    = require("fs");
const path  = require("path");

const PATH_PREFIX = "/stream/";

const WIKILINK_RE = /\[\[\.\/([^\]|]+?)(?:\|[^\]]+?)?\]\]/g;

const ICONS = {
  note: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z" fill="currentColor"/><path d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z" fill="currentColor"/></svg>`,

  quote: `<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M4 8.5C4 6.6 5.6 5 7.5 5v2C6.7 7 6 7.7 6 8.5V10h2v5H4V8.5zM11 8.5C11 6.6 12.6 5 14.5 5v2c-.8 0-1.5.7-1.5 1.5V10h2v5h-4V8.5z"/></svg>`,

  image: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13C8.65685 13 10 11.6569 10 10C10 8.34315 8.65685 7 7 7ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V6C24 4.34315 22.6569 3 21 3H3ZM21 5H3C2.44772 5 2 5.44772 2 6V18C2 18.5523 2.44772 19 3 19H7.31374L14.1924 12.1214C15.364 10.9498 17.2635 10.9498 18.435 12.1214L22 15.6863V6C22 5.44772 21.5523 5 21 5ZM21 19H10.1422L15.6066 13.5356C15.9971 13.145 16.6303 13.145 17.0208 13.5356L21.907 18.4217C21.7479 18.7633 21.4016 19 21 19Z" fill="currentColor"/></svg>`,

  link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14.8284 12L16.2426 13.4142L19.071 10.5858C20.6331 9.02365 20.6331 6.49099 19.071 4.9289C17.509 3.3668 14.9763 3.3668 13.4142 4.9289L10.5858 7.75732L12 9.17154L14.8284 6.34311C15.6095 5.56206 16.8758 5.56206 17.6568 6.34311C18.4379 7.12416 18.4379 8.39049 17.6568 9.17154L14.8284 12Z" fill="currentColor"/><path d="M12 14.8285L13.4142 16.2427L10.5858 19.0711C9.02372 20.6332 6.49106 20.6332 4.92896 19.0711C3.36686 17.509 3.36686 14.9764 4.92896 13.4143L7.75739 10.5858L9.1716 12L6.34317 14.8285C5.56212 15.6095 5.56212 16.8758 6.34317 17.6569C7.12422 18.4379 8.39055 18.4379 9.1716 17.6569L12 14.8285Z" fill="currentColor"/><path d="M14.8285 10.5857C15.219 10.1952 15.219 9.56199 14.8285 9.17147C14.4379 8.78094 13.8048 8.78094 13.4142 9.17147L9.1716 13.4141C8.78107 13.8046 8.78107 14.4378 9.1716 14.8283C9.56212 15.2188 10.1953 15.2188 10.5858 14.8283L14.8285 10.5857Z" fill="currentColor"/></svg>`,

};

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");

  eleventyConfig.addCollection("stream", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/stream/*.md")
      .filter((p) => p.data.published !== false)
      .sort((a, b) => b.date - a.date);
  });

  ["note", "link", "quote", "image"].forEach((type) => {
    eleventyConfig.addCollection(`stream_${type}`, function (collectionApi) {
      return collectionApi
        .getFilteredByGlob("src/stream/*.md")
        .filter((p) => p.data.published !== false && p.data.type === type)
        .sort((a, b) => b.date - a.date);
    });
  });

  eleventyConfig.addFilter("htmlDateString", (date) =>
    new Date(date).toISOString().split("T")[0]);

  eleventyConfig.addFilter("year", (date) => new Date(date).getFullYear());

  eleventyConfig.addFilter("streamYears", function (collection) {
    const years = [...new Set(collection.map((p) => new Date(p.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  });

  eleventyConfig.addFilter("dataLeggibile", (date) =>
    new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }));

  eleventyConfig.addFilter("ora", (date) =>
    new Date(date).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));

  eleventyConfig.addFilter("twoMonthsAgo", function () {
    const d = new Date();
    d.setMonth(d.getMonth() - 2);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  eleventyConfig.addFilter("rfc3339", (date) => new Date(date).toISOString());

  eleventyConfig.addFilter("head", (array, n) => array.slice(0, n));

  // Restituisce l'SVG inline per il tipo di post
  eleventyConfig.addFilter("postIcon", (type) => ICONS[type] || "");

  // ── Backlinks ──────────────────────────────────────────────────────────────
  eleventyConfig.addFilter("backlinksFor", function (inputPath, collection) {
    const currentSlug = path.basename(inputPath, path.extname(inputPath));
    return collection.filter((post) => {
      const postSlug = path.basename(post.inputPath, path.extname(post.inputPath));
      if (postSlug === currentSlug) return false;
      try {
        const raw = fs.readFileSync(post.inputPath, "utf8");
        WIKILINK_RE.lastIndex = 0;
        return [...raw.matchAll(WIKILINK_RE)]
          .some(([, slug]) => slug.trim() === currentSlug);
      } catch { return false; }
    });
  });

  // ── WikiLinks ──────────────────────────────────────────────────────────────
  eleventyConfig.addTransform("wikilinks", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(
      /\[\[\.\/([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,
      (_, slug, label) => {
        const text = label ? label.trim() : slug.trim();
        return `<a href="${PATH_PREFIX}stream/${slug.trim()}/" class="wikilink">${text}</a>`;
      }
    );
  });

  // ── External inline links ─────────────────────────────────────────────────
  // Aggiunge target="_blank", rel e classe a tutti i link <a> nel corpo dei
  // post che non sono già wikilink o external-link (tipo post link).
  eleventyConfig.addTransform("externalLinks", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(
      /<a\s+href="(https?:\/\/[^"]+)"(?![^>]*class="(?:wikilink|external-link)")[^>]*>([\s\S]*?)<\/a>/g,
      (match, href, text) => {
        // Salta se già ha target o una delle classi gestite
        if (match.includes('target=') || match.includes('external-link') || match.includes('wikilink')) {
          return match;
        }
        return `<a href="${href}" class="inline-external" target="_blank" rel="noopener">${text}</a>`;
      }
    );
  });
  // ──────────────────────────────────────────────────────────────────────────

  return {
    pathPrefix: PATH_PREFIX,
    dir: { input: "src", output: "_site", includes: "_includes" },
  };
};
