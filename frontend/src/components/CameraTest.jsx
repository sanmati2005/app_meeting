import React, { useRef, useEffect, useState } from 'react';

const CameraTest = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please check permissions and ensure you are using HTTPS or localhost.');
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Camera Test</h2>
      {error ? (
        <div style={{ color: 'red', padding: '20px' }}>
          {error}
        </div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          style={{ width: '100%', maxWidth: '600px', border: '2px solid #ccc' }}
        />
      )}
      <p>Camera test page - if you see your video above, the camera is working correctly.</p>
    </div>
  );
};

export default CameraTest;