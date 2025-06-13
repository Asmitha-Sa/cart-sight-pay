
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
  // Render development mode without Clerk when using dummy key
  createRoot(document.getElementById("root")!).render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-bold text-lg mb-2">Development Mode</p>
          <p className="mb-3">To use this application, you need to set up Clerk authentication:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Sign up for a free Clerk account at <a href="https://go.clerk.com/lovable" target="_blank" className="underline font-medium">go.clerk.com/lovable</a></li>
            <li>Get your publishable key from <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" className="underline font-medium">Clerk Dashboard</a></li>
            <li>Replace the VITE_CLERK_PUBLISHABLE_KEY in your .env file</li>
          </ol>
        </div>
        <div className="text-center">
          <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M15 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan-Free Checkout</h1>
          <p className="text-gray-600">AI-Powered Retail Experience</p>
        </div>
      </div>
    </div>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
}
