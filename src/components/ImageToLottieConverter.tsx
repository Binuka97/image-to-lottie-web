import { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Image as ImageIcon, FileJson } from 'lucide-react';

interface ImageDimensions {
  width: number;
  height: number;
}

const ImageToLottieConverter = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = result;

      // Convert to base64 (keep data URL format with png prefix)
      const base64 = result.split(',')[1];
      setBase64Data(`data:image/png;base64,${base64}`);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSelectedImage(file);
    handleImageLoad(file);
    toast.success('Image uploaded successfully');
  }, [handleImageLoad]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const generateLottieJson = useCallback(() => {
    if (!imageDimensions || !base64Data) {
      toast.error('Please upload an image first');
      return;
    }

    const lottieJson = {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: imageDimensions.width,
      h: imageDimensions.height,
      nm: "Static Image Animation",
      ddd: 0,
      assets: [
        {
          id: "image_0",
          w: imageDimensions.width,
          h: imageDimensions.height,
          u: "",
          p: base64Data,
          e: 1
        }
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 2,
          nm: "Image Layer",
          refId: "image_0",
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [imageDimensions.width / 2, imageDimensions.height / 2, 0] },
            a: { a: 0, k: [imageDimensions.width / 2, imageDimensions.height / 2, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          ip: 0,
          op: 60,
          st: 0,
          bm: 0
        }
      ]
    };

    // Download the JSON file
    const blob = new Blob([JSON.stringify(lottieJson, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedImage?.name.split('.')[0] || 'image'}_lottie.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Lottie JSON file downloaded successfully');
  }, [imageDimensions, base64Data, selectedImage]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="leading-[1.3] text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Image to Lottie Converter
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your static images into Lottie animation files. Upload an image and get a downloadable JSON file ready for your animations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Upload Image</h2>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg shadow-lg"
                  />
                  <div className="text-sm text-muted-foreground">
                    {selectedImage?.name}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your image here</p>
                    <p className="text-muted-foreground">or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            {imageDimensions && (
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Image Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Width:</span>
                    <span className="ml-2 font-mono">{imageDimensions.width}px</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Height:</span>
                    <span className="ml-2 font-mono">{imageDimensions.height}px</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Generate Section */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Generate Lottie</h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Once you upload an image, you can generate a Lottie JSON file that contains your image as a static animation layer.
              </p>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium">What you'll get:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Lottie JSON file with your image embedded</li>
                  <li>• Proper dimensions set automatically</li>
                  <li>• Base64 encoded image data</li>
                  <li>• Ready for use in animations</li>
                </ul>
              </div>

              <Button
                onClick={generateLottieJson}
                disabled={!selectedImage || !imageDimensions}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Lottie JSON
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-center py-8 border-t border-border/20">
        <p className="text-muted-foreground text-sm">
          Developed by{" "}
          <a
            href="https://github.com/Binuka97"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Binuka Kamesh
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ImageToLottieConverter;