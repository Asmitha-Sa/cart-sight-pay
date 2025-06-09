
interface GeminiProduct {
  name: string;
  price: number;
  confidence: number;
}

interface GeminiResponse {
  products: GeminiProduct[];
  total: number;
}

export const analyzeCartImage = async (imageData: string): Promise<GeminiResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found in environment variables');
  }

  // Convert base64 to blob for the API
  const base64Data = imageData.split(',')[1];
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Analyze this shopping cart image and identify all visible retail products. For each product, provide:
1. Product name (be specific with brand if visible)
2. Estimated price in Indian Rupees (₹)
3. Confidence score (0-1)

Return ONLY a valid JSON response in this exact format:
{
  "products": [
    {"name": "Product Name", "price": 120, "confidence": 0.95}
  ]
}

Focus on common grocery/retail items. If you can't clearly identify a product, don't include it.`
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1000
    }
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!textResponse) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    const products = parsedResponse.products || [];
    const total = products.reduce((sum: number, product: GeminiProduct) => sum + product.price, 0);

    return {
      products,
      total
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
};
