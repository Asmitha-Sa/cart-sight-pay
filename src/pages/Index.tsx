
import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import CameraCapture from '@/components/CameraCapture';
import ProductRecognition from '@/components/ProductRecognition';
import Receipt from '@/components/Receipt';
import SignInPage from '@/components/SignInPage';
import Navigation from '@/components/Navigation';
import { analyzeCartImage } from '@/services/geminiService';

interface Product {
  name: string;
  price: number;
  quantity: number;
  confidence: number;
}

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const { toast } = useToast();

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsProcessing(true);
    setProducts([]);
    setTotal(0);
    setShowReceipt(false);

    try {
      const result = await analyzeCartImage(imageData);
      setProducts(result.products);
      setTotal(result.total);
      setShowReceipt(true);
      
      toast({
        title: "Products Recognized!",
        description: `Found ${result.products.length} products totaling ₹${result.total}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setProducts([]);
    setTotal(0);
    setShowReceipt(false);
  };

  const handlePayment = () => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway...",
    });
  };

  return (
    <>
      <Navigation />
      
      <SignedOut>
        <SignInPage />
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-6 lg:py-12">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-4">
                Scan-Free Checkout
              </h1>
              <p className="text-base lg:text-xl text-gray-600">
                AI-Powered Product Recognition
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              {!capturedImage ? (
                <div className="max-w-2xl mx-auto">
                  <CameraCapture onImageCapture={handleImageCapture} />
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                  <div className="lg:col-span-2">
                    <ProductRecognition
                      image={capturedImage}
                      isProcessing={isProcessing}
                      products={products}
                    />
                    <div className="mt-6 lg:hidden">
                      <button
                        onClick={handleRetake}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Take Another Photo
                      </button>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    {showReceipt && (
                      <div className="sticky top-6">
                        <Receipt
                          products={products}
                          total={total}
                          onPayment={handlePayment}
                          step="receipt"
                        />
                        <div className="mt-4 hidden lg:block">
                          <button
                            onClick={handleRetake}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Take Another Photo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default Index;
