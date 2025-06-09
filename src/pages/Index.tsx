
import { useState } from 'react';
import { Camera, Upload, ShoppingCart, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CameraCapture from '@/components/CameraCapture';
import ProductRecognition from '@/components/ProductRecognition';
import Receipt from '@/components/Receipt';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [step, setStep] = useState<'upload' | 'processing' | 'receipt' | 'payment'>('upload');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedProducts, setRecognizedProducts] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setStep('processing');
    setIsProcessing(true);

    // Simulate AI processing - replace with your Gemini API integration
    setTimeout(() => {
      const mockProducts = [
        { name: "Tropicana Orange Juice", price: 120, confidence: 0.97 },
        { name: "Maggi Noodles", price: 25, confidence: 0.93 },
        { name: "Coca Cola 500ml", price: 45, confidence: 0.89 },
        { name: "Lay's Potato Chips", price: 30, confidence: 0.95 }
      ];
      setRecognizedProducts(mockProducts);
      setIsProcessing(false);
      setStep('receipt');
      toast({
        title: "Products recognized!",
        description: `Found ${mockProducts.length} items in your cart.`,
      });
    }, 3000);
  };

  const handlePayment = () => {
    setStep('payment');
    toast({
      title: "Redirecting to payment...",
      description: "Please complete your payment to finish checkout.",
    });
  };

  const resetFlow = () => {
    setStep('upload');
    setCapturedImage(null);
    setRecognizedProducts([]);
    setIsProcessing(false);
  };

  const totalAmount = recognizedProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ScanFree Checkout</h1>
                <p className="text-sm text-gray-600">AI-Powered Retail Experience</p>
              </div>
            </div>
            <Button variant="outline" onClick={resetFlow} size="sm">
              New Scan
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['upload', 'processing', 'receipt', 'payment'].map((currentStep, index) => (
              <div key={currentStep} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === currentStep ? 'bg-blue-600 text-white' :
                  ['upload', 'processing', 'receipt', 'payment'].indexOf(step) > index ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {['upload', 'processing', 'receipt', 'payment'].indexOf(step) > index ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    ['upload', 'processing', 'receipt', 'payment'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm font-medium text-gray-600 capitalize">
              {step === 'upload' ? 'Capture Cart' : 
               step === 'processing' ? 'AI Recognition' :
               step === 'receipt' ? 'Review Items' : 'Complete Payment'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {step === 'upload' && (
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                  <span>Scan Your Cart</span>
                </CardTitle>
                <p className="text-gray-600">
                  Take a photo of your shopping cart and let AI recognize all items instantly
                </p>
              </CardHeader>
              <CardContent>
                <CameraCapture onImageCapture={handleImageCapture} />
              </CardContent>
            </Card>
          )}

          {step === 'processing' && (
            <ProductRecognition 
              image={capturedImage} 
              isProcessing={isProcessing}
              products={recognizedProducts}
            />
          )}

          {(step === 'receipt' || step === 'payment') && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Your Cart Photo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {capturedImage && (
                    <img 
                      src={capturedImage} 
                      alt="Captured cart" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  )}
                </CardContent>
              </Card>

              <Receipt 
                products={recognizedProducts}
                total={totalAmount}
                onPayment={handlePayment}
                step={step}
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        {step === 'upload' && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Recognition</h3>
                <p className="text-sm text-gray-600">
                  Advanced AI identifies products from a single photo
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-green-100 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600">
                  Complete checkout in under 30 seconds
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-purple-100 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  Safe and encrypted payment processing
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
