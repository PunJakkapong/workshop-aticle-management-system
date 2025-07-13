
# Article Management System

A comprehensive article management system built with **Nuxt 3**, **TypeScript**, and **client-side storage** (IndexedDB/localStorage). This system provides complete CRUD operations for articles, rich text editing, advanced search capabilities, and user management - all running entirely in the browser without requiring a backend database.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup & Run

```bash
# Clone the repository
git clone <repository-url>
cd workshop-aticle-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:3001**

### Build for Production

```bash
# Generate static build
npm run generate

# Or build for SSR
npm run build
npm run preview
```

## ✨ Features

### 📝 Content Management
- **Rich Text Editor** - TipTap editor with formatting tools, headings, lists, blockquotes
- **Image Upload** - Drag & drop image upload with base64 storage
- **Article CRUD** - Create, read, update, delete articles with auto-save
- **Draft System** - Save drafts automatically, publish when ready
- **Slug Generation** - Automatic URL-friendly slug creation

### 🏷️ Organization
- **Categories** - Hierarchical content organization
- **Tags** - Flexible tagging system with many-to-many relationships
- **Article Series** - Group related articles into collections
- **Status Management** - Draft, published, archived article states

### 🔍 Search & Discovery
- **Full-Text Search** - Search across title, content, and metadata
- **Advanced Filtering** - Filter by category, tag, author, date, status
- **Search Highlighting** - Highlighted search terms in results
- **Global Search** - Keyboard shortcut (Cmd/Ctrl+K) for instant search

### 👤 User Management
- **Authentication System** - Login/register with JWT tokens
- **Role-Based Access** - Admin, editor, author, reader roles
- **User Profiles** - Extended user information and preferences
- **Social Links** - Twitter, GitHub, LinkedIn integration

### 💬 User Interactions
- **Comments System** - Nested comments with replies
- **Like/Bookmark** - Article engagement features
- **Reading Time** - Automatic reading time calculation
- **View Tracking** - Article view count analytics

### 🎨 User Experience
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode** - System/manual theme switching
- **Progressive Web App** - Offline functionality
- **SEO Optimized** - Meta tags, structured data, sitemap

### 📊 Analytics & Admin
- **Admin Dashboard** - Content statistics and management
- **Analytics** - Article performance metrics
- **Content Management** - Bulk operations and content organization

## 🏗️ Architecture Decisions

### Client-Side Storage Architecture

This application uses **IndexedDB** as the primary storage mechanism instead of a traditional server-side database. This decision provides several benefits:

#### **Why Client-Side Storage?**

1. **🚀 Performance** - Zero network latency for CRUD operations
2. **📱 Offline Support** - Full functionality without internet connection
3. **🔧 Simplified Deployment** - No database server setup required
4. **💰 Cost Effective** - Eliminates database hosting costs
5. **🔒 Privacy** - User data stays on their device

#### **Storage Implementation**

```typescript
// Database Structure
interface ArticleDB {
  articles: Article[]      // Main content with metadata
  categories: Category[]   // Hierarchical organization  
  tags: Tag[]             // Flexible tagging
  series: ArticleSeries[] // Content collections
  users: User[]           // User management
  comments: Comment[]     // User interactions
}
```

**Storage Layers:**
- **IndexedDB** - Complex data structures and relationships
- **localStorage** - User preferences and settings
- **Base64 Images** - Embedded image storage

### Technology Stack

#### **Frontend Framework**
- **Nuxt 3** - Vue.js meta-framework with SSR/SSG
- **TypeScript** - Type safety and better developer experience
- **Composition API** - Modern Vue.js reactive patterns

#### **UI & Styling**
- **TailwindCSS** - Utility-first CSS framework
- **Nuxt UI** - Pre-built Vue components
- **TipTap** - Rich text editor with extensibility

#### **State Management**
- **Pinia** - Vue.js state management
- **VueUse** - Composition utility collection
- **Reactive Storage** - Client-side reactive data layer

#### **Development Tools**
- **ESLint** - Code linting and formatting
- **Vite** - Fast build tool and dev server
- **TypeScript** - Static type checking

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vue Components │ <- │  Pinia Stores    │ <- │ Storage Layer   │
│                 │    │                  │    │                 │
│ - Pages         │    │ - Articles Store │    │ - IndexedDB     │
│ - Components    │    │ - Categories     │    │ - localStorage  │
│ - Layouts       │    │ - Tags Store     │    │ - useStorage()  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Data Management:**
1. **Components** interact with **Pinia stores**
2. **Stores** use **storage composables** for persistence
3. **Storage layer** handles IndexedDB operations
4. **Reactive updates** propagate through the system

### File Structure

```
├── components/          # Reusable Vue components
│   ├── ArticleCard.vue
│   ├── RichTextEditor.vue
│   └── SearchModal.vue
├── composables/         # Composition functions
│   ├── useStorage.ts    # Storage operations
│   └── useAuth.ts       # Authentication
├── stores/              # Pinia state management
│   ├── articles.ts
│   ├── categories.ts
│   └── tags.ts
├── pages/               # Route pages
│   ├── blog/
│   ├── articles/
│   └── admin/
├── server/              # Server-side code
│   ├── api/            # API endpoints (demo/fallback)
│   └── models/         # Data models/interfaces
├── utils/               # Utility functions
│   └── db.ts           # IndexedDB setup
└── assets/              # Static assets
    └── css/            # Stylesheets
```

## 🔐 Demo Credentials

### Authentication

The system includes demo authentication for testing purposes:

#### **Demo Accounts**

| Username | Email | Password | Role |
|----------|-------|----------|------|
| `admin` | `admin@example.com` | `password` | Admin |
| `demo` | `demo@example.com` | `password` | Author |

#### **Registration**

You can also register new accounts at `/register`. Avoid these reserved usernames:
- `admin`, `demo`, `test`, `root`

#### **Features by Role**

- **Admin** - Full access to all features and admin dashboard
- **Author** - Create, edit, and publish articles
- **Reader** - View articles, comment, like, bookmark

### Sample Data

The application automatically initializes with sample content:

- **3 Sample Articles** (published and draft states)
- **3 Categories** (Web Development, JavaScript, Vue.js)
- **3 Tags** (Tutorial, Beginner, Advanced)
- **1 Admin User** for testing

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server (port 3001)
npm run build      # Build for production
npm run generate   # Generate static site
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Key Development Features

- **Hot Module Replacement** - Instant updates during development
- **TypeScript Support** - Full type checking and IntelliSense
- **Auto-imports** - Automatic component and composable imports
- **DevTools** - Vue DevTools integration

### Customization

#### **Adding New Features**

1. **Create composable** in `/composables/` for business logic
2. **Add Pinia store** in `/stores/` for state management
3. **Build components** in `/components/` for UI
4. **Create pages** in `/pages/` for routes

#### **Extending Storage**

```typescript
// Add new entity to database schema
interface ArticleDB {
  // ... existing stores
  newEntity: NewEntity[]
}

// Create storage operations
const { createNewEntity, getNewEntities } = useStorage()
```

## 📱 Progressive Web App

The application is configured as a PWA with:

- **Offline Support** - Full functionality without internet
- **App-like Experience** - Install on mobile/desktop
- **Background Sync** - Data synchronization when online
- **Push Notifications** - Real-time engagement (configurable)

## 🚀 Deployment

### Static Hosting (Recommended)

```bash
npm run generate
# Deploy /dist folder to any static host
```

**Compatible with:**
- Netlify, Vercel, GitHub Pages
- AWS S3, Azure Static Web Apps
- Any CDN or static file server

### Server-Side Rendering

```bash
npm run build
# Deploy as Node.js application
```

## 🔧 Configuration

### Environment Variables

```env
# JWT Secret for demo authentication
JWT_SECRET=your-secret-key

# API Base URL (if using external APIs)
API_BASE_URL=/api
```

### Nuxt Configuration

Key configuration in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  devServer: { port: 3001 },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt', 
    '@nuxtjs/tailwindcss'
  ],
  // ... other config
})
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - Check this README and code comments
- **Issues** - Report bugs or request features via GitHub Issues
- **Development** - All code is extensively commented for learning

---

**Built with ❤️ using Nuxt 3, TypeScript, and modern web technologies**
