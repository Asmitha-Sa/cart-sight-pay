
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Package } from 'lucide-react';

interface Product {
  name: string;
  price: number;
  quantity: number;
  confidence: number;
}

interface ProductRecognitionProps {
  image: string | null;
  isProcessing: boolean;
  products: Product[];
}

const ProductRecognition = ({ image, isProcessing, products }: ProductRecognitionProps) => {
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
            <Eye className="h-5 w-5" />
            <span>AI Vision Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {image && (
            <div className="relative">
              <img 
                src={image} 
                alt="Cart analysis" 
                className="w-full h-48 lg:h-64 object-cover rounded-lg border"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">AI is analyzing your cart...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
            <Package className="h-5 w-5" />
            <span>Detected Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex items-center justify-center h-48 lg:h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Processing with Gemini AI...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-3 max-h-48 lg:max-h-64 overflow-y-auto">
              {products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm lg:text-base">{product.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Qty: {product.quantity}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(product.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-semibold text-green-600 text-sm lg:text-base">₹{product.price * product.quantity}</p>
                    <p className="text-xs lg:text-sm text-gray-500">₹{product.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 lg:h-64 text-gray-500">
              <p className="text-center">Products will appear here once detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductRecognition;
