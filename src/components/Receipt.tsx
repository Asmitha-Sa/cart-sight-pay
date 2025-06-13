
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Receipt as ReceiptIcon, CreditCard, CheckCircle } from 'lucide-react';

interface Product {
  name: string;
  price: number;
  quantity: number;
  confidence: number;
}

interface ReceiptProps {
  products: Product[];
  total: number;
  onPayment: () => void;
  step: string;
}

const Receipt = ({ products, total, onPayment, step }: ReceiptProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const tax = Math.round(total * 0.18); // 18% GST
  const finalTotal = total + tax;

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentCompleted(true);
      onPayment();
    }, 2000);
  };

  if (paymentCompleted) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Payment Successful!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">Thank you for your purchase!</h3>
            <p className="text-gray-600">Your payment has been processed successfully.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Transaction Details</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono">TXN{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold">₹{finalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span>Digital Payment</span>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Download Receipt
          </Button>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Start New Order
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ReceiptIcon className="h-5 w-5" />
          <span>Digital Receipt</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Qty: {product.quantity} × ₹{product.price}</p>
              </div>
              <p className="font-semibold">₹{product.price * product.quantity}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span>₹{tax}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-green-600">₹{finalTotal}</span>
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={isProcessingPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-lg h-12"
          size="lg"
        >
          {isProcessingPayment ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay ₹{finalTotal}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Receipt;
