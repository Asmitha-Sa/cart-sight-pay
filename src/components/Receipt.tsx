
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
  const tax = Math.round(total * 0.18); // 18% GST
  const finalTotal = total + tax;

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

        {step === 'receipt' && (
          <Button 
            onClick={onPayment}
            className="w-full bg-green-600 hover:bg-green-700 text-lg h-12"
            size="lg"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Proceed to Payment
          </Button>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-gray-600">Thank you for shopping with us</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Transaction Details</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-600">Transaction ID:</span> TXN{Date.now()}</p>
                <p><span className="text-gray-600">Date:</span> {new Date().toLocaleDateString()}</p>
                <p><span className="text-gray-600">Amount:</span> ₹{finalTotal}</p>
                <p><span className="text-gray-600">Method:</span> Digital Payment</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Download Receipt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Receipt;
