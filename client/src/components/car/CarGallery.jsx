import React from 'react';

export default function CarGallery({ images, activeImg, onSelect }) {
  return (
    <div className="gallery">
      <div className="gallery-main">
        {images?.length > 0
          ? <img src={images[activeImg]} alt="Véhicule" />
          : '🚗'}
      </div>
      {images?.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={`gallery-thumb ${activeImg === i ? 'active' : ''}`}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
