"use client";

import { useDocuments } from "@/lib/cms/documents-store";
import { CardGrid } from "@/components/layout/CardGrid";
import { Card } from "@/components/ui/Card";
import { Download } from "lucide-react";

export function ResourcesDocumentsGrid() {
  const { documents } = useDocuments();

  return (
    <CardGrid columns={3}>
      {documents.map((doc) => {
        const safeName = (doc.fileName || `${doc.title || "document"}.pdf`).trim();
        const downloadName = safeName.toLowerCase().endsWith(".pdf")
          ? safeName
          : `${safeName.replace(/\.[^/.]+$/, "")}.pdf`;
        const downloadUrl = doc.fileUrl && doc.fileUrl !== "#" ? doc.fileUrl : `/documents/${downloadName}`;

        return (
          <Card key={doc.id} title={doc.title}>
            <p style={{ margin: "0 0 12px 0", color: "#475569", fontSize: 14, lineHeight: 1.5 }}>
              {doc.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#64748b",
                borderTop: "1px solid #f1f5f9",
                paddingTop: 10,
                marginTop: 10,
              }}
            >
              <span>
                {doc.version} • {doc.fileSize}
              </span>
              <span
                style={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "#f1f5f9",
                  color: "#334155",
                }}
              >
                {doc.category}
              </span>
            </div>

            <div style={{ marginTop: 14 }}>
              <a
                href={downloadUrl}
                download={downloadName}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 6,
                  background: "#310e54",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>
            </div>
          </Card>
        );
      })}
    </CardGrid>
  );
}
