import { useEffect } from 'react';

export default function GoogleAd({ slot, format = 'auto', responsive = true, style = {} }) {
  useEffect(() => {
    // This checks if the script has loaded and initialized AdSense
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    } else {
      console.log('AdSense not loaded yet');
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3321448161852295"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
}