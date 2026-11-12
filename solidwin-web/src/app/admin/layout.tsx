import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Solidwin Admin Dashboard | EXE Central IAM",
  description: "Manage Solidwin website content, RFQs, Ready-mix volume inquiries, and analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
