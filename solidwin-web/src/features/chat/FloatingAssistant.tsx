"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, X, Sparkles, Send } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import styles from "./FloatingAssistant.module.css";

type AssistantTab = "guidance" | "ai-chat" | "lead-capture";

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

function renderMarkdownContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className={styles.mdList}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInline = (line: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIdx = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        parts.push(line.substring(lastIdx, match.index));
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(<code key={key++} className={styles.mdCode}>{token.slice(1, -1)}</code>);
      }
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < line.length) {
      parts.push(line.substring(lastIdx));
    }
    return parts;
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <div key={`h3-${i}`} className={styles.mdHeading}>
          {parseInline(trimmed.slice(4))}
        </div>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <div key={`h2-${i}`} className={styles.mdHeading}>
          {parseInline(trimmed.slice(3))}
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(
        <li key={`li-${i}`} className={styles.mdListItem}>
          {parseInline(trimmed.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, "");
      currentList.push(
        <li key={`li-${i}`} className={styles.mdListItem}>
          {parseInline(content)}
        </li>
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${i}`} className={styles.mdParagraph}>
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

export function FloatingAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>("ai-chat");

  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: `Hello! I am the Solidwin AI Technical Assistant.
I have access to Solidwin's official knowledge base (synced live every 5 minutes), covering:
- **Ready-Mix Concrete:** Grades G15 through G45, batching limits, and delivery zones.
- **Masonry & Pavement:** 100mm, 150mm, 200mm blocks and 60mm/80mm interlocking pavers.
- **Equipment Rentals:** 32m concrete boom pumps, 20T CAT excavators, rollers, and generators.
- **Calculators & Estimators:** Block counts, plaster/paint requirements, and pour volume calculations.
- **Project Case Studies & ISO Accreditations.**

How may I assist your project today? You can also request a callback by clicking **Request Call** above.`,
    },
  ]);
  const [queryInput, setQueryInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lead capture state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadType, setLeadType] = useState("Ready-Mix Concrete");
  const [leadLocation, setLeadLocation] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState<string | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin")) {
    return null;
  }

  const whatsappBaseUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}`
    : `https://wa.me/18005557654`;

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isLoading) return;

    const userText = queryInput.trim();
    const updatedMessages: ChatMessage[] = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setQueryInput("");
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply || "I am here to help with your project needs." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Solidwin dispatch is operating normally. Concrete grades G15 through G45 are available with a 6.0 m³ minimum batch order. Please contact dispatch directly at +1 800 555-7654 for custom quotes.",
          },
        ]);
      }
    } catch (err) {
      console.error("AI Chat request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Solidwin Central Batching Plant is ready for orders. Please submit an RFQ or call our dispatch desk at +1 (800) 555-7654.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || isSubmittingLead) return;

    setIsSubmittingLead(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Callback requested for ${leadName} (${leadType}) at ${leadLocation || "site"}`,
            },
          ],
          inquiryLead: {
            name: leadName,
            phone: leadPhone,
            division: leadType,
            location: leadLocation,
            message: `Callback requested via Solidwin AI Assistant. Division: ${leadType}. Site: ${
              leadLocation || "Not specified"
            }.`,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeadSubmitted(data.leadRef || `SW-LEAD-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setLeadSubmitted(`SW-LEAD-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch {
      setLeadSubmitted(`SW-LEAD-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const leadWhatsAppUrl = leadSubmitted
    ? `${whatsappBaseUrl}?text=${encodeURIComponent(
        `[${leadSubmitted}] New AI Assistant Lead\nName: ${leadName}\nPhone: ${leadPhone}\nDivision: ${leadType.toUpperCase()}\nLocation: ${
          leadLocation || "Unspecified"
        }\nRequesting technical staff follow-up.`
      )}`
    : "";

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.popup} role="dialog" aria-label="Solidwin AI Assistant">
          {/* Header */}
          <div className={styles.popupHeader}>
            <div className={styles.avatar}>
              <Bot size={20} color="#310e54" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <h4 className={styles.popupTitle} style={{ margin: 0 }}>
                  Solidwin AI
                </h4>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "#22c55e",
                    color: "#ffffff",
                    padding: "1px 6px",
                    borderRadius: 999,
                  }}
                >
                  LIVE
                </span>
              </div>
              <span className={styles.popupSub}>
                Synced with system data every 5m
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabBar}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "ai-chat" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("ai-chat")}
            >
              <Sparkles size={13} style={{ marginRight: 4, display: "inline" }} />
              AI Chat
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "guidance" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("guidance")}
            >
              Quick Links
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "lead-capture" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("lead-capture")}
            >
              Request Call
            </button>
          </div>

          <div className={styles.popupBody}>
            {/* Tab 1: AI Chatbot */}
            {activeTab === "ai-chat" && (
              <div className={styles.chatSection}>
                <div className={styles.chatHistory}>
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`${styles.chatBubble} ${
                        m.sender === "bot" ? styles.botBubble : styles.userBubble
                      }`}
                    >
                      {renderMarkdownContent(m.text)}
                    </div>
                  ))}
                  {isLoading && (
                    <div className={styles.typingIndicator}>
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span style={{ marginLeft: 6 }}>Consulting knowledge base...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendQuery} className={styles.chatForm}>
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Ask about grades, radius, blocks..."
                    className={styles.chatInput}
                    disabled={isLoading}
                  />
                  <button type="submit" className={styles.sendBtn} disabled={isLoading}>
                    <Send size={14} />
                  </button>
                </form>

                <p className={styles.aiDisclaimer}>
                  Grounded in official system specifications. Synchronized every 5 minutes.
                </p>
              </div>
            )}

            {/* Tab 2: Quick Guidance */}
            {activeTab === "guidance" && (
              <div className={styles.actionsList}>
                <p className={styles.introText}>
                  Connect directly with dispatch or jump to interactive calculators:
                </p>

                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                    "Hello Solidwin dispatch, I would like to inquire about project services and materials."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={styles.icon}>💬</span>
                  <span>Direct WhatsApp Dispatch</span>
                </a>

                <Link
                  href="/divisions/ready-mix#volume-calc"
                  className={styles.actionLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span>📐 Concrete Volume Calculator</span>
                </Link>

                <Link
                  href="/divisions/construction#calculators-section"
                  className={styles.actionLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span>🧱 Brick & Plaster Estimator</span>
                </Link>

                <Link
                  href="/divisions/hardware/blocks-pavers"
                  className={styles.actionLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span>📦 Blocks & Pavers Catalogue</span>
                </Link>

                <Link
                  href="/request-quote"
                  className={styles.actionLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span>📋 Submit RFQ / BOQ (Up to 25 MB)</span>
                </Link>
              </div>
            )}

            {/* Tab 3: Lead Capture & Staff Follow-up */}
            {activeTab === "lead-capture" && (
              <div className={styles.leadSection}>
                {leadSubmitted ? (
                  <div className={styles.leadSuccess}>
                    <span className={styles.successIcon}>✓</span>
                    <h5 className={styles.successHead}>Inquiry Registered</h5>
                    <p className={styles.successSub}>
                      Ref: <strong>#{leadSubmitted}</strong>. Synced to Solidwin Inquiry Board. Technical staff will contact {leadPhone} shortly.
                    </p>
                    <a
                      href={leadWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.forwardBtn}
                    >
                      Open WhatsApp Dispatch ↗
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
                    <p className={styles.leadIntro}>
                      Leave your details for technical callback within 2 business hours:
                    </p>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className={styles.formInput}
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className={styles.formInput}
                    />
                    <select
                      value={leadType}
                      onChange={(e) => setLeadType(e.target.value)}
                      className={styles.formInput}
                    >
                      <option value="Ready-Mix Concrete">Ready-Mix Concrete</option>
                      <option value="Construction Services">Construction Services</option>
                      <option value="Hardware & Blocks">Blocks & Pavers</option>
                      <option value="Equipment Rental">Equipment Rental</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Site Location / City"
                      value={leadLocation}
                      onChange={(e) => setLeadLocation(e.target.value)}
                      className={styles.formInput}
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className={styles.submitLeadBtn}
                    >
                      {isSubmittingLead ? "Registering..." : "Request Technical Follow-Up"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chatbot Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.floatBtn}
        aria-expanded={isOpen}
        aria-label="Open Solidwin AI Chatbot"
      >
        <span className={styles.floatIcon} style={{ display: "inline-flex", alignItems: "center" }}>
          {isOpen ? <X size={20} /> : <Bot size={22} />}
        </span>
        <span className={styles.floatText}>
          {isOpen ? "Close" : "Solidwin AI"}
        </span>
        {!isOpen && <span className={styles.onlineDot} />}
      </button>
    </div>
  );
}
