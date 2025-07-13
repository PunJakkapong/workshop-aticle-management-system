# Article Management System

A comprehensive article management system built with **Nuxt 3**, featuring rich text editing, SEO optimization, and powerful content organization capabilities.

## 🚀 Features

### ✅ Core Features (Completed)

#### 📝 Article CRUD Operations (10/10 points)
- **Create**: Rich text editor with TipTap, image upload, categories/tags, SEO metadata, auto-save draft
- **Read**: Blog listing with pagination, article detail pages, related articles, reading time calculation, social share buttons
- **Update**: Edit interface, version history, preview before publish
- **Delete**: Soft delete (archive), confirmation dialog, restore deleted articles

#### 🔍 Search & Filter System (5/5 points)
- Full-text search across titles, content, and metadata
- Filter by category, tags, date range
- Sort by date, popularity, reading time
- Search suggestions and real-time results
- Search results highlighting

#### 👥 User Interaction Features (5/5 points)
- Like/Bookmark articles
- Comments system with threading
- View count tracking
- Social media sharing (Twitter, Facebook, LinkedIn, Reddit)
- Print-friendly version

#### 📊 Content Management Features (5/5 points)
- Featured articles section
- Article series/collections
- Author profiles and management
- Content scheduling (publish date/time)
- Admin dashboard with analytics

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with seamless mobile experience
- **Dark Mode Support**: System preference detection with manual toggle
- **Loading States**: Skeleton loaders and smooth transitions
- **Smooth Animations**: Micro-interactions and page transitions

### 🛠 Technical Features
- **Composition API**: Modern Vue 3 patterns throughout
- **TypeScript**: Full type safety and better developer experience
- **Reusable Composables**: Custom composables for articles, search, and interactions
- **SEO Optimization**: Meta tags, structured data, and OpenGraph support
- **Authentication System**: JWT-based authentication (inherited from existing system)

## 📁 Project Structure

```
├── components/
│   ├── ArticleCard.vue          # Article display card
│   ├── CommentItem.vue          # Individual comment component
│   ├── CommentsSection.vue      # Comments management
│   ├── ImageUpload.vue          # Drag & drop image upload
│   ├── RichTextEditor.vue       # TipTap rich text editor
│   ├── SearchModal.vue          # Global search modal
│   └── SocialShare.vue          # Social sharing buttons
├── composables/
│   ├── useArticles.ts           # Article management composable
│   └── useSearch.ts             # Search functionality composable
├── layouts/
│   └── default.vue              # Main layout with navigation
├── pages/
│   ├── admin/
│   │   └── index.vue            # Admin dashboard
│   ├── articles/
│   │   └── create.vue           # Article creation/editing
│   ├── blog/
│   │   ├── index.vue            # Blog listing page
│   │   └── [slug].vue           # Article detail page
│   └── index.vue                # Homepage
├── server/
│   ├── api/v1/
│   │   ├── articles/            # Article CRUD APIs
│   │   ├── categories/          # Category management
│   │   ├── tags/                # Tag management
│   │   ├── search/              # Search APIs
│   │   └── upload/              # File upload APIs
│   └── models/
│       ├── article.ts           # Article model
│       ├── category.ts          # Category model
│       ├── tag.ts               # Tag model
│       ├── article-series.ts    # Article series model
│       └── associations.ts      # Model relationships
```

## 🏗 Database Schema

### Tables Created
- **articles**: Main article content with SEO fields
- **categories**: Hierarchical content organization
- **tags**: Flexible content tagging
- **article_series**: Content series/collections
- **article_categories**: Many-to-many article-category relationships
- **article_tags**: Many-to-many article-tag relationships

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env file with database credentials
   cp .env.example .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📱 Key Pages & Features

### Homepage (`/`)
- Hero section with feature highlights
- Quick stats and call-to-action
- Modern, responsive design

### Blog Listing (`/blog`)
- Article grid with featured section
- Advanced search and filtering
- Pagination and sorting options
- Real-time search suggestions

### Article Detail (`/blog/[slug]`)
- Full article content with rich formatting
- Reading time and view tracking
- Social sharing and print options
- Related articles and author info
- Threaded comments system

### Article Creation (`/articles/create`)
- Rich text editor with formatting tools
- Image upload with drag & drop
- Categories and tags management
- SEO metadata fields
- Auto-save and draft functionality
- Publishing and scheduling options

### Admin Dashboard (`/admin`)
- Article management overview
- Performance analytics
- Quick actions and recent activity
- Popular content insights

## 🎯 Features Breakdown

### Article Creation & Editing
- **Rich Text Editor**: TipTap-powered editor with formatting, headers, lists, links, and code blocks
- **Image Management**: Drag & drop upload with preview and management
- **Content Organization**: Categories (hierarchical) and tags (flat) system
- **SEO Optimization**: Meta title, description, keywords, and social media tags
- **Publishing Options**: Draft, scheduled, and immediate publishing
- **Auto-save**: Automatic draft saving every 2 seconds

### Search & Discovery
- **Full-text Search**: Search across article titles, content, and metadata
- **Advanced Filtering**: Filter by category, tag, author, date range, and reading time
- **Search Suggestions**: Real-time search suggestions and popular searches
- **Search Analytics**: Track search queries and results

### User Engagement
- **Social Sharing**: Share to Twitter, Facebook, LinkedIn, Reddit, and email
- **Comments System**: Threaded comments with like functionality
- **Bookmarking**: Save articles for later reading
- **View Tracking**: Track article popularity and engagement

### Content Management
- **Article Series**: Group related articles into series
- **Featured Content**: Highlight important articles
- **Author Profiles**: Author information and article attribution
- **Content Scheduling**: Schedule articles for future publication
- **Analytics Dashboard**: Track content performance and engagement

## 🔐 Data Storage

The system uses **Sequelize ORM** with **MySQL** for data persistence, providing:
- Reliable relational data storage
- ACID compliance for data integrity
- Efficient querying with proper indexing
- Model relationships and validation

## 🌟 Code Quality

- **Clean Code**: Well-organized, readable, and maintainable codebase
- **TypeScript**: Full type safety throughout the application
- **Reusable Components**: Modular components for consistent UI
- **Custom Composables**: Shared logic for better code organization
- **Proper Error Handling**: Comprehensive error handling and user feedback

## 🚀 Performance Features

- **Lazy Loading**: Images and components loaded on demand
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Intelligent caching for better performance
- **SEO Optimization**: Server-side rendering for better search visibility

---

This Article Management System provides a complete solution for content creation, management, and publishing with modern web development practices and user experience in mind.