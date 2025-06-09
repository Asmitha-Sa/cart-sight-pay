
import { useState, useRef } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
}

const CameraCapture = ({ onImageCapture }: CameraCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCamera, setIsCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmImage = () => {
    if (capturedImage) {
      onImageCapture(capturedImage);
    }
  };

  return (
    <div className="space-y-4">
      {!capturedImage && !isCamera && (
        <div className="grid gap-4">
          <Button 
            onClick={startCamera}
            className="h-16 text-lg bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Camera className="mr-3 h-6 w-6" />
            Open Camera
          </Button>
          
          <div className="relative">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="h-16 text-lg w-full"
              size="lg"
            >
              <Upload className="mr-3 h-6 w-6" />
              Upload Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {isCamera && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-gray-100"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button 
                  onClick={capturePhoto}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full w-16 h-16"
                >
                  <Camera className="h-6 w-6" />
                </Button>
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-16 h-16"
                >
                  ✕
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {capturedImage && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="flex space-x-3">
                <Button 
                  onClick={retakePhoto}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button 
                  onClick={confirmImage}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Use This Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
