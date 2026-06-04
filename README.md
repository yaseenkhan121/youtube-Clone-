# WowTube - Premium Video Streaming Platform

WowTube is a high-performance, production-ready video streaming platform built with **Laravel** (Backend) and **React** (Frontend). It leverages the **YouTube Data API v3** to provide a seamless, modern streaming experience with a premium dark-themed UI.

## 🚀 Features

- **Full YouTube Integration**: Real-time trending videos, search, and related content.
- **Dynamic Channels**: Detailed channel profiles with subscriber counts and video history.
- **User Interactions**: 
  - Like/Unlike videos
  - Subscribe/Unsubscribe from channels
  - Watch Later playlist
  - Personalized Watch History
- **Premium UI/UX**: 
  - Sleek Dark Mode (Glassmorphism aesthetics)
  - Fully Responsive Design
  - Smooth Animations (Lucide Icons, Tailwind-like CSS)
- **Advanced Auth**: Secure authentication with Laravel Sanctum.
- **Smart Caching**: Local database caching for API optimization and performance.

## 🛠️ Technology Stack

- **Backend**: Laravel 11, Sanctum, MySQL
- **Frontend**: React 18, Vite, Lucide React
- **API**: YouTube Data API v3
- **Styling**: Vanilla CSS (Premium Custom Design)

## 📦 Installation

### Backend Setup
1. `cd backend`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. Configure your `DB_DATABASE` and `YOUTUBE_API_KEY` in `.env`
6. `php artisan migrate`
7. `php artisan serve`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📄 License

MIT License
