import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { Image, Video, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { saveBannerBackground, getBannerBackground, clearBannerBackground } from '../lib/bannerStorage';
import imageCompression from 'browser-image-compression';

interface BannerProps {
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ className }) => {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Default media
  const videos = [
    'https://i.imgur.com/L611556.mp4',
    'https://v.ftcdn.net/05/70/14/96/700_F_570149633_EfpB7vhG9gpQXHLxkqJpP3BZlnlHWn9n_ST.mp4',
    'https://v.ftcdn.net/05/67/81/28/700_F_567812832_UF5KPqQwbQoVWKnEHgQmUmYZTmvTGbNi_ST.mp4',
    'https://v.ftcdn.net/05/67/81/29/700_F_567812944_eHUXXntQJUQKwRMdVXFyNSEzKlXyKJBi_ST.mp4',
    'https://v.ftcdn.net/05/67/81/30/700_F_567813023_KyPpEWXAKpB9VUXXjSQP7BcXVYWGVnvz_ST.mp4'
  ];

  const images = [
    'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=3840&q=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1707345512638-997d31a10eaa?w=3840&q=100&auto=format&fit=crop'
  ];

  useEffect(() => {
    const loadSavedBackground = async () => {
      try {
        const savedBackground = await getBannerBackground();
        if (savedBackground) {
          setCustomBackground(savedBackground);
          setMediaType(savedBackground.startsWith('data:video') ? 'video' : 'image');
        }
      } catch (error) {
        console.error('Error loading background:', error);
      }
    };
    loadSavedBackground();
  }, []);

  const handlePrevious = () => {
    const currentArray = mediaType === 'video' ? videos : images;
    setCurrentIndex((prev) => (prev - 1 + currentArray.length) % currentArray.length);
  };

  const handleNext = () => {
    const currentArray = mediaType === 'video' ? videos : images;
    setCurrentIndex((prev) => (prev + 1) % currentArray.length);
  };

  const handleToggleMedia = async () => {
    if (customBackground) {
      try {
        await clearBannerBackground();
        setCustomBackground(null);
      } catch (error) {
        console.error('Error clearing background:', error);
      }
    } else {
      setMediaType(prev => prev === 'video' ? 'image' : 'video');
      setCurrentIndex(0);
    }
  };

  // Rest of your existing functions...

  return (
    <div className={`relative w-full h-[400px] overflow-hidden ${className}`}>
      {customBackground ? (
        mediaType === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src={customBackground} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={customBackground}
            alt="Custom Banner"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          />
        )
      ) : mediaType === 'video' ? (
        <video
          key={videos[currentIndex]}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.7)' }}
        >
          <source src={videos[currentIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={images[currentIndex]}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.7)' }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          className="bg-black/20 backdrop-blur-md hover:bg-black/40"
          onPress={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          className="bg-black/20 backdrop-blur-md hover:bg-black/40"
          onPress={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          onPress={() => setIsUploadModalOpen(true)}
          className="backdrop-blur-md"
          isLoading={loading}
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          onPress={handleToggleMedia}
          className="backdrop-blur-md"
        >
          {customBackground ? (
            <X className="h-5 w-5" />
          ) : mediaType === 'video' ? (
            <Image className="h-5 w-5" />
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Rest of your modal code... */}
    </div>
  );
};

export default Banner;