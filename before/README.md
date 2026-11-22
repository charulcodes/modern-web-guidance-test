# Chronicle — Modern Editorial & Tech Blog

A modern, frontend-only editorial blog web application inspired by Medium and Substack, built with **Vue.js 3 (Composition API with `<script setup>`)**, **Vite**, **Lucide Icons**, and **plain modular CSS**.

All data—including blog posts, likes, guest comments, theme preferences, and user identities—persists entirely in the browser using **Web Storage (`localStorage`)**, requiring zero backend infrastructure.

---

## ✨ Key Features

### 1. Minimalist Editorial Design System
- **Crisp Typography:** Pair of **Inter** for clean UI controls and **Lora / Merriweather** for readable, comfortable long-form reading.
- **Dark / Light Mode:** Dynamic theme switcher with subtle transitions, auto-detecting system preference and persisting user choice in `localStorage`.
- **Responsive Magazine Layout:** Fluid CSS grid adapting from single-column mobile viewports to multi-column editorial desktop layouts.

### 2. State Management & Local-First Persistence (`useBlogStorage`)
- **Seeded Demo Data:** Automatically initializes with 5 rich, realistic articles spanning **Tech**, **Design**, **Productivity**, and **Lifestyle** with Unsplash covers, realistic read times, tags, like counters, and sample comments.
- **Immediate Reactive Sync:** Every interaction (liking an article, posting a comment, deleting a comment, publishing a post) reactively updates the UI and syncs to `localStorage`.
- **Reset Demo Data:** A subtle button in the footer restores initial demo posts and clears local user-generated likes and comments.

### 3. Home / Feed View
- **Live Search Bar:** Instant client-side search across article titles, body content, excerpts, tags, and author names.
- **Category Filter Pills:** Quick filters for `All`, `Tech`, `Design`, `Lifestyle`, and `Productivity`.
- **Rich Post Cards:** Featuring category badges, formatted publication dates, read time estimations, author avatar, like count, and comment count.

### 4. Single Post View & Engagement
- **Full Article View:** Accessible via URL routes (`/post/:slug`), featuring author bio, header banner, markdown typography (headings, blockquotes, code blocks, lists).
- **Interactive Like Button:** Heart icon with heart-beat animation and counter that tracks whether the client has liked the post.
- **Guest Comment System (No Login Required):**
  - Display name input remembering the user's name across visits (defaults to "Guest").
  - Validation preventing empty comments.
  - Chronological rendering (newest first).
  - Dynamic initials avatars with deterministic pastel colors.
  - Relative timestamps (*"Just now"*, *"2 hours ago"*).
  - Client-side ownership tracking: only the browser session that authored a comment has permission to delete it.

### 5. Article Creation Modal
- Modal dialog with **Write** and **Live Preview** tabs.
- Fields for Title, Category, Author Name, Role/Bio, Cover Image URL (with instant Unsplash presets), Tags, and Content.
- Computes word count and estimated reading time on the fly.
- Saves directly to local storage and routes to the new story with toast feedback.

---

## 🛠️ Project Structure

```
├── index.html                   # HTML entry point with Google Fonts
├── vite.config.js               # Vite build configuration with alias '@'
├── package.json                 # Dependencies & scripts
└── src/
    ├── main.js                  # App bootstrap with Vue Router & CSS
    ├── App.vue                  # Root layout (Navbar, RouterView, Footer, Modals)
    ├── assets/
    │   └── main.css             # Editorial design tokens, themes, & utility styles
    ├── composables/
    │   ├── useBlogStorage.js    # LocalStorage reactive persistence & CRUD
    │   ├── useTheme.js          # Dark/Light mode theme manager
    │   └── useToast.js          # Toast notification composable
    ├── data/
    │   └── samplePosts.js       # Initial seed articles and pre-populated comments
    ├── components/
    │   ├── Navbar.vue           # Header with brand logo, write button, & theme toggle
    │   ├── Footer.vue           # Editorial footer with Reset Demo Data action
    │   ├── PostCard.vue         # Magazine-style card with metadata & likes
    │   ├── CommentSection.vue   # Guest comments, avatars, & deletion permissions
    │   ├── CreatePostModal.vue  # Full post publishing modal with live preview
    │   └── ToastContainer.vue   # Non-intrusive floating alert notifications
    ├── views/
    │   ├── HomeView.vue         # Feed view with search & category pills
    │   └── PostDetailView.vue   # Full article reader view with engagement bar
    └── router/
        └── index.js             # Vue Router configuration (/ and /post/:slug)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Development
```bash
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```
