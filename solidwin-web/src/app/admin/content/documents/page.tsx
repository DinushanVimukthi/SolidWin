"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useDocuments, type ManagedDocument } from "@/lib/cms/documents-store";
import styles from "../../admin.module.css";

const CATEGORIES = [
  { value: "all", label: "All Documents" },
  { value: "profile", label: "Company Profile" },
  { value: "hseq", label: "HSEQ Policy" },
  { value: "certificate", label: "Certifications" },
  { value: "brochure", label: "Technical Guides" },
] as const;

export default function AdminDocumentsPage() {
  const { documents, loading, addOrUpdate, remove, reset } = useDocuments();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ManagedDocument>({
    id: "",
    title: "",
    description: "",
    category: "profile",
    fileName: "",
    fileSize: "0 KB",
    fileUrl: "",
    version: "v1.0",
    updatedAt: "31 October 2026",
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredDocs = documents.filter((d) =>
    activeCategory === "all" ? true : d.category === activeCategory
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      id: `doc-${Date.now().toString(36)}`,
      title: "",
      description: "",
      category: "profile",
      fileName: "Solidwin_Document.pdf",
      fileSize: "1.2 MB",
      fileUrl: "/documents/Solidwin_Corporate_Profile_2026.pdf",
      version: "v1.0",
      updatedAt: "31 October 2026",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (docItem: ManagedDocument) => {
    setEditingId(docItem.id);
    setFormData(docItem);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeFormatted,
        fileUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a document title");
      return;
    }

    let cleanFileName = (formData.fileName.trim() || `${formData.title.trim() || "Solidwin_Document"}.pdf`);
    if (!cleanFileName.toLowerCase().endsWith(".pdf")) {
      cleanFileName = `${cleanFileName.replace(/\.[^/.]+$/, "")}.pdf`;
    }

    let cleanFileUrl = formData.fileUrl?.trim();
    if (!cleanFileUrl || cleanFileUrl === "#") {
      cleanFileUrl = `/documents/${cleanFileName}`;
    }

    const toSave: ManagedDocument = {
      ...formData,
      id: formData.id || `doc-${Date.now().toString(36)}`,
      fileName: cleanFileName,
      fileUrl: cleanFileUrl,
      updatedAt: "31 October 2026",
    };

    await addOrUpdate(toSave);
    setIsModalOpen(false);
    showNotify(editingId ? "Document updated successfully!" : "New document uploaded and published!");
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await remove(id);
      showNotify(`Removed "${title}" from repository.`);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset documents to default corporate bundle?")) {
      await reset();
      showNotify("Document repository restored to standard baseline.");
    }
  };

  return (
    <>
      <AdminHeader
        title="HSEQ Documents & Corporate Profile CMS"
        description="Upload official company profiles, health & safety manuals, ISO audit accreditations, and client downloadable resources."
      />

      <div className={styles.pageContainer}>
        {notification && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 8,
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Check size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 8 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: activeCategory === cat.value ? "#ffffff" : "transparent",
                  color: activeCategory === cat.value ? "#310e54" : "#64748b",
                  boxShadow: activeCategory === cat.value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleReset}
              className={styles.actionButton}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <RefreshCw size={14} />
              <span>Reset Standards</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className={styles.actionButton}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#310e54",
                color: "#ffffff",
                borderColor: "#310e54",
                padding: "8px 16px",
              }}
            >
              <UploadCloud size={16} />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Managed Corporate Documents &amp; Certificates</h3>
              <p className={styles.cardSubtitle}>
                {loading ? "Loading documents..." : `${filteredDocs.length} files available on public website`}
              </p>
            </div>
            <Link
              href="/resources"
              target="_blank"
              style={{
                fontSize: 13,
                color: "#310e54",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
              }}
            >
              <span>View /resources Page</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className={styles.cardBody} style={{ padding: 0 }}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Document Title</th>
                    <th>Category</th>
                    <th>File Details</th>
                    <th>Version</th>
                    <th>Last Updated</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#310e54",
                            }}
                          >
                            <FileText size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{doc.title}</div>
                            <div style={{ fontSize: 12, color: "#64748b", maxWidth: 380 }}>{doc.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background:
                              doc.category === "profile"
                                ? "#ede9fe"
                                : doc.category === "hseq"
                                ? "#dcfce7"
                                : doc.category === "certificate"
                                ? "#e0f2fe"
                                : "#fef3c7",
                            color:
                              doc.category === "profile"
                                ? "#6d28d9"
                                : doc.category === "hseq"
                                ? "#15803d"
                                : doc.category === "certificate"
                                ? "#0369a1"
                                : "#92400e",
                            textTransform: "uppercase",
                          }}
                        >
                          {doc.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{doc.fileName}</div>
                        <div style={{ fontSize: 11.5, color: "#64748b" }}>{doc.fileSize}</div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{doc.version}</td>
                      <td style={{ fontSize: 13, color: "#64748b" }}>{doc.updatedAt}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <a
                            href={doc.fileUrl || `/documents/${doc.fileName}`}
                            download={doc.fileName.toLowerCase().endsWith(".pdf") ? doc.fileName : `${doc.fileName}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionButton}
                            title="Download PDF"
                            style={{ display: "inline-flex", alignItems: "center" }}
                          >
                            <Download size={14} />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(doc)}
                            className={styles.actionButton}
                            title="Edit Document"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc.id, doc.title)}
                            className={styles.actionButton}
                            style={{ color: "#dc2626" }}
                            title="Delete Document"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "32px 16px", color: "#64748b" }}>
                        No documents in this category. Click &quot;Upload Document&quot; above to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Upload / Edit Document */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 20,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 12,
                width: "100%",
                maxWidth: 600,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                    {editingId ? "Edit Document Metadata" : "Upload Official Document"}
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>
                    Uploaded files are published immediately to the public Resources &amp; HSEQ page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Solidwin Corporate Profile 2026"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value as "profile" | "hseq" | "certificate" | "brochure",
                        }))
                      }
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5, background: "#ffffff" }}
                    >
                      <option value="profile">Company Profile</option>
                      <option value="hseq">HSEQ Policy Manual</option>
                      <option value="certificate">ISO Certification</option>
                      <option value="brochure">Technical Specifications Guide</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Document Version
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                      placeholder="e.g. v2.4 (2026)"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief summary of document content, certifications, and compliance standards..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5, fontFamily: "inherit" }}
                  />
                </div>

                {/* File Upload Zone */}
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Upload File (PDF, DOCX, ZIP)
                  </label>
                  <div
                    style={{
                      border: "2px dashed #cbd5e1",
                      borderRadius: 8,
                      padding: 20,
                      textAlign: "center",
                      background: "#f8fafc",
                    }}
                  >
                    <UploadCloud size={28} color="#310e54" style={{ margin: "0 auto 8px" }} />
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                      Choose a file from your computer
                    </p>
                    <p style={{ margin: "4px 0 12px", fontSize: 11.5, color: "#64748b" }}>
                      Supports PDF up to 25MB
                    </p>
                    <input
                      type="file"
                      id="doc-file-input"
                      accept=".pdf,.doc,.docx,.zip"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="doc-file-input"
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        borderRadius: 6,
                        background: "#310e54",
                        color: "#ffffff",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Browse Files
                    </label>

                    {formData.fileName && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{formData.fileName}</span>
                        <span style={{ color: "#64748b" }}>{formData.fileSize}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 20px",
                      borderRadius: 6,
                      border: "1px solid #310e54",
                      background: "#310e54",
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {editingId ? "Save Document Changes" : "Publish Document"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
