# Neighbor - Property Rental Platform

A modern property rental platform built with Next.js, Firebase, and React, allowing hosts to list properties and tenants to find and book accommodations.

## Features

- User authentication (host/tenant roles)
- Property listing and management
- Property search and filtering
- Image upload and management
- Responsive design with Tailwind CSS
- Dark/light mode support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database/Auth**: Firebase
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

## Getting Started

First, set up your environment variables by creating a `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy when you push changes.

Make sure your environment variables are also set in your Vercel project settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
