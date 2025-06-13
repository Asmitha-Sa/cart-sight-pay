
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Check if we're using a dummy key
const isDummyKey = PUBLISHABLE_KEY === 'pk_test_dummy_clerk_key_for_development'

if (isDummyKey) {
  // Still use ClerkProvider with dummy key, but show warning
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Development Mode</p>
          <p>Using dummy Clerk key. Please replace VITE_CLERK_PUBLISHABLE_KEY in .env with your real Clerk publishable key.</p>
          <p>Get your key at: <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" className="underline">https://dashboard.clerk.com/</a></p>
        </div>
        <App />
      </div>
    </ClerkProvider>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
}
