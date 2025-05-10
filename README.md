# Daily Breaking Times - Premium News Website


A modern, feature-rich news website platform built with Next.js, Prisma, and TypeScript. This application provides a complete solution for publishing and managing news content with an intuitive admin interface and responsive frontend design.

## Features

### Content Management

- **Article Management**: Create, edit, publish, and delete articles with rich text editing
- **Category System**: Organize content with categories and subcategories
- **Tag Management**: Tag articles for better searchability and related content
- **Media Library**: Upload and manage images with Cloudinary integration
- **Breaking News**: Highlight important stories with breaking news designation
- **Featured Content**: Showcase selected articles in prominent positions

### Admin Dashboard

- **Admin Authentication**: Secure login system for administrative access
- **Content Analytics**: Track article views and engagement
- **User-friendly Interface**: Intuitive admin interface with shadcn/ui components
- **Live Preview**: Preview articles before publishing
- **Bulk Operations**: Manage multiple items at once

### Dynamic Admin Settings

- **Site Configuration**: Manage newspaper name, tagline, and description
- **Contact Information**: Update contact email and social media links
- **API Endpoints**: Dedicated endpoints for retrieving and updating settings
  - `GET /api/admin/settings` - Fetch current settings
  - `PUT /api/admin/settings` - Update settings
- **Automatic Creation**: Default settings created if none exist

### Dynamic Header Navigation

- **Category-based Navigation**: Automatically populated based on content structure
- **Show in Header Flag**: Control which categories appear in navigation with `show_in_header` flag
- **Subcategory Dropdowns**: Categories with subcategories display as dropdown menus
- **Responsive Design**: Navigation adapts to different screen sizes
- **Active State**: Visual indication of current section

### Frontend Features

- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Dark/Light Mode**: Theme toggle for user preference
- **Article Layout**: Clean, readable article presentation
- **Related Content**: Suggestions for further reading
- **Social Sharing**: Easy sharing of articles to social platforms
- **Search Functionality**: Find articles by keyword
- **Poll System**: Interactive polls for reader engagement
- **Weather Display**: Current weather information

## Technologies Used

- **Frontend**:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Lucide React icons
  - TipTap Editor

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (via Neon)

- **Authentication**:
  - Custom session-based authentication

- **Media**:
  - Cloudinary for image hosting and management

## Setup and Installation

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (or Neon account)
- Cloudinary account for image uploads

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/rahathosen/daily-breaking-times.git
   cd daily-breaking-times
