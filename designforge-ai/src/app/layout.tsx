import type { Metadata } from "next";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const calistoga = Calistoga({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-calistoga",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DesignForge AI - Create Professional Designs in Seconds with AI",
    template: "%s | DesignForge AI",
  },
  description:
    "Generate professional designs instantly for weddings, birthdays, businesses, schools, festivals, marketing campaigns, and social media using AI.",
  keywords: [
    "AI design",
    "invitation maker",
    "poster maker",
    "graphic design",
    "AI generator",
    "Canva alternative",
    "design tool",
  ],
  authors: [{ name: "DesignForge AI" }],
  creator: "DesignForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://designforge.ai",
    siteName: "DesignForge AI",
    title: "DesignForge AI - Create Professional Designs in Seconds with AI",
    description:
      "Generate professional designs instantly with AI. Invitations, posters, flyers, banners, certificates, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DesignForge AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DesignForge AI - Create Professional Designs in Seconds with AI",
    description:
      "Generate professional designs instantly with AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111827",
              color: "#f8fafc",
              border: "1px solid #1e293b",
              borderRadius: "0.75rem",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#111827" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#111827" },
            },
          }}
        />
      </body>
    </html>
  );
}
