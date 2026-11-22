## Key Modernizations Applied

### Cascade Layers & Reset Architecture (src/assets/main.css)

Replaced the legacy un-overridable universal reset (* { margin: 0; padding: 0; }) with modern cascade layers (@layer reset, base, components, utilities;).
Scoped element resets in @layer reset so lower-priority layers and component styles override them cleanly without !important.

### Theming, Color Spaces & Browser UI (src/assets/main.css, index.html)

Declared color-scheme: light dark on :root and added <meta name="color-scheme" content="light dark"> in index.html to prevent theme flashing (FOUC) and ensure native browser scrollbars and inputs automatically theme to system and user preferences.
Refactored hardcoded RGBA alpha colors to color-mix(in oklab, ...) for subtle accents (--accent-subtle, --like-subtle) and category badges.
Added native accent-color: var(--accent) and scrollbar-gutter: stable to eliminate layout shift when scrollbars appear.

### Individual Transform Properties (translate, rotate, scale)

Converted legacy transform: translateY(...), transform: scale(...), and transform: rotate(...) across all components (Navbar.vue, PostCard.vue, Footer.vue, ToastContainer.vue, CommentSection.vue, PostDetailView.vue, HomeView.vue) to independent transform properties.
Initialized base elements with identity transforms (translate: 0 0;, scale: 1;, rotate: 0deg;) to eliminate unexpected stacking context shifts on hover.

### Accessibility & Reduced Motion (prefers-reduced-motion)

Enclosed infinite spin animations, heartbeat keyframes, card hover lifts, and modal transitions inside @media (prefers-reduced-motion: no-preference) while maintaining non-motion transitions (colors, borders, backgrounds).

### Modern Layout, Grid & Typography

Responsive Grid: Refactored .posts-grid to grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)) in HomeView.vue, eliminating fragile media queries.
Balanced Wrapping: Added flex-wrap: balance after flex-wrap: wrap to .category-pills to prevent orphan items on final rows.
Container Queries & Subgrid Truncation: Added container: post-card / inline-size to PostCard.vue, paired -webkit-line-clamp with overflow: clip instead of overflow: hidden, and applied text-wrap: balance on headings and text-wrap: pretty on paragraph bodies.
Logical Dimensions: Replaced physical properties (width, height, margin-top/bottom/left/right, padding-*, top/left/right/bottom) with logical counterparts (inline-size, block-size, margin-inline, padding-block, inset-block-*, inset-inline-*).