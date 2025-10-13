# Product Requirements Document: Bilingual Islamic Article Platform

## Executive Summary

This document outlines the requirements for a bilingual (Malay & English) Islamic Article Platform, designed for academic authors, researchers, and students. The platform will feature academic-style content with APA referencing for Quran, Hadith, and scholar quotes, mirroring the clean, modern, and minimalist design of Medium.com. It will incorporate a robust review and approval workflow, Google OAuth 2.0 for authenticated access, and a PERN stack (PostgreSQL, Express, React, Node.js) deployed via Docker Compose with Traefik for reverse proxy and automated HTTPS.

## Objectives & Problem Statement

**Problem:** The primary problem this platform solves is the scarcity of high-quality, academically-rigorous, bilingual Islamic content accessible to a global audience. Existing platforms often lack proper academic referencing, a streamlined review process, and a user-friendly interface optimized for long-form reading in both Malay and English.

**Objectives:**
1.  To provide a centralized platform for academic authors, researchers, and students to publish and access Islamic articles in both Malay and English.
2.  To ensure all content adheres to academic standards, including APA-style referencing for religious texts and scholarly quotes.
3.  To implement a transparent and efficient review and approval workflow to maintain content quality and authenticity.
4.  To offer a clean, minimalist, and distraction-free reading experience akin to Medium.com.
5.  To facilitate secure and easy access for authenticated users via Google Sign-In.
6.  To establish a scalable and secure technical architecture using modern web technologies and deployment practices.

## Target Audience

The primary target audience for this platform includes:

*   **Academic Authors:** Scholars and researchers in Islamic studies looking to publish their work.
*   **Researchers:** Individuals conducting research in Islamic topics who require well-referenced and authenticated content.
*   **Students:** University students and religious scholars seeking academic resources and insights.
*   **General Readers:** Individuals interested in in-depth, academically-sound Islamic knowledge, although full access is restricted to logged-in users.

## Core Features & User Flows

### 1. User Authentication (Google Sign-In)
*   **Flow:** Guests can preview limited article content. To read full articles, users must sign in using their Google account via OAuth 2.0 (Passport.js strategy).
*   **Requirement:** Only invited authors will have login IDs for content creation; general users can only share and comment.

### 2. Bilingual Articles (Malay & English)
*   **Functionality:** Each article will have a primary Malay version and a secondary English version. Both versions must be completed before an article can be published.
*   **Display:** Content will be displayed using a tabbed interface for easy switching between Malay and English versions.

### 3. Structured References
*   **Functionality:** Quranic verses, Hadith, and scholar quotes must be cited using APA-style referencing.
*   **Storage:** References will be stored in a dedicated `references` table linked to `article_translations`.
*   **Integration:** Authors will manually input Hadith references. Quranic verses should be integratable to enhance presentation and potentially link to an external API for verse lookups/display (future enhancement).

### 4. Article Review & Approval Workflow
*   **Status:** Draft → In Review → Approved → Published.
*   **Flow:** Author creates/submits → Reviewer comments/rejects/approves → Admin finalizes (approves/publishes).
*   **Audit Trail:** All actions (who reviewed, when, comments) must be logged for transparency.
*   **Rejection Handling:** If an article is rejected, the author must correct the errors and resubmit.

### 5. Sharing and Commenting
*   **Functionality:** Logged-in users (readers) can share articles and post comments.
*   **Requirement:** Comment moderation (basic) will be implemented to prevent spam/inappropriate content.

## Technical Architecture (PERN + Traefik + Docker)

### Tech Stack
*   **Frontend:** React (with TailwindCSS or NextUI)
*   **Backend:** Node.js (Express)
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Authentication:** Google OAuth 2.0 (Passport.js)
*   **Reverse Proxy:** Traefik (Docker labels, Let’s Encrypt for HTTPS)
*   **Deployment:** Docker Compose (frontend, backend, db, traefik)
*   **Storage:** Cloudinary or Supabase (media, video assets - currently only images)
*   **Version Control:** GitHub or GitLab CI/CD integration

### Services (Docker Compose)
*   `frontend`: React application
*   `backend`: Express API
*   `db`: PostgreSQL database
*   `traefik`: Reverse proxy, SSL termination, routing

### Traefik Configuration
Traefik will handle reverse proxy routing via Docker labels, automatic HTTPS via Let’s Encrypt, and load balancing (future consideration). Middleware for rate-limiting, compression, and HTTP to HTTPS redirection will be implemented.

```yaml
services:
  traefik:
    image: traefik:v3.1
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.myresolver.acme.email=admin@domain.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
  backend:
    build: ./backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.domain.com`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=myresolver"
  frontend:
    build: ./frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`domain.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=myresolver"
```

## Database Schema (PostgreSQL Relational Model)

Using Prisma ORM to maintain strong relational integrity.

### Entity Relationship Diagram (Conceptual)

```
+-------+
| users |
+-------+
| id (PK)         |
| name            |
| email           |
| google_id       |
| role_id (FK)    |
| created_at      |
+-------+
    |
    | 1
    | 
    | N
+-------+
| roles |
+-------+
| id (PK)         |
| name            |
+-------+

+---------+
| articles|
+---------+
| id (PK)         |
| category_id (FK)|
| created_by (FK) |
| approved_by (FK)|
| status          |
| created_at      |
+---------+
    | 1
    | 
    | N
+------------------+
| article_translations |
+------------------+
| id (PK)          |
| article_id (FK)  |
| lang_code        |
| title            |
| content          |
| references       |
| seo_meta         |
+------------------+

+------------+
| categories |
+------------+
| id (PK)    |
| name       |
+------------+

+-------+
| tags  |
+-------+
| id (PK) |
| name    |
+-------+
    | N
    | 
    | N
+------------+
| article_tags |
+------------+
| article_id (FK)|
| tag_id (FK)    |
+------------+

+---------+
| reviews |
+---------+
| id (PK)         |
| article_id (FK) |
| reviewer_id (FK)|
| comments        |
| status          |
| reviewed_at     |
+---------+

+-------+
| media |
+-------+
| id (PK)         |
| file_url        |
| file_type       |
| uploader_id (FK)|
| created_at      |
+-------+

+---------------+
| video_articles |
+---------------+
| id (PK)         |
| article_id (FK) |
| video_url       |
| thumbnail_url   |
+---------------+
```

### Table Details
*   **users:** `id`, `name`, `email`, `google_id`, `role_id` (FK to roles), `created_at`
*   **roles:** `id`, `name` (Admin, Reviewer, Author, Translator, Reader)
*   **articles:** `id`, `category_id` (FK to categories), `created_by` (FK to users), `approved_by` (FK to users), `status` (Draft, In Review, Approved, Published), `created_at`
*   **article_translations:** `id`, `article_id` (FK to articles), `lang_code` (ms, en), `title`, `content` (Markdown/HTML), `references` (JSONB for structured data), `seo_meta` (JSONB)
*   **categories:** `id`, `name`
*   **tags:** `id`, `name`
*   **article_tags:** `article_id` (FK), `tag_id` (FK) - composite PK
*   **reviews:** `id`, `article_id` (FK to articles), `reviewer_id` (FK to users), `comments` (text), `status` (Pending, Approved, Rejected), `reviewed_at`
*   **media:** `id`, `file_url`, `file_type` (image, video), `uploader_id` (FK to users), `created_at`
*   **video_articles:** `id`, `article_id` (FK to articles), `video_url`, `thumbnail_url` (Note: Current scope is limited to images, this table is for future video integration.)

## User Roles & Permission Matrix

| Role         | Permissions                                                                   |
| :----------- | :---------------------------------------------------------------------------- |
| **Admin**    | Full access to all modules, approve & publish articles, manage users & roles. |
| **Reviewer** | Review & comment on articles, reject articles.                                |
| **Author**   | Create & submit articles for review, edit own draft articles.                 |
| **Translator**| Add/edit translation versions of articles (before publish).                   |
| **Reader**   | View published content, share articles, post comments.                        |

## Article Review & Approval Workflow

1.  **Author writes:** Author creates a new article; default `status` is `Draft`.
2.  **Author submits:** Author submits the draft for review; `status` changes to `In Review`.
3.  **Reviewer checks:** A Reviewer accesses the article, reviews content, adds `comments`, and can either `Approve` or `Reject` the article. All actions are logged.
    *   If `Rejected`: The article `status` reverts to `Draft`, and the Author is notified to `correct the errors and resubmit`.
    *   If `Approved` by Reviewer: The article `status` remains `In Review` but is flagged for Admin approval.
4.  **Translator updates (if needed):** If the article is approved by the Reviewer but requires translation updates, the Translator can modify the `article_translations` before final publication.
5.  **Admin finalizes:** An Admin reviews the article and the reviewer's comments. The Admin can then set the `status` to `Approved` or `Published`.
    *   `Approved`: Article is ready for publication but not yet live.
    *   `Published`: Article is live and viewable by Readers (after Google Sign-In).

**Audit Trail:** Every status change, comment, and action (by whom and when) within the review workflow must be logged for accountability and historical tracking.

## Admin Panel Modules

*   **Users & Roles Management:** CRUD operations for users, assigning/changing roles.
*   **Articles Management:** CRUD for all articles, managing review states, approving/publishing.
*   **Categories & Tags Management:** CRUD for article categories and tags.
*   **Media Library:** Managing uploaded images (upload, delete, organize).
*   **Review Management:** Overview of articles in review, assigning reviewers, tracking review progress.
*   **System Settings:** Basic configurations like language toggle, SEO meta templates.

## UI/UX Guidelines

**Design Style:** Minimalist, academic, clean, and optimized for long-form reading, similar to Medium.com.

**Color Palette:**
*   **Primary:** `#1E3A8A` (Headings, primary buttons)
*   **Secondary:** `#0EA5E9` (Accent buttons, hover states)
*   **Accent:** `#FBBF24` (Quran/Hadith highlights)
*   **Background:** `#F9FAFB` (Default background)
*   **Text:** `#1F2937` (Main body text)
*   **Dark Mode Background:** `#111827` (Night mode background) - Dark mode support is a priority from the beginning.

**Fonts:**
*   **Heading:** Playfair Display
*   **Body:** Inter / Noto Sans
*   **Arabic Quotes:** Amiri / Lateef

**Bilingual Content Display:** Articles will use a tabbed interface to switch between Malay and English versions.

## Deployment & Security

### Deployment
*   **Docker Compose:** Orchestrates frontend, backend, PostgreSQL database, and Traefik reverse proxy.
*   **Traefik:** Acts as the entry point for all services.
    *   **Reverse Proxy Routing:** Manages traffic to `api.domain.com` (backend) and `domain.com` (frontend) via Docker labels.
    *   **Automatic HTTPS:** Secures communication with Let’s Encrypt certificates.
    *   **Load Balancing:** Capable of distributing requests if services are scaled (future).
    *   **Middleware:** Implements rate-limiting, compression, and HTTP to HTTPS redirection.

### Security
*   **HTTPS:** Automatic SSL/TLS encryption via Traefik and Let’s Encrypt.
*   **JWT Session Authentication:** Secure token-based authentication between frontend and backend.
*   **Express Security:** Utilizes `Helmet` for setting various HTTP headers and CSRF protection.
*   **Database Backup:** Daily `pg_dump` cron job for data redundancy and disaster recovery.
*   **Rate Limiting:** Implemented on the backend API to prevent abuse and brute-force attacks.
*   **Traefik Middleware:** Potentially for DDoS protection (basic) and custom redirect rules.

## Future Scalability & Enhancements

*   **AI-Powered Semantic Search:** Integration with `pgvector` for enhanced article discoverability.
*   **Auto-Summarization:** Utilizing AI summary APIs for articles.
*   **External Quran APIs:** Deeper integration for dynamic display and search of Quranic verses.
*   **Microservice Architecture:** Separation of concerns into dedicated microservices for content, review, and authentication modules.
*   **Analytics Dashboard:** Implementation of Metabase or Grafana for platform usage and engagement analytics.
*   **Video Article Support:** Full integration of video content alongside text articles.
*   **Multi-language Support:** Expand to include more languages beyond Malay and English.
*   **Monetization:** Explore options like subscriptions or premium content.
