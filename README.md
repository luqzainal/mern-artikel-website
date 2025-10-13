# Qalam Al-Ilm

Platform artikel Islam dwibahasa (Bahasa Inggeris & Bahasa Melayu) dengan workflow review yang komprehensif, pengurusan pengguna berasaskan peranan, dan pengurusan kandungan yang mesra pengguna.

## 🌟 Ciri-ciri Utama

### 1. **Artikel Dwibahasa**
- Sokongan penuh untuk Bahasa Inggeris dan Bahasa Melayu
- Sistem terjemahan berasingan untuk setiap artikel
- Peranan Penterjemah khusus untuk pengurusan terjemahan

### 2. **Sistem Review Artikel**
- Workflow status artikel: Draft → Pending Review → In Review → Approved → Published
- Sistem semakan oleh Reviewer
- Komen dan maklum balas review
- Log audit untuk pengesanan perubahan

### 3. **Pengurusan Peranan & Kebenaran**
- **Admin**: Akses penuh sistem
- **Reviewer**: Semak dan luluskan artikel
- **Author**: Tulis dan urus artikel sendiri
- **Translator**: Terjemah artikel
- **Reader**: Baca dan komen artikel

### 4. **Pengurusan Kandungan**
- Kategori (Aqidah, Fiqh, Seerah, Tafsir, Hadith, Akhlaq, Isu Semasa)
- Sistem tag untuk pengkelasan artikel
- Ciri carian dan penapisan
- Muat naik dan pengurusan gambar
- Rujukan akademik dalam format APA

### 5. **Sistem Komen**
- Komen dan balasan bersarang
- Kelulusan moderator untuk komen
- Komen berasingan untuk setiap artikel

### 6. **Pengesahan & Keselamatan**
- Google OAuth 2.0 untuk login
- JWT untuk pengesahan API
- HTTPS dengan Let's Encrypt SSL
- Rate limiting dan security headers
- CORS configuration

## 🏗️ Seni Bina Sistem

### Stack Teknologi

**Backend:**
- Node.js + Express.js + TypeScript
- PostgreSQL dengan Prisma ORM
- Passport.js untuk OAuth
- Winston untuk logging
- Multer untuk upload fail

**Frontend:**
- React 18 + TypeScript
- Vite untuk build tool
- NextUI + TailwindCSS untuk UI
- React Query untuk data fetching
- Zustand untuk state management
- React Router untuk routing

**Infrastructure:**
- Docker & Docker Compose
- Traefik sebagai reverse proxy
- Let's Encrypt untuk SSL
- Nginx untuk static file serving

## 📋 Keperluan Sistem

- Docker Desktop (Windows/Mac) atau Docker Engine + Docker Compose (Linux)
- Git
- Node.js 18+ (untuk development sahaja)
- PostgreSQL 15+ (jika tidak menggunakan Docker)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd "Artikel Website"
```

### 2. Setup Environment Variables

```bash
# Copy contoh fail .env
cp .env.example .env

# Edit .env dan masukkan nilai sebenar
# - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET dari Google Cloud Console
# - JWT_SECRET (generate random string)
# - Domain names untuk production
```

### 3. Setup Google OAuth

1. Pergi ke [Google Cloud Console](https://console.cloud.google.com/)
2. Cipta project baru atau guna existing
3. Enable Google+ API
4. Cipta OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/google/callback`
     - Production: `https://api.yourdomain.com/api/auth/google/callback`
5. Copy Client ID dan Client Secret ke `.env`

### 4. Development Mode

```bash
# Install dependencies (backend)
cd backend
npm install

# Install dependencies (frontend)
cd ../frontend
npm install

# Kembali ke root directory
cd ..

# Setup database
cd backend
npx prisma migrate dev
npx prisma seed

# Jalankan development server
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Backend akan jalan di `http://localhost:3000`
Frontend akan jalan di `http://localhost:3001`

### 5. Production Mode dengan Docker

```bash
# Build dan jalankan semua services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Jalankan migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx prisma seed
```

Aplikasi akan accessible melalui:
- **Frontend**: `http://localhost:3001` atau domain anda
- **Admin Portal**: `http://localhost:3002` atau `http://admin.yourdomain.com`
- **Backend API**: `http://localhost:3000` atau `https://api.yourdomain.com`
- **Traefik Dashboard**: `http://localhost:8080`

**Nota Penting**:
- Portal Admin berjalan di port 3002 dan terasing sepenuhnya dari frontend
- Untuk development, tambah ke file hosts: `127.0.0.1 admin.localhost`
- Lokasi file hosts:
  - Windows: `C:\Windows\System32\drivers\etc\hosts`
  - Linux/Mac: `/etc/hosts`

## 📁 Struktur Projek

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, error handling
│   │   ├── utils/             # Helper functions
│   │   └── index.ts           # Express app
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                  # Public-facing website
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Context providers
│   │   └── styles/            # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── admin/                     # Admin Portal (Terasing)
│   ├── src/
│   │   ├── components/        # Admin components
│   │   ├── pages/             # Admin pages
│   │   │   ├── ArticleForm.tsx    # Form tambah/edit artikel
│   │   │   ├── ArticleList.tsx    # Senarai artikel
│   │   │   └── Login.tsx          # Admin login
│   │   └── services/          # API services
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── letsencrypt/               # SSL certificates
├── docker-compose.yml         # Docker orchestration
├── traefik.yml               # Traefik configuration
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Articles
- `GET /api/articles` - List articles (with pagination)
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/slug/:slug` - Get article by slug
- `POST /api/articles` - Create article (Author+)
- `PUT /api/articles/:id` - Update article (Author/Admin)
- `DELETE /api/articles/:id` - Delete article (Admin)
- `POST /api/articles/:id/submit` - Submit for review
- `POST /api/articles/:id/publish` - Publish article (Admin)
- `GET /api/articles/category/:slug` - Get by category
- `GET /api/articles/tag/:slug` - Get by tag
- `GET /api/articles/search?q=keyword` - Search articles

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag (Admin)
- `PUT /api/tags/:id` - Update tag (Admin)
- `DELETE /api/tags/:id` - Delete tag (Admin)

### Reviews
- `GET /api/reviews` - List reviews (Reviewer+)
- `GET /api/reviews/article/:articleId` - Get reviews for article
- `POST /api/reviews` - Create review (Reviewer+)
- `PUT /api/reviews/:id` - Update review (Reviewer+)

### Comments
- `GET /api/comments/article/:articleId` - Get article comments
- `POST /api/comments` - Create comment (Authenticated)
- `PUT /api/comments/:id` - Update comment (Author/Admin)
- `DELETE /api/comments/:id` - Delete comment (Author/Admin)
- `PUT /api/comments/:id/approve` - Approve comment (Admin)

### Users
- `GET /api/users` - List users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/role` - Update user role (Admin)
- `PUT /api/users/:id/status` - Activate/deactivate user (Admin)

### Media
- `POST /api/media/upload` - Upload image (Author+)
- `GET /api/media` - List media (Admin)
- `DELETE /api/media/:id` - Delete media (Admin)

## 🗄️ Database Schema

Schema lengkap terdapat di [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

**Main Models:**
- `User` - Pengguna dengan roles
- `Role` - Peranan dan kebenaran
- `Article` - Artikel dengan status workflow
- `ArticleTranslation` - Terjemahan artikel (EN/MY)
- `Category` - Kategori artikel
- `Tag` - Tag untuk artikel
- `Review` - Semakan artikel
- `Comment` - Komen pengguna
- `Media` - Upload gambar
- `AuditLog` - Log aktiviti

## 🔐 Keselamatan

### Best Practices Implemented:
- ✅ HTTPS enforcement dengan Let's Encrypt
- ✅ JWT token authentication
- ✅ Password hashing (untuk future enhancements)
- ✅ Rate limiting pada API
- ✅ CORS configuration
- ✅ Security headers (Helmet.js)
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection
- ✅ File upload validation
- ✅ Environment variables untuk secrets

## 📊 Monitoring & Logging

- Winston logger untuk backend logging
- Log files di `backend/logs/`
- Traefik access logs
- Docker container logs: `docker-compose logs -f [service]`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:watch

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Production Checklist:

1. **Update environment variables:**
   - Generate secure JWT_SECRET
   - Add actual Google OAuth credentials
   - Update domain names
   - Set NODE_ENV=production

2. **Database backup:**
   ```bash
   # Setup automatic backups
   docker-compose exec postgres pg_dump -U islamic_user islamic_articles > backup.sql
   ```

3. **SSL Certificates:**
   - Update email di `docker-compose.yml` dan `traefik.yml`
   - Pastikan domain menghala ke server
   - Let's Encrypt akan auto-generate certificates

4. **Security:**
   - Change default database credentials
   - Setup firewall rules
   - Enable fail2ban
   - Regular security updates

5. **Monitoring:**
   - Setup uptime monitoring
   - Configure error notifications
   - Log aggregation

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Migration Issues
```bash
# Reset migrations (CAUTION: Data loss!)
cd backend
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name
```

### Build Issues
```bash
# Clear Docker cache
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Development Notes

### Adding New Features

1. **New API Endpoint:**
   - Create controller di `backend/src/controllers/`
   - Add route di `backend/src/routes/`
   - Update Prisma schema jika perlu
   - Run migration: `npx prisma migrate dev`

2. **New UI Component:**
   - Create component di `frontend/src/components/`
   - Follow NextUI patterns
   - Use TypeScript interfaces
   - Add to Storybook (future)

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

MIT License - Lihat [LICENSE](LICENSE) untuk details.

## 👥 Support

Untuk bantuan dan soalan:
- Create issue di GitHub
- Email: support@yourdomain.com

## 🗺️ Roadmap

- [ ] Email notifications untuk review workflow
- [ ] Advanced search dengan Elasticsearch
- [ ] Multi-language support (Arabic)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Social media sharing
- [ ] Newsletter system
- [ ] Bookmark/Save articles feature
- [ ] Dark mode
- [ ] Offline reading (PWA)

---

**Built with ❤️ for the Islamic community**
