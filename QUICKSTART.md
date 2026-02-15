# Quick Start Guide

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## What's Been Set Up

✅ **Next.js 14** with App Router
✅ **React 18** with TypeScript
✅ **Tailwind CSS** for styling
✅ **Component-based architecture**
✅ **Main page with tab navigation**
✅ **Public assets directory** for images

## Project Structure

```
app/
  ├── layout.tsx      # Root layout
  ├── page.tsx        # Home page
  └── globals.css     # Global styles

components/
  ├── Header.tsx
  ├── TabNavigation.tsx
  └── tabs/          # Tab components

public/
  └── images/        # Static images

styles/
  └── main.css       # Main stylesheet
```

## Next Steps

1. Convert remaining HTML pages to Next.js pages/components
2. Set up routing for `/playbook/*` and `/process/*` pages
3. Add dynamic content loading
4. Implement API routes if needed
5. Add more interactive features

## Troubleshooting

- **Port 3000 already in use?** Next.js will automatically use the next available port
- **Module not found errors?** Run `npm install` again
- **CSS not loading?** Check that `styles/main.css` exists

