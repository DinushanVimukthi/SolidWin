import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Solidwin Admin Dashboard | EXE Client Portal",
  description: "Manage Solidwin website content, RFQs, Ready-mix volume inquiries, and analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminRoot}>
      <AdminSidebar />
      <div className={styles.adminContent}>
        {children}
        <footer
          style={{
            padding: "8px 32px 14px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: "11px",
            color: "#94a3b8",
            marginTop: "auto",
          }}
        >
          <span>Version v0.1.0</span>
        </footer>
      </div>
    </div>
  );
}
