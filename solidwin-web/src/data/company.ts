/**
 * Company facts. Only values supplied by the client belong here.
 * Anything not yet supplied is left undefined so the UI can show a clear fallback
 * instead of inventing details.
 */
export interface ContactDetails {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
}

export const contactDetails: ContactDetails = {
  phone: undefined,
  email: undefined,
  address: undefined,
  hours: undefined,
};

export const companyValues = [
  {
    id: "quality",
    title: "Quality",
    description: "Dependable materials and workmanship on every project.",
  },
  {
    id: "safety",
    title: "Safety",
    description: "Health, safety, environment and quality practices at every stage.",
  },
  {
    id: "partnership",
    title: "Partnership",
    description: "Clear communication from first discussion through to handover.",
  },
] as const;

export const hseqDocuments = [
  {
    id: "company-profile",
    title: "Company Profile",
    description: "Overview of Solidwin's divisions and capabilities.",
    /** Set once the final PDF is placed in /public/documents. */
    href: undefined as string | undefined,
  },
  {
    id: "hseq-policy",
    title: "HSEQ Policy",
    description: "Health, safety, environment and quality commitments.",
    href: undefined as string | undefined,
  },
  {
    id: "certificates",
    title: "Certificates",
    description: "Certifications held by Solidwin.",
    href: undefined as string | undefined,
  },
];
