"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  Check,
  Eye,
  Search,
  Calendar,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useProjects } from "@/lib/cms/projects-store";
import { ImageUploadCropper } from "@/components/admin/ImageUploadCropper";
import type { ProjectItem, ProjectSector } from "@/data/projects";
import styles from "../../admin.module.css";

const SECTORS: ProjectSector[] = ["residential", "commercial", "industrial", "infrastructure"];

function parseProjectCompletionDate(raw: string): Date | null {
  if (!raw) return null;
  const s = raw.trim();
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return new Date(parsed);

  // Handle "Q1 2026", "Q2 2026", etc.
  const qMatch = s.match(/Q([1-4])\s+(\d{4})/i);
  if (qMatch) {
    const q = parseInt(qMatch[1], 10);
    const year = parseInt(qMatch[2], 10);
    const month = (q - 1) * 3;
    return new Date(year, month, 1);
  }

  // Handle Month Year e.g. "June 2026"
  const myMatch = s.match(/([a-zA-Z]+)\s+(\d{4})/);
  if (myMatch) {
    const parsedMY = Date.parse(`${myMatch[1]} 1, ${myMatch[2]}`);
    if (!isNaN(parsedMY)) return new Date(parsedMY);
  }

  // Handle 4-digit Year e.g. "2026"
  const yMatch = s.match(/\b(20\d{2})\b/);
  if (yMatch) {
    return new Date(parseInt(yMatch[1], 10), 0, 1);
  }

  return null;
}

export default function AdminProjectsPage() {
  const { projects, loading, addOrUpdate, remove, reset } = useProjects();
  const [filterSector, setFilterSector] = useState<"all" | ProjectSector>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProjectItem>({
    slug: "",
    title: "",
    sector: "commercial",
    location: "",
    completionDate: "",
    scope: "",
    description: "",
    featuredImage: "",
    gallery: [],
    hasBeforeAfter: false,
    beforeImage: "",
    afterImage: "",
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredProjects = projects.filter((p) => {
    // Sector filter
    if (filterSector !== "all" && p.sector !== filterSector) {
      return false;
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchLoc = p.location?.toLowerCase().includes(q);
      const matchScope = p.scope?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchSlug = p.slug?.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchScope && !matchDesc && !matchSlug) {
        return false;
      }
    }

    // Completion date range filter
    if (dateFrom || dateTo) {
      const projDate = parseProjectCompletionDate(p.completionDate);
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime();
        if (!projDate || projDate.getTime() < fromTime) return false;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (!projDate || projDate.getTime() > toDate.getTime()) return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const pagedProjects = filteredProjects.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  const handleOpenAdd = () => {
    setEditingSlug(null);
    setFormData({
      slug: `project-${Date.now().toString(36)}`,
      title: "",
      sector: "commercial",
      location: "Colombo / Central Province",
      completionDate: "Q3 2026",
      scope: "Structural reinforced concrete framing & exterior turnkey envelope",
      description: "High-precision commercial development engineered to BS 8110 standards with certified batching delivery.",
      featuredImage: "",
      gallery: [],
      hasBeforeAfter: false,
      beforeImage: "",
      afterImage: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingSlug(project.slug);
    setFormData({
      ...project,
      gallery: project.gallery || [project.featuredImage],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a project title");
      return;
    }

    if (!formData.featuredImage) {
      alert("Please upload a featured cover image for this project");
      return;
    }

    if (formData.hasBeforeAfter && (!formData.beforeImage || !formData.afterImage)) {
      alert("Please upload both Before and After images for the transformation comparison slider");
      return;
    }

    const cleanSlug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const toSave: ProjectItem = {
      ...formData,
      slug: cleanSlug,
      title: formData.title.trim(),
    };

    await addOrUpdate(toSave);
    setIsModalOpen(false);
    showNotify(editingSlug ? "Project updated successfully!" : "New project published to portfolio!");
  };

  const handleDelete = async (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This will remove it from the public website.`)) {
      await remove(slug);
      showNotify(`Removed "${title}" from portfolio.`);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset portfolio back to standard showcase builds? All custom projects will be cleared.")) {
      await reset();
      showNotify("Portfolio restored to baseline seed.");
    }
  };

  return (
    <>
      <AdminHeader
        title="Portfolio & Projects CMS"
        description="Manage live featured projects, case study data, and interactive before-and-after comparisons."
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

        {/* Action & Filter Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", minWidth: 260, flex: "1 1 260px", maxWidth: 360 }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search projects (title, location, scope)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  padding: "7px 30px 7px 32px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                  }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sector Filter */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Sector:</span>
              <select
                value={filterSector}
                onChange={(e) => {
                  setFilterSector(e.target.value as "all" | ProjectSector);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  fontSize: 13,
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                <option value="all">All Sectors ({projects.length})</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Completion Date Range via Calendar Component */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f8fafc",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12, fontWeight: 600 }}>
                <Calendar size={14} color="#310e54" />
                <span>Completion:</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="date"
                  value={dateFrom}
                  title="Completion Date From"
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "4px 6px",
                    borderRadius: 4,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    background: "#ffffff",
                    color: "#0f172a",
                  }}
                />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>to</span>
                <input
                  type="date"
                  value={dateTo}
                  title="Completion Date To"
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "4px 6px",
                    borderRadius: 4,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    background: "#ffffff",
                    color: "#0f172a",
                  }}
                />
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setCurrentPage(1);
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#dc2626",
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "2px 4px",
                    }}
                    title="Clear date range filter"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons: Reset & Add */}
            <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.actionButton}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                title="Reset to default projects"
              >
                <RefreshCw size={14} />
                <span>Reset</span>
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
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Active Portfolio Projects</h3>
              <p className={styles.cardSubtitle}>
                {loading ? "Loading database..." : `${filteredProjects.length} builds published across website`}
              </p>
            </div>
            <Link
              href="/projects"
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
              <span>View Public Grid</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className={styles.cardBody} style={{ padding: 0 }}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Sector</th>
                    <th>Location</th>
                    <th>Completion</th>
                    <th>Transformation Slider</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedProjects.map((proj) => (
                    <tr key={proj.slug}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 700, color: "#0f172a" }}>{proj.title}</span>
                          <span style={{ fontSize: 12, color: "#64748b" }}>slug: /{proj.slug}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background:
                              proj.sector === "residential"
                                ? "#e0f2fe"
                                : proj.sector === "commercial"
                                ? "#ede9fe"
                                : proj.sector === "industrial"
                                ? "#fef3c7"
                                : "#dcfce7",
                            color:
                              proj.sector === "residential"
                                ? "#0369a1"
                                : proj.sector === "commercial"
                                ? "#6d28d9"
                                : proj.sector === "industrial"
                                ? "#92400e"
                                : "#15803d",
                            textTransform: "capitalize",
                          }}
                        >
                          {proj.sector}
                        </span>
                      </td>
                      <td style={{ color: "#334155", fontSize: 13 }}>{proj.location}</td>
                      <td style={{ color: "#64748b", fontSize: 13 }}>{proj.completionDate}</td>
                      <td>
                        {proj.hasBeforeAfter ? (
                          <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                            ● Active (Before / After)
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>— Standard</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className={styles.actionButton}
                            title="Preview on Public Website"
                            style={{ display: "inline-flex", alignItems: "center" }}
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(proj)}
                            className={styles.actionButton}
                            title="Edit Project"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(proj.slug, proj.title)}
                            className={styles.actionButton}
                            style={{ color: "#dc2626" }}
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "32px 16px", color: "#64748b" }}>
                        No projects match the selected filters. Try clearing the search query or date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredProjects.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  background: "#f8fafc",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: 12.5,
                  color: "#64748b",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span>
                    Showing {Math.min((activePage - 1) * pageSize + 1, filteredProjects.length)} to{" "}
                    {Math.min(activePage * pageSize, filteredProjects.length)} of {filteredProjects.length} builds
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12 }}>Per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        border: "1px solid #cbd5e1",
                        fontSize: 12,
                        background: "#ffffff",
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    disabled={activePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid #cbd5e1",
                      background: activePage <= 1 ? "#f1f5f9" : "#ffffff",
                      color: activePage <= 1 ? "#94a3b8" : "#0f172a",
                      cursor: activePage <= 1 ? "not-allowed" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontWeight: 600, color: "#0f172a", padding: "0 6px" }}>
                    Page {activePage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={activePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid #cbd5e1",
                      background: activePage >= totalPages ? "#f1f5f9" : "#ffffff",
                      color: activePage >= totalPages ? "#94a3b8" : "#0f172a",
                      cursor: activePage >= totalPages ? "not-allowed" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Add / Edit Project */}
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
                maxWidth: "min(960px, 95vw)",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "sticky",
                  top: 0,
                  background: "#ffffff",
                  zIndex: 1,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                    {editingSlug ? "Edit Project Details" : "Add New Project"}
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>
                    Save changes to sync to the public website and Firestore database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: 4,
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Title & Slug */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: val,
                          slug: editingSlug ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        }));
                      }}
                      placeholder="e.g. Skyline Commercial Tower"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 13.5,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="skyline-commercial-tower"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 13.5,
                      }}
                    />
                  </div>
                </div>

                {/* Sector, Location & Completion */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Sector *
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sector: e.target.value as ProjectSector }))}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 13.5,
                        background: "#ffffff",
                      }}
                    >
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Colombo 03"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 13.5,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Completion Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.completionDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, completionDate: e.target.value }))}
                      placeholder="e.g. October 2026"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 13.5,
                      }}
                    />
                  </div>
                </div>

                {/* Scope of Work */}
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Scope of Work
                  </label>
                  <input
                    type="text"
                    value={formData.scope}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scope: e.target.value }))}
                    placeholder="e.g. Turnkey Design & Build, 850 m² commercial frame, 5,000 m³ G35 concrete"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      fontSize: 13.5,
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Full Project Overview / Case Study Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed explanation of construction phases, batching placement and client results..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      fontSize: 13.5,
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Featured Image with Crop Tool */}
                <ImageUploadCropper
                  label="Featured Cover Image (Hero & Portfolio Card)"
                  helperText="Crop to 16:9 Landscape (1200×675 px recommended). File upload required."
                  defaultPresetId="16-9"
                  value={formData.featuredImage}
                  onChange={(val) => setFormData((prev) => ({ ...prev, featuredImage: val }))}
                  required
                />

                {/* Before & After Interactive Comparison */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, fontSize: 13.5 }}>
                    <input
                      type="checkbox"
                      checked={formData.hasBeforeAfter || false}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasBeforeAfter: e.target.checked }))}
                    />
                    <span>Enable Interactive Before / After Comparison Slider</span>
                  </label>

                  {formData.hasBeforeAfter && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
                      <ImageUploadCropper
                        label="Before Image (Site / Excavation)"
                        helperText="4:3 Standard Aspect Ratio (800 × 600 px)"
                        defaultPresetId="4-3"
                        value={formData.beforeImage || ""}
                        onChange={(val) => setFormData((prev) => ({ ...prev, beforeImage: val }))}
                      />
                      <ImageUploadCropper
                        label="After Image (Completed Handover)"
                        helperText="4:3 Standard Aspect Ratio (800 × 600 px)"
                        defaultPresetId="4-3"
                        value={formData.afterImage || ""}
                        onChange={(val) => setFormData((prev) => ({ ...prev, afterImage: val }))}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Project Gallery Photos */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                    Project Photo Gallery ({formData.gallery?.length || 0} Photos)
                  </label>

                  <ImageUploadCropper
                    label="Upload Additional Gallery Shot"
                    helperText="Upload and crop architectural details, interiors, or structural framework (3:2 or 16:9)"
                    defaultPresetId="3-2"
                    onChange={(val) => {
                      if (val) {
                        setFormData((prev) => ({
                          ...prev,
                          gallery: [...(prev.gallery || []), val],
                        }));
                      }
                    }}
                  />

                  {formData.gallery && formData.gallery.length > 0 && (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                      {formData.gallery.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: "relative",
                            width: 100,
                            height: 65,
                            borderRadius: 6,
                            overflow: "hidden",
                            border: "1px solid #cbd5e1",
                            background: "#0f172a",
                          }}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery asset ${idx + 1}`}
                            fill
                            unoptimized
                            style={{ objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                gallery: prev.gallery.filter((_, i) => i !== idx),
                              }))
                            }
                            style={{
                              position: "absolute",
                              top: 3,
                              right: 3,
                              background: "rgba(220, 38, 38, 0.85)",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "50%",
                              width: 18,
                              height: 18,
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {editingSlug ? "Save Project Changes" : "Publish to Portfolio"}
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
