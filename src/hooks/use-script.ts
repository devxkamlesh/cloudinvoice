import { useEffect, useState } from 'react';

export function useScript(src: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      setLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [src]);

  return loaded;
}
