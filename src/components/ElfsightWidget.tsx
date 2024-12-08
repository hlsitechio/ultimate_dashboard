import React, { useEffect } from 'react';

declare global {
  interface Window {
    elfsight: any;
  }
}

const ElfsightWidget = () => {
  useEffect(() => {
    // Add Elfsight script
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="mt-1">
      <div 
        className="elfsight-app-5254c1a4-e805-41e9-8109-4f4ec79ea2c5" 
        data-elfsight-app-lazy 
      />
    </div>
  );
};

export default ElfsightWidget;