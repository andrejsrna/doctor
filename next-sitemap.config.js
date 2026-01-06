/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dnbdoctor.com',
  generateRobotsTxt: false, // Since we already created it
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/unsub', '/api/*', '/shop', '/shop/*'],
  generateIndexSitemap: true,
  additionalPaths: async () => {
    // Add dynamic paths
    return [
      {
        loc: '/music',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/music/:slug',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/news',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/news/:slug',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/artists',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
    ]
  },
} 
