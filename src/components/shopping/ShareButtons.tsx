import React, { useEffect } from 'react';

interface ShareButtonsProps {
  text: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ text, url }) => {
  useEffect(() => {
    // Create and inject Fouita script
    const script = document.createElement('script');
    script.src = 'https://cdn.fouita.com/widgets/0x1b82b2.js';
    script.async = true;

    const container = document.createElement('div');
    container.setAttribute('key', 'Buttons Share Horizantal Icon Only');
    container.setAttribute('class', 'ft');
    container.setAttribute('id', 'ft2ydgtpt');
    container.setAttribute('data-url', url);
    container.setAttribute('data-text', text);
    
    container.appendChild(script);
    
    const shareContainer = document.getElementById('share-buttons-container');
    if (shareContainer) {
      shareContainer.innerHTML = '';
      shareContainer.appendChild(container);
    }

    return () => {
      // Cleanup
      if (shareContainer) {
        shareContainer.innerHTML = '';
      }
    };
  }, [text, url]);

  return <div id="share-buttons-container" className="flex justify-center py-4" />;
};

export default ShareButtons;