# Muawin | گھر کے کام، اب آسان

Muawin is a high-fidelity household services application built with Next.js, Tailwind CSS, ShadCN UI, and Genkit AI. It connects customers with verified service providers (Maids, Drivers, Cooks, etc.) and local vendors across Pakistan.

## Features

- **Multi-Role Interface**: Tailored experiences for Customers, Providers, and Vendors.
- **Bilingual Support**: Full support for English and Urdu (including RTL layouts).
- **AI Assistant**: Muawin Robot Assistant powered by Genkit for customer support.
- **Verification Flow**: CNIC and Selfie-based verification for providers.
- **Safety Features**: SOS emergency alerts for active jobs.
- **Real-time Messaging**: Built-in chat system for communication.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Logic**: [Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: React Context & Hooks

## How to Download Source Code

If you are viewing this project in Firebase Studio and want to run it on your own computer:

1. **Locate the Download Icon**: Look at the header bar of the Firebase Studio interface (top-right area). 
2. **Icon Shape**: It is a cloud icon with a downward-pointing arrow.
3. **Trigger Export**: Click the icon to generate and download a `.zip` file of the entire project.
4. **Troubleshooting**: If you don't see the icon, try expanding your browser window or checking the "More" (...) menu in the top bar.

## Local Development Setup

Once you have downloaded and extracted the zip file:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**: Create a `.env` file in the root and add your Google AI API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
4. **Open the App**: Navigate to [http://localhost:9002](http://localhost:9002) in your browser.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (standard and custom Muawin components).
- `src/ai`: Genkit flows and AI prompt definitions.
- `src/context`: Global state (Language, Theme).
- `src/lib`: Types, utilities, and placeholder data.

---
Built with Muawin Design System.
