# Book Catalog App

Hey! This is my full-stack project using Next.js, TypeScript, and PostgreSQL. I built a book catalog app where users can add, view, edit, and delete books. It also has user authentication with email/password and Google login.

#test user 
    test@example.com
    Password123!

## What I Used

- **Frontend**: Next.js 15 with App Router + TypeScript
- **Styling**: Tailwind CSS 
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js for user login
- **Hosting**: Vercel 

## Features I Built

### Basic Stuff
- ✅ View all books in a nice list
- ✅ Add new books with title, author, and genre
- ✅ Delete books (one by one or multiple at once)
- ✅ Edit existing books
- ✅ Switch between grid view (table) and card view

### Features
- ✅ User login with email/password
- ✅ Google OAuth login (took me a while to figure this out!)
- ✅ Protected pages (can't add books without logging in)
- ✅ Responsive design (works on mobile and desktop)
- ✅ Loading states and error messages

## How to Run This Locally

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd book-catalog
npm install
```

### Step 2: Set Up Database
I used Neon (free PostgreSQL hosting) but you can use Supabase or ElephantSQL too.

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project and get your database URL
3. Copy the `.env.example` file to `.env.local`

### Step 3: Environment Variables
Create a `.env.local` file in the root folder:

```bash
# Database connection
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (optional - only if you want Google login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to see your data
npx prisma studio
```

### Step 5: Create a Test User
Since I didn't build a signup page, you need to create a user manually:

```bash
# Run this script to create a test user
node scripts/create-user.js
```

Or use Prisma Studio to add a user with a hashed password.

### Step 6: Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## How Authentication Works

### Login Flow
1. User goes to `/auth/signin`
2. They can either:
   - Enter email/password (stored in our database)
   - Click "Sign in with Google" (OAuth)
3. If successful, they get redirected to the home page
4. The navbar shows their name and a logout button

### Protected Routes
- `/add` page is protected - you need to be logged in
- If you try to access it without login, you get redirected to signin
- I used NextAuth middleware for this

### Session Management
- NextAuth handles all the session stuff
- Users stay logged in until they click logout
- Session data is stored in JWT tokens

## API Endpoints I Built

- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book (requires login)
- `PUT /api/books/[id]` - Update a book
- `DELETE /api/books/[id]` - Delete a book

## Deployment

### GitHub
1. Push your code to GitHub
2. Make sure your `.env.local` is in `.gitignore`

### Vercel
1. Go to [Vercel](https://vercel.com) and sign up
2. Import your GitHub repo
3. Add these environment variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` (if using Google auth)
   - `GOOGLE_CLIENT_SECRET` (if using Google auth)
   - `NEXTAUTH_URL` (your Vercel domain)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)

4. Deploy! Vercel will automatically build and deploy your app.

## What I Learned

- **Next.js App Router**: Much better than the old pages router
- **Prisma**: Database operations are so much easier now
- **NextAuth**: Authentication is complicated but powerful
- **TypeScript**: Type safety is amazing once you get used to it
- **Tailwind CSS**: Utility-first CSS is the way to go
- **PostgreSQL**: My first time using a real database!

## Struggles I Had

- Getting Google OAuth to work (those environment variables!)
- Understanding how NextAuth sessions work
- Making the UI responsive (mobile is tricky)
- Database relationships and Prisma queries
- Deployment environment variables

## Future Improvements

- [ ] User registration page
- [ ] Book categories and search
- [ ] User profiles and book collections
- [ ] Better error handling
- [ ] Unit tests
