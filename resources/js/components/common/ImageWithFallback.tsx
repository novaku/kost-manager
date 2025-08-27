import React, { useState } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

const ImageWithFallback: React.FC<Props> = ({ src, fallback = '/default-kostan.svg', alt, ...rest }) => {
  const initial = typeof src === 'string' ? src : undefined;
  const [imgSrc, setImgSrc] = useState<string | undefined>(initial);

  const handleError = () => {
    if (imgSrc !== fallback) setImgSrc(fallback);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...rest}
    />
  );
};

export default ImageWithFallback;
