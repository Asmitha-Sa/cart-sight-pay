
import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import CameraCapture from '@/components/CameraCapture';
import ProductRecognition from '@/components/ProductRecognition';
import Receipt from '@/components/Receipt';
import SignInPage from '@/components/SignInPage';
import { analyzeCartImage } from '@/services/geminiService';

interface Product {
  name: string;
  price: number;
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
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Scan-Free Checkout
              </h1>
              <p className="text-lg text-gray-600">
                AI-Powered Product Recognition
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {!capturedImage ? (
                <CameraCapture onImageCapture={handleImageCapture} />
              ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <ProductRecognition
                      image={capturedImage}
                      isProcessing={isProcessing}
                      products={products}
                    />
                  </div>
                  
                  {showReceipt && (
                    <div>
                      <Receipt
                        products={products}
                        total={total}
                        onPayment={handlePayment}
                        step="review"
                      />
                    </div>
                  )}
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
