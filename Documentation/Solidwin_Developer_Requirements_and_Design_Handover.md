# Solidwin Website Development Requirements

Requirements and design handover for the EXE senior developer  
Version 1.0  \|  26 October 2026  \|  Delivery date to be confirmed

## **Development instruction**

Please begin discovery, architecture and project setup for the Solidwin Multi-Division Corporate Website. Build the public website for Construction Services, Ready-Mix Concrete, and Hardware with its block manufacturing and equipment rental operations. Implement the website administration as a Solidwin workspace inside the EXE client portal, with an admin dashboard and website analytics.

Use Vercel for the public website and continuous deployment previews so EXE can show working progress to the client. EXE will supply the approved design as either a Figma prototype or an implemented frontend. This document defines the functional scope and design handoff requirements; it does not replace the forthcoming visual design.

## **Scope and ownership**

| AREA | REQUIREMENT |
| :---- | :---- |
| Public website | One corporate brand with three division landing pages, portfolio, calculators, catalogues, maps, chatbot and RFQs. |
| EXE client portal | Solidwin-specific admin dashboard within the existing portal; manage website content, requests, analytics and purchased EXE services. |
| Future division | Prepare modular navigation and content structures for Precast Concrete. Its catalogue and drawing upload workflow are future development. |
| Design ownership | EXE supplies Figma or frontend assets; developer reviews completeness and implements approved responsive behaviour. |
| Commercial scope | No budget or fixed delivery date is assigned in this technical handover. Confirm estimates and dependencies with EXE. |

## **First actions**

* Review the existing EXE portal repository, authentication, roles, tenant model, database, analytics and deployment setup before choosing the integration approach.  
* Confirm access to the project repository, Vercel, storage, maps, AI and WhatsApp services. Record missing credentials and client content as dependencies.  
* Submit a brief architecture decision and phased estimate. Establish the first Vercel review deployment with an application shell and labelled sample content.  
* Proceed with data models, API contracts and non-visual setup while design is pending. Obtain EXE approval of the visual handoff before final styling.

# **Public website functional requirements**

## **Construction Services**

* CON-01: Show vision and mission, Why Choose Solidwin, and Residential, Commercial, Industrial, and Turnkey Design and Build service cards. Provide HSEQ documents, certificates and the company profile PDF for viewing or download.  
* CON-02: Provide portfolio filtering by Residential, Commercial, Industrial and Infrastructure. Project details include title, sector, scope, completion date, client/location and image gallery. Selected projects support interactive before-and-after sliders.  
* CON-03: Brick/block calculator accepts wall length, height and block dimensions; display a rounded-up whole-block count including 5% breakage. State unit and mortar-joint assumptions.  
* CON-04: Plaster/paint calculator accepts surface area in m² or sq.ft and returns indicative cement/sand bags or paint litres. Display approved thickness, mix ratio, bag capacity, coverage and coat assumptions.  
* CON-05: RFQ fields: name, phone, email, project type, location, estimated budget and description. Accept PDF, DWG, PNG and JPG attachments up to 25 MB. No CAD rendering is required.

## **Ready Mix Concrete**

* RMC-01: Grade catalogue includes G15, G20, G25, G30, G35 and supplied additional grades. Show characteristic strength in N/mm², slump range and recommended applications. Publish only client-approved specifications.  
* RMC-02: Volume calculator supports slab L × W × D, circular column π × r² × H, and stairs with an approved geometry. Support metres/feet, convert outputs to m³, and offer optional 5% wastage. Label radius versus diameter explicitly.  
* RMC-03: Request Quote for this Volume scrolls to the form and fills calculated m³ and selected mix grade without losing other entered fields.  
* RMC-04: Request fields: contact details, target pour date/time slot, grade, quantity in m³, pump truck yes/no and site access restrictions. Requests require staff confirmation; the form does not promise availability.  
* RMC-05: Google Maps shows batching plant coordinates and configurable radius rings, initially 15/30/45 km subject to confirmation. Rings represent indicative coverage, not driving distance or dispatch eligibility.

## **Hardware and Sub Businesses**

* HWD-01: Display store map, hours and counter telephone links; provide a manageable brand logo grid or carousel.  
* HWD-02: Block/paver catalogue shows dimensions, compressive strength and applications. Equipment catalogue shows machinery, images, rental terms and minimum hire duration.  
* HWD-03: RFQ captures contractor name, company/site location, contact details, manual item list and Excel/PDF BOQ upload. Proposed Excel formats are XLS/XLSX. Confirm its attachment count and limit at discovery.

# **EXE portal administration and analytics**

## **Portal integration requirement**

Expose Solidwin Website from the client’s purchased-services area within the EXE portal. Opening it must show the Solidwin dashboard using the portal’s existing authenticated session and navigation. Reuse the portal design system, account management and permissions. Do not create a second client login or an independently managed admin application.

Every resource and API operation must enforce Solidwin tenant membership on the server. Derive tenant scope from the verified session rather than trusting a tenant ID supplied by the browser. EXE platform administrators may manage authorized client workspaces; Solidwin users must never access another client’s data.

| ROLE | PROPOSED ACCESS TO CONFIRM |
| :---- | :---- |
| EXE administrator | Provision the website workspace, configure integrations, grant permissions and handle support. |
| Solidwin administrator | Manage Solidwin content, staff permissions where authorized, inquiries and analytics. |
| Solidwin content editor | Manage approved content/catalogues; no integration secrets or other-tenant access. |
| Solidwin viewer | Read approved dashboard and reports only. |

## **Administration modules**

* Dashboard: date-filtered traffic and inquiry summaries, division breakdown, recent RFQs, delivery failures and quick actions. Include empty, loading and error states.  
* Content: project CRUD, categories, galleries, before/after pairs, service content, HSEQ/profile downloads, grades/specifications, brands, blocks/pavers, rental equipment, hours and locations. Provide draft/publish where content approval is needed.  
* Inquiries: separate construction, ready-mix, hardware and AI lead lists; search and filters, detail view, secure attachment access, staff notes and configurable New/In Progress/Closed status. Log status and publication changes.  
* Integrations and support: authorized configuration, dispatch status, controlled retry, FAQ knowledge content, links to purchased EXE services and portal support requests. Keep provider credentials server-side.

## **Website analytics**

Track page views, sessions where supported, top pages, referral sources and device categories. Record division, RFQ submissions, calculator-to-RFQ actions, WhatsApp clicks, profile downloads and qualified chatbot leads. A WhatsApp click is an engagement event, not a confirmed lead or sale.

Choose the analytics provider after auditing portal capabilities. Define event names and consent behaviour before implementation. Display date ranges, metric definitions and last update time. Exclude preview/test traffic, avoid names, phone numbers and attachment links in analytics events, and document retention and access controls.

## **Indicative data model**

Reuse portal tenant, user, role and subscription/service records. Add tenant-scoped projects, galleries, documents, services, mix grades, products/equipment, branches, inquiries, attachments, lead delivery attempts, FAQ entries and audit records. Keep reporting event identifiers consistent with inquiry and division identifiers.

# **Forms AI and integration design**

## **Shared form handling**

Validate on both client and server, with clear required-field errors, accessible labels, upload progress and success/failure states. Apply reCAPTCHA v3 or Turnstile to every submission flow, including chatbot lead capture. Reject unsupported types, invalid dimensions/quantities and oversize uploads. Confirm file-count limits and expiry policies before build completion.

Persist an inquiry and its attachment references before requesting notifications. Use request IDs or idempotency keys to prevent duplicate leads and messages from retries or double clicks. Store timestamps, source division, lifecycle status and provider dispatch outcome.

## **Attachment architecture**

Use short-lived upload authorization to send large files directly to approved private object storage, then submit the attachment reference with the inquiry. Verify completion, type, size and ownership server-side. Protect downloads through authenticated or expiring links. Never use a public permanent URL for private plans or BOQs. Confirm retention and cleanup rules, including orphaned uploads.

This approach is required to support the 25 MB client requirement without sending the file through the Vercel application request body. Uploaded files must not depend on the deployment filesystem. Include a full 25 MB upload acceptance test.

## **AI assistant**

Ground responses in Solidwin-approved service offerings, regions and FAQs. Capture name, phone, requirement type and project location for lead handoff. Explain when staff follow-up is needed, avoid binding technical/pricing promises, and provide a useful fallback during provider failure. Knowledge-base updates are managed through authorized portal controls; a new foundation model is not required.

## **WhatsApp forwarding**

Trigger forwarding for each accepted RFQ and qualified AI lead. Format the division, inquiry ID, applicant details, requirements and controlled attachment links. Use the approved WhatsApp Business API or Twilio provider, designated management recipient and approved templates as required. The floating chat button is a separate direct-chat action.

Queue dispatch through a durable background service compatible with the chosen backend. Use bounded retries, provider idempotency where available, delivery-state tracking and authorized manual retry. Do not rely on work continuing after a serverless response. Provider outages must not discard inquiries or falsely mark messages delivered.

## **Security and performance acceptance**

Enforce HTTPS, authorization, tenant isolation, secure secret handling, rate limits and audit logging. Use privacy-conscious logging and backups. Include responsive image sizes, lazy-loaded maps/chat and caching. Target mobile PageSpeed above 85 and sub-two-second loading under an agreed measurement method; record actual results and third-party limitations.

SEO delivery includes dynamic titles/descriptions, OpenGraph tags, appropriate local business schema, sitemap and indexing controls. Preview deployments must be excluded from search indexing.

# **Design handoff and interface specification**

## **Forthcoming visual source**

EXE will send either a Figma prototype or an implemented frontend. The visual source will define Solidwin’s public website branding and layouts. The EXE proposal/agreement theme is a document theme and must not be assumed to be the client website design. The admin module follows the existing EXE portal design system.

| HANDOFF FORMAT | DEVELOPER ACTION |
| :---- | :---- |
| Figma prototype | Review pages, components, assets, typography, colours, spacing, breakpoints and interactions. Log missing states, obtain EXE decisions, and implement reusable components. |
| Implemented frontend | Audit framework, routes, components, dependencies, assets and responsiveness. Preserve the approved visual design while replacing mock data with validated APIs and integrating forms and tools. |

## **Public screen checklist**

* Corporate home and division entry points; about/vision/mission; construction services; portfolio grid and project detail; before/after component; document download area.  
* Construction calculators and RFQ; ready-mix grade catalogue, volume calculator, booking form and plant coverage map.  
* Hardware branch information, brand showcase, blocks/pavers and rental catalogue, and bulk-material RFQ.  
* Shared header/footer, floating WhatsApp, chatbot, privacy/consent surfaces as supplied, form confirmation, validation errors, 404 and integration-unavailable states.

## **Portal screen checklist**

* Solidwin purchased-service entry, website overview dashboard, content list/editor, project media manager, catalogue editors, inquiry list/detail and attachment access.  
* Analytics with date filters, lead delivery history/retry, FAQ editor, and role-appropriate settings. Reuse portal support and service-management screens.

## **Responsive and interaction rules**

Prepare desktop, tablet and mobile behaviour from the supplied design. If breakpoints are missing, propose them to EXE. Keep forms usable on narrow screens, tables readable, menus keyboard-accessible and focus visible. Sliders must work with touch and keyboard. Use labelled fields and clear unit selectors rather than relying on placeholders alone.

## **Design review and completion**

Keep a handoff checklist containing source link/repository, design version, page inventory, assets, interaction notes, content gaps and EXE approval. Share the first complete home/division layout and portal dashboard through Vercel before repeating the design across all screens. Resolve visual deviations with EXE and record approved changes.

Design deliverables: responsive implementation, shared component inventory, completed state coverage and screenshots linked to the reviewed deployment. This is an implementation specification, not a supplied Figma prototype or finished frontend.

# **Vercel delivery workflow and completion**

## **Continuous deployment for client review**

Connect the EXE-owned Git repository to the EXE-approved Vercel project from the beginning. Each feature branch or pull request should produce a preview deployment. Keep an agreed review branch and stable branch URL for the client, supplemented by immutable milestone deployment URLs and a short changelog. Verify that the client can open the review link with the intended access settings.

Use isolated preview configuration and sample data. Route notification tests to EXE test recipients, not the client’s live management number. Production releases use the protected production branch only after EXE acceptance; confirm the branch mapping so review updates cannot accidentally publish to the live client domain.

## **Hosting decision**

Recommended starting point: a Vercel-compatible frontend, such as Next.js if no frontend has yet been supplied, integrated with the existing EXE portal API. The previous quotation described Laravel/React as a proposed approach; final architecture must reflect the portal and supplied frontend. If Laravel remains the backend, host it on a suitable separate service and connect the Vercel frontend through authenticated APIs. Do not assume a conventional Laravel server or persistent queue worker will run as an ordinary Vercel frontend deployment.

Keep database, private media storage and durable jobs on approved persistent services. Configure preview and production secrets separately, authorization/CORS boundaries, migrations, monitoring and rollback notes. Choose the service providers with EXE rather than provisioning unapproved paid subscriptions.

## **Milestone evidence and acceptance**

| MILESTONE | EVIDENCE REQUIRED |
| :---- | :---- |
| Foundation | Repository, architecture note, Vercel preview link and portal integration plan. |
| Public website | Three division flows, responsive screenshots, portfolio and catalogue demonstrations. |
| Portal and automation | Tenant-restricted CRUD, inquiry records, analytics events, AI capture and WhatsApp test delivery/retry evidence. |
| Acceptance and handover | Passing calculator samples; RFQ auto-fill; valid/invalid and 25 MB uploads; role and tenant-isolation checks; end-to-end preview demo; performance/SEO checks; deployment and recovery documentation. |

## **Support commitments to enable**

Provide free EXE portal access, a custom website dashboard with analytics, one year of service and maintenance from launch, technical guidance, administrator training, backup/recovery assistance, minor content-update assistance and support for delivered integrations. Document operational ownership, backup arrangements and support procedures. New features, major redesigns and third-party usage/subscription fees remain separate.

## **Items to confirm with EXE before dependent work**

Portal access and schema; design handoff date; final frontend/backend stack; hosting and integration accounts; analytics provider; client-approved calculator coefficients and stair geometry; attachment counts and retention; real catalogue and map data; review access; target dates and delivery estimate. Start independent setup while these items are resolved.

Technical references checked 26 October 2026: vercel.com/docs/git and vercel.com/docs/errors/function\_payload\_too\_large. Recheck provider limits and project settings during setup.