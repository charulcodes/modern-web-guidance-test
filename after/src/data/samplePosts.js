export const INITIAL_POSTS = [
  {
    id: "post-1",
    title: "The Architecture of Modern Frontend Applications: Beyond the Hype",
    slug: "architecture-of-modern-frontend-applications",
    category: "Tech",
    author: {
      name: "Dr. Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Staff Systems Architect"
    },
    publishedAt: "2025-05-18T09:30:00.000Z",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Why the simplest state machines and composition models outlive monolithic frameworks, and how to build resilient user interfaces that scale gracefully.",
    content: `Frontend architecture in the current era often falls victim to unnecessary complexity. As engineers, our instinct is to adopt every new abstraction—from complex meta-frameworks to multi-layered state stores—before properly evaluating if our problem domain truly warrants them.

### The Problem of Premature Abstraction

When building web applications that need to survive more than a product cycle, stability is the ultimate feature. Consider how data flows in a modern single-page application:

1. **State Ownership**: Single sources of truth must be explicitly bounded rather than globally accessible to any arbitrary component.
2. **Predictable Reactivity**: Co-locating state with the components that consume it minimizes rendering cascades.
3. **Local-First Resilience**: Storing vital operational state in browser storage guarantees offline recovery and instant time-to-interactive.

\`\`\`javascript
// Clean composition model with Vue 3
import { ref, computed } from 'vue';

export function useResilientState(key, initialVal) {
  const state = ref(JSON.parse(localStorage.getItem(key)) || initialVal);
  // Reactive synchronization
  return { state };
}
\`\`\`

### Embracing Simplicity

Minimalism in architecture isn't about doing less; it's about eliminating the friction between your business logic and browser primitives. By leveraging native browser APIs, fine-grained reactivity, and scoped styling, your web application remains maintainable, lightning-fast, and a joy to build on.`,
    tags: ["Frontend", "Architecture", "WebDev", "JavaScript"],
    likes: 42,
    comments: [
      {
        id: "c-101",
        authorName: "Alex Rivera",
        content: "Spot on about premature abstractions. We spent months migrating to a micro-frontend architecture only to realize clean component boundaries in a single SPA was all we ever needed.",
        createdAt: "2025-05-18T11:45:00.000Z",
        isUserCreated: false
      },
      {
        id: "c-102",
        authorName: "Liam Chen",
        content: "The local-first resilience section hits home. Instant rendering from browser cache gives an unbeatable snappy feeling.",
        createdAt: "2025-05-18T14:20:00.000Z",
        isUserCreated: false
      }
    ]
  },
  {
    id: "post-2",
    title: "The Quiet Renaissance of Editorial Typography on the Web",
    slug: "quiet-renaissance-of-editorial-typography",
    category: "Design",
    author: {
      name: "Julian Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Design Director & Typographer"
    },
    publishedAt: "2025-05-15T14:15:00.000Z",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80",
    excerpt: "How modern web designers are ditching generic neo-grotesque sans-serifs in favor of warm serifs, thoughtful scale ratios, and editorial magazine aesthetics.",
    content: `For nearly a decade, the web felt visually uniform. Startup landing pages and publishing platforms blended into an ocean of interchangeable geometric sans-serif typefaces set against sterile light gray canvases.

Thankfully, an overdue shift is taking place. Designers are rediscovering the warmth, authority, and emotional resonance of editorial serif typography.

### Harmonizing Form and Function

Great typography is not merely decorative; it sets the cognitive rhythm of the reading experience. When pairing a razor-sharp geometric UI typeface with an organic, literary serif for body text:

- **Vertical Rhythm**: Establishing a consistent baseline grid (such as a 1.65 line-height ratio) reduces eye fatigue across long-form essays.
- **Measure and Contrast**: Restricting text columns to between 60 and 75 characters per line ensures the eye naturally finds the start of each succeeding sentence.
- **Micro-Typography**: Ligatures, proper em-dashes, and subtle kerning elevate a digital interface into an artifact of craft.

> "Typography is the craft of endowing human language with a durable visual form, and thus with an independent existence." — Robert Bringhurst

When readers step into an editorial space that respects these principles, their relationship with the written word fundamentally deepens.`,
    tags: ["Typography", "UI/UX", "Editorial", "DesignSystems"],
    likes: 87,
    comments: [
      {
        id: "c-201",
        authorName: "Sophia Martinez",
        content: "The pairing of Inter with Merriweather or Lora on this very blog proves your point! Reading long essays here feels effortless.",
        createdAt: "2025-05-16T08:10:00.000Z",
        isUserCreated: false
      }
    ]
  },
  {
    id: "post-3",
    title: "Deep Work Protocols: How to Reclaim 4 Hours of Uninterrupted Focus",
    slug: "deep-work-protocols-reclaim-focus",
    category: "Productivity",
    author: {
      name: "Maya Lin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      role: "Cognitive Ergonomics Researcher"
    },
    publishedAt: "2025-05-12T07:45:00.000Z",
    readTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Tactical guidelines for knowledge workers to defend their cognitive bandwidth against slack pings, context switching, and attention fragmentation.",
    content: `Attention is the scarcest currency of the 21st century. Research in human-computer interaction consistently demonstrates that it takes an average of 23 minutes and 15 seconds to return to deep focus after a single interruption.

If you receive 10 notifications during your workday, you effectively operate in a perpetual state of cognitive hangover.

### The 3 Core Pillars of the Deep Work Protocol

1. **The Morning Fortress (8:00 AM - 11:30 AM)**:
   Never check asynchronous messaging apps before your first major creative or technical milestone is completed. Your brain's prefrontal cortex is at peak bandwidth right after waking; do not trade it for answering email.

2. **Shutdown Rituals**:
   Mark the definitive end of your cognitive workday with a five-minute review. Write down tomorrow's primary objective, close your tabs, and trigger the mental cue that work is concluded.

3. **Batch Processing Communication**:
   Confine Slack, email, and social messaging to two fixed 30-minute windows per day (11:30 AM and 4:30 PM).

By treating focus as a physical boundary rather than a matter of fleeting willpower, you will discover that 4 hours of pure immersion yields more output than 10 hours of fragmented effort.`,
    tags: ["Productivity", "Focus", "DeepWork", "Habits"],
    likes: 129,
    comments: [
      {
        id: "c-301",
        authorName: "David Kim",
        content: "Implemented the 'Morning Fortress' routine three weeks ago. My code commit quality and personal sanity have dramatically improved.",
        createdAt: "2025-05-12T16:00:00.000Z",
        isUserCreated: false
      },
      {
        id: "c-302",
        authorName: "Claire Bennett",
        content: "The shutdown ritual is so crucial. Without it, my mind would keep spinning on unresolved bugs well into dinner time.",
        createdAt: "2025-05-13T10:30:00.000Z",
        isUserCreated: false
      }
    ]
  },
  {
    id: "post-4",
    title: "Digital Nomadism in 2025: Lessons from 12 Cities in 12 Months",
    slug: "digital-nomadism-12-cities-12-months",
    category: "Lifestyle",
    author: {
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Independent Writer & Photojournalist"
    },
    publishedAt: "2025-05-08T18:20:00.000Z",
    readTime: "8 min read",
    coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    excerpt: "What traveling through Lisbon, Tokyo, Buenos Aires, and beyond taught me about community, lightweight living, and avoiding nomad burnout.",
    content: `When people romanticize working remotely from across the globe, they picture laptops balanced on sandy beach chairs under the shade of palm trees. The reality is vastly different: high glare on screens, searching frantically for reliable Wi-Fi, and the silent creep of geographical loneliness.

Yet, done intentionally, nomadic living is one of the most transformative decisions a professional can make.

### Key Takeaways from a Year in Motion

- **Slow Travel Wins Every Time**: Moving every two weeks leads directly to burnout. Spending 1 to 2 months in a single neighborhood allows you to establish a gym routine, find a neighborhood cafe, and forge real local friendships.
- **The One-Bag Philosophy**: If an item does not serve at least two distinct purposes, leave it behind. Physical clutter translates directly into mental weight when changing airports.
- **Anchoring Routines**: When your timezone, language, and climate shift every month, internal anchors become essential. A daily 15-minute journaling session and morning pour-over coffee provide stability no matter where you wake up.

The world is eager to welcome those who arrive with humility, curiosity, and respect for local culture.`,
    tags: ["Travel", "RemoteWork", "Lifestyle", "Mindfulness"],
    likes: 64,
    comments: [
      {
        id: "c-401",
        authorName: "Elena Gomez",
        content: "Slow travel is the golden rule! I burned out after 4 months of rushing through European capitals. Now I stay at least 6 weeks in each city.",
        createdAt: "2025-05-09T09:15:00.000Z",
        isUserCreated: false
      }
    ]
  },
  {
    id: "post-5",
    title: "Understanding Reactive Systems: From Signals to Event Streams",
    slug: "understanding-reactive-systems-signals-event-streams",
    category: "Tech",
    author: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      role: "Frontend Engineer @ ReactiveLabs"
    },
    publishedAt: "2025-05-03T11:00:00.000Z",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
    excerpt: "A deep dive into how modern frameworks track dependencies behind the scenes using Proxies, dependency graphs, and compile-time optimizations.",
    content: `How does Vue know exactly which DOM node to re-render when a single reactive property changes? The magic behind modern frontend reactivity is less about virtual DOM diffing and more about fine-grained dependency tracking.

### The Evolution of Reactivity

In the early days of single-page apps, dirty checking (evaluating every watched expression on every event cycle) was standard. While simple, it scaled poorly as views grew to thousands of bindings.

Vue 3 pioneered the use of native JavaScript **ES6 Proxies**:

1. **Getter Interception**: When a computed property or template reads a \`ref.value\`, Vue registers the current active effect into a subscriber set for that specific property.
2. **Setter Interception**: When the value is modified, Vue traverses the dependency graph and notifies only the subscribers that depend on it.
3. **Microtask Batching**: Multiple synchronous mutations are queued into a microtask, ensuring the DOM updates just once per tick.

This elegant mechanism means developers write straightforward JavaScript while the engine optimizes rendering with laser precision.`,
    tags: ["Vue", "Reactivity", "JavaScript", "SoftwareEngineering"],
    likes: 95,
    comments: [
      {
        id: "c-501",
        authorName: "Oliver Twist",
        content: "Vue 3's Proxy reactivity system is easily one of the most elegant pieces of software engineering in the JavaScript ecosystem.",
        createdAt: "2025-05-03T13:40:00.000Z",
        isUserCreated: false
      }
    ]
  }
];
