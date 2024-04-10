import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/components/providers/loading-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tisog - Gestión de fatiga y sueño",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang="es">
        <LoadingProvider>
          <Toaster richColors position="top-center" />
          {children}
        </LoadingProvider>
      </html>
    </NextAuthProvider>
  );
}
