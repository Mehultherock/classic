import type { MetadataRoute } from "next";

const baseUrl = "https://designforge.ai";

const staticRoutes = [
  { url: "/", changeFrequency: "monthly" as const, priority: 1.0 },
  { url: "/templates", changeFrequency: "weekly" as const, priority: 0.9 },
  { url: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
  { url: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/login", changeFrequency: "monthly" as const, priority: 0.3 },
  { url: "/signup", changeFrequency: "monthly" as const, priority: 0.3 },
  { url: "/forgot-password", changeFrequency: "monthly" as const, priority: 0.2 },
  { url: "/reset-password", changeFrequency: "monthly" as const, priority: 0.2 },
  { url: "/verify-email", changeFrequency: "monthly" as const, priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
