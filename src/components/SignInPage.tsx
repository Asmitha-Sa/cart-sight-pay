
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Camera } from 'lucide-react'

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Scan-Free Checkout</CardTitle>
          <p className="text-gray-600">AI-Powered Retail Experience</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignedOut>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500">
                Sign in to start scanning your products with AI
              </p>
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button className="w-full" size="lg">
                  <Camera className="mr-2 h-4 w-4" />
                  Sign In to Start Scanning
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500">
                Welcome back! You can now scan your products.
              </p>
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
