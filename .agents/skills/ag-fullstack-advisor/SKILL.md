---
name: ag-fullstack-advisor
description: "Use this skill to analyze and optimize CVs/Resumes for Fullstack, Frontend, and Backend developer roles. It checks for ATS keyword matches, provides architectural and technology stack recommendations, and rewrites resume bullet points using the STAR method."
license: MIT
argument-hint: "[--json] <cv_path> [jd_path]"
metadata:
  author: Team
  version: "1.0.0"
---

# Fullstack, Frontend & Backend ATS Advisor Skill

## TL;DR

This skill acts as a specialized technical reviewer and ATS (Applicant Tracking System) optimizer for CVs in the Web Development domain (Fullstack, Frontend, Backend). It offers automated keyword matching, formatting critiques, and impact-driven rewrite suggestions.

---

## How to Use

To run the automated ATS keyword scanner on a CV file:

```bash
bun .agents/skills/ag-fullstack-advisor/scripts/ats_checker.mjs [--json] <cv_path> [jd_path]
```

### Argument Reference & Options
- `--json` (Optional): If present, output structured JSON instead of human-readable Markdown. Ideal for programmatic parsing or AI consumption.
- `cv_path` (Required): Path to the candidate's CV. Supports Markdown (`.md`), Plain Text (`.txt`), HTML (`.html`), and LaTeX (`.tex`). LaTeX formatting macros and comments are automatically stripped before scanning.
- `jd_path` (Optional): Path to the target Job Description (`.md` or `.txt`). If provided, it filters the evaluation to match only keywords present in the JD. If omitted, uses the full default keyword database.

---

## 📋 Technology Keywords Database

The skill checks for the presence of the following domain-specific keywords:

### 1. Frontend Development (FE)
*   **Core:** `HTML5`, `CSS3`, `JavaScript`, `ES6+`, `TypeScript`, `DOM`, `JSON`, `AJAX`.
*   **Frameworks:** `React`, `ReactJS`, `Angular`, `Vue`, `Vuejs`, `Next.js`, `Nuxt.js`, `Svelte`.
*   **State Management:** `Redux`, `Zustand`, `MobX`, `Context API`, `Pinia`.
*   **Build Tools:** `Webpack`, `Vite`, `Babel`, `NPM`, `Yarn`, `Bun`.
*   **Styling:** `Tailwind CSS`, `Sass`, `SCSS`, `Bootstrap`, `Material UI`, `Styled Components`.

### 2. Backend Development (BE)
*   **Runtimes & Frameworks:** `Node.js`, `Express.js`, `NestJS`, `ASP.NET Core`, `C#`, `Spring Boot`, `Java`, `Django`, `Python`, `Go`, `Golang`.
*   **APIs:** `RESTful API`, `GraphQL`, `gRPC`, `WebSockets`.
*   **Databases:** `PostgreSQL`, `MySQL`, `MS SQL Server`, `MongoDB`, `Redis`, `DynamoDB`.
*   **ORM/ODM:** `Entity Framework`, `Hibernate`, `Prisma`, `Mongoose`, `Sequelize`.

### 3. Fullstack, DevOps & System Architecture
*   **DevOps/Cloud:** `Docker`, `Kubernetes`, `AWS`, `Azure`, `CI/CD`, `GitHub Actions`, `Serverless`, `Lambda`.
*   **Testing:** `Jest`, `Mocha`, `Cypress`, `Playwright`, `Unit Testing`, `Integration Testing`.
*   **Architecture & Practices:** `Microservices`, `MVC`, `Clean Architecture`, `DDD`, `Agile`, `Scrum`, `Git`, `GitHub`.

---

## 💬 Optimization & Rewrite Guidelines (STAR Method)

When analyzing CV contents, the advisor translates passive/weak statements into impact-driven sentences:

| Avoid (Passive / Task-focused) | Prefer (Action & Impact-focused using STAR) |
| :--- | :--- |
| *Coded ReactJS frontend for homepage.* | *Designed and built a responsive ReactJS homepage, optimizing render performance by 25% using virtualized lists.* |
| *Wrote backend APIs using Node.js.* | *Developed secure Node.js RESTful APIs with Express, handling 1,000+ concurrent requests/sec and reducing response time by 40% with Redis caching.* |
| *Designed PostgreSQL database.* | *Designed and normalized PostgreSQL database schemas, reducing query latency by 15% through strategic indexing.* |

---

## 🏗️ CV Architecture & STAR Domain Application

To score highly on ATS scanners and impress technical interviewers, a resume must be structured logically and written according to the STAR method.

### 1. Resume Section Architecture
*   **Content Allocation:** 75-80% of the resume must focus on **Professional Experience** and **Projects**. Avoid excessive length in self-introductions, objectives, or unrelated hobbies.
*   **Standard Layout Order:**
    1.  **Header:** Contact details (Email, Phone, LinkedIn, GitHub). No headshots, dates of birth, or full home addresses (to prevent ATS parsing failures).
    2.  **Summary/Profile (Short):** 2-3 sentences summarizing core technical strengths and experience.
    3.  **Technical Skills:** Categorized lists (e.g., *Frontend, Backend, Databases, DevOps/Tools*).
    4.  **Professional Experience:** In reverse chronological order (newest first).
    5.  **Personal Projects:** Notable projects showcasing practical engineering skills (essential if professional experience is limited).
    6.  **Education:** School name, major, graduation year, GPA (if >3.2).

### 2. STAR Sentence Construction Formula
Every bullet point in the Experience/Projects section should follow this formula:
$$\text{Action Verb} + \text{Technical Tools} + \text{Context/Task} + \text{Quantifiable Result}$$

*   **Situation & Task:** What was the technical bottleneck or challenge? (e.g., slow page load times, high database CPU usage, manual deployment errors).
*   **Action:** What engineering actions did you perform? (e.g., implemented Redis caching, refactored database tables, built automated CI/CD pipelines).
*   **Result:** What was the verifiable outcome? (e.g., reduced response time by 40%, decreased JS bundle size by 30%, automated 100% of deployment workflows).

### 3. STAR Templates by Domain

#### A. Frontend Specialist (Focus on UI, Performance, State Management)
*   *Challenge:* React application was initially bloated, leading to slow page loads on mobile.
    *   *STAR Description:* **Optimized** client-side rendering performance of a React/Next.js portal by implementing dynamic imports (code-splitting) and image optimization, **reducing** initial bundle size by 35% and **improving** Lighthouse performance score from 60 to 88.
*   *Challenge:* Inefficient state management causing redundant component re-renders.
    *   *STAR Description:* **Refactored** global state management from Redux to Zustand, **simplifying** boilerplate code by 50% and **eliminating** duplicate renders across dashboard pages.

#### B. Backend Specialist (Focus on APIs, Databases, Scalability, Caching)
*   *Challenge:* API endpoint hit a performance bottleneck during high traffic.
    *   *STAR Description:* **Designed and implemented** a high-performance RESTful API using NestJS, integrating Redis caching for active sessions, **reducing** average response time by 60% (from 800ms to 320ms) under a load of 1,000+ concurrent requests.
*   *Challenge:* Database queries were slow on tables with millions of rows.
    *   *STAR Description:* **Optimized** PostgreSQL database performance by analyzing query execution plans, refactoring complex JOINs, and applying composite indexes, **decreasing** database CPU usage by 20% and **speeding up** search queries by 5x.

#### C. Fullstack & DevOps (Focus on Builds, Deployment, Containerization, CI/CD)
*   *Challenge:* Manual deployment process was slow and prone to human error.
    *   *STAR Description:* **Automated** application deployment workflows by building custom CI/CD pipelines with GitHub Actions, containerizing services using Docker, and deploying to AWS, **cutting down** release cycles from 2 hours to under 10 minutes with zero downtime.
*   *Challenge:* Lack of visibility into errors across microservices.
    *   *STAR Description:* **Architected and integrated** structured logging and health checks across microservices using Fastify and Winston, **reducing** system error detection and troubleshooting time by 45%.

---

## ⚠️ Strict Integrity & Realism Rules

To maintain absolute credibility and professional standards, the advisor must enforce the following rules when reviewing and rewriting resumes:

1.  **No Hyperbolic or Overconfident Claims:**
    *   Avoid empty buzzwords or subjective self-evaluations such as *"highly skilled expert"*, *"master of JavaScript"*, *"rockstar developer"*, or *"seasoned architect"*.
    *   Keep the tone objective, neutral, and professional. Let the actions and technologies speak for themselves.
2.  **No Fabricated or Invented Metrics:**
    *   Never invent arbitrary percentages or statistics (e.g., *"improved database speed by 87.5%"* or *"reduced bugs by 90%"*) if they are not based on actual, measured project benchmarks.
    *   If no metric was officially measured, describe the qualitative improvement or testing methodology instead (e.g., *"resolved duplicate SQL queries through eager loading"* or *"verified API correctness by writing unit tests covering 80% of branches"*).
3.  **No Exaggerated Skill Lists:**
    *   Only list technologies that the candidate has actively used and verified. Do not recommend adding popular buzzword keywords (e.g., *Kubernetes*, *GraphQL*, *AWS Lambda*) unless the candidate has actual hands-on experience with them.
4.  **Conciseness and Keyword Density:**
    *   Rewrite suggestions must be highly optimized, brief, and focus on keywords.
    *   Limit each bullet point to a maximum of 1.5 lines.
    *   Avoid verbose explanations or structural fillers; combine technical tasks directly with the action verbs and the specific tools used.

---

## 🛠️ Output Report Structure

When running the evaluation, the output report must be structured as follows:

1.  **Overview Score:** A match percentage representing CV alignment with target keywords.
2.  **Domain Match Analysis:** Breakdown of match scores for Frontend, Backend, and DevOps/Architecture.
3.  **Missing Keywords & Skill Gaps:** Categorized list of missing highly-demanded technologies.
4.  **STAR Rewrite Recommendations:** 3-5 rewritten bullet points ready to be copied into the CV.
