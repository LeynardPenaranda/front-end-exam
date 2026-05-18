import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farmer Dashboard | AgriConnect",
};

export default function FarmerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
