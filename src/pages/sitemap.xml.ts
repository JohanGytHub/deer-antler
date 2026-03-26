// ---------------------------------------------------------------------------
// sitemap.xml.ts
// Auto-generated sitemap for deer-antler.jewelry
// Includes: static pages, collection pages, all product pages, all blog posts
// ---------------------------------------------------------------------------

import type { APIRoute } from 'astro';
import { fetchProducts } from '../data/products';
import { blogPosts } from '../data/blog';

const SITE = 'https://deer-antler.jewelry';

// ---------------------------------------------------------------------------
// Static pages — priority and changefreq tuned per page type
// ---------------------------------------------------------------------------
const staticPages = [
  { path: '/',               priority: '1.0', changefreq: 'weekly'  },
  { path: '/rings',          priority: '0.9', changefreq: 'weekly'  },
  { path: '/ring-sets',      priority: '0.8', changefreq: 'weekly'  },
  { path: '/earrings',       priority: '0.7', changefreq: 'weekly'  },
  { path: '/pendants',       priority: '0.7', changefreq: 'weekly'  },
  { path: '/cufflinks',      priority: '0.7', changefreq: 'weekly'  },
  { path: '/tie-clips',      priority: '0.7', changefreq: 'weekly'  },
  { path: '/unique',         priority: '0.7', changefreq: 'weekly'  },
  { path: '/custom',         priority: '0.9', changefreq: 'weekly'  },
  { path: '/about',          priority: '0.6', changefreq: 'monthly' },
  { path: '/sizing-guide',   priority: '0.8', changefreq: 'monthly' },
  { path: '/contact',        priority: '0.5', changefreq: 'monthly' },
  { path: '/return-policy',  priority: '0.4', changefreq: 'monthly' },
  { path: '/blog',           priority: '0.8', changefreq: 'weekly'  },
  // noindex pages deliberately excluded:
  // /search, /disclaimer, /404
];

// ---------------------------------------------------------------------------
// Build date — used as lastmod for static pages
// ---------------------------------------------------------------------------
const today = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// XML helpers
// ---------------------------------------------------------------------------
function url(
  loc:        string,
  lastmod:    string,
  changefreq: string,
  priority:   string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// ---------------------------------------------------------------------------
// GET handler — Astro calls this at build time for static output
// ---------------------------------------------------------------------------
export const GET: APIRoute = async () => {
  const [products] = await Promise.all([fetchProducts()]);

  const staticEntries = staticPages.map((p) =>
    url(`${SITE}${p.path}`, today, p.changefreq, p.priority)
  );

  const productEntries = products.map((p) => {
    const lastmod = (p.updated_at ?? p.published_at ?? today).split('T')[0];
    return url(
      `${SITE}/products/${p.handle}`,
      lastmod,
      'weekly',
      '0.7'
    );
  });

  const blogEntries = blogPosts.map((post) => {
    const lastmod = post.dateModified ?? post.datePublished ?? today;
    return url(
      `${SITE}/blog/${post.slug}`,
      lastmod,
      'monthly',
      '0.6'
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${[...staticEntries, ...productEntries, ...blogEntries].join('\n')}
</urlset>`;

  return new Response(xml, {
    status:  200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
