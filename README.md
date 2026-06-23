# AltFinder 🔍

AltFinder is a premium full-stack monorepo application that indexes, compares, and dynamically drafts modern open-source alternatives to expensive commercial software subscriptions. The system features a custom costs savings calculator, Clerk JWT-verified AI generation powered by Google Gemini, and automated live GitHub metrics.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router, Turbopack) | Structured around Redux Toolkit (RTK Query) for state & cache invalidation. |
| **Backend** | Spring Boot 3.3 (Java 21) | Implements Spring Security (JWKS verification), CORS filters, Rate Limiting, and Cache layers. |
| **Database** | Supabase (PostgreSQL) | Managed via Spring Data JPA. |
| **Authentication** | Clerk | Auth guards, profile management, and JWT signature token validation. |
| **AI Integration** | Gemini API | Leverages `gemini-2.5-flash` model for scraper analysis and review generation. |

---

## ✨ Features

1. **Zero-Radius Flat Design**: Beautifully styled using a modern "Mist" base theme with "Teal" highlights and flat-border contours.
2. **Savings Calculator**: Interactively select paid commercial tools to calculate aggregate monthly and yearly migration savings dynamically.
3. **AI Generation Engine**: Protected POST endpoints allow logged-in users to submit a proprietary product name. A Gemini-driven agent scours open-source databases to build comparative tables, pros/cons, and expert reviews instantly.
4. **Interactive Upvote & Bookmark Suite**: Real-time bookmarking and upvoting invalidations sync instantly to the user profile dashboard via RTK tags.
5. **Live GitHub Metrics**: Fetches repository stargazers, fork counts, and last commit updates dynamically from the GitHub REST API.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Java 21 JDK
* Maven 3.9+
* Node.js 20+

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your local properties file `src/main/resources/application-local.properties` (this is gitignored) and fill in your keys based on the template:
   ```properties
   spring.datasource.url=jdbc:postgresql://<host>:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=<password>
   spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://<your-clerk-domain>/.well-known/jwks.json
   gemini.api.key=<your-gemini-key>
   ```
3. Run the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will boot up on `http://localhost:8080`.*

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Populate the local environment variables file `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
   ```
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
   *The client website will load on `http://localhost:3000`.*

---

## 🐳 Docker Deployment

The backend contains a multi-stage `Dockerfile` ready to package compiling pipelines:

```bash
cd backend
docker build -t altfinder-backend .
docker run -p 8080:8080 -e PORT=8080 -e DB_URL=... altfinder-backend
```

---

## 📄 License
This repository is licensed under the MIT License.
