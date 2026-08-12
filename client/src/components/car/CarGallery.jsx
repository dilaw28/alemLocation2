import React from 'react';

export default function CarGallery({ images, activeImg, onSelect }) {
  return (
    <div className="gallery">
      <div className="gallery-main">
        {images?.length > 0
          // Souvent le plus gros élément visible au chargement (LCP) → priorité haute, pas de lazy
          ? <img src={images[activeImg]} alt="Véhicule" fetchpriority="high" decoding="async" />
          : '🚗'}
      </div>
      {images?.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              className={`gallery-thumb ${activeImg === i ? 'active' : ''}`}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
