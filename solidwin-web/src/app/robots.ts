import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  return {
    rules: {
      userAgent: "*",
      allow: isProduction ? "/" : "",
      disallow: isProduction ? [] : ["/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
