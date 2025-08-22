import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "@styles/globals.css";
import "@styles/normalize.css";
import "@styles/theme.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { themeScript } from "@/lib/theme-script";
import Sidebar from "@/components/Sidebar/Sidebar";
import RightSidebar from "@/components/RightSidebar/RightSidebar";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tanglr",
  description: "Social networking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={jetBrainsMono.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="app-main">{children}</main>
            <RightSidebar />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
