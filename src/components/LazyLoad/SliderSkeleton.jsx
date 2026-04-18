import React from 'react';

export default function SliderSkeleton() {
  const skeletonCards = Array(5).fill(0);

  return (
    <div className="product-slider-flash-sale-skeleton" style={{ overflow: 'hidden' }}>
      {skeletonCards.map((_, idx) => (
        <div className="flash-sale-skeleton-card" key={idx}>
          <div className="skeleton-img" />
          <div className="skeleton-line short" />
          <div className="skeleton-line long" />
        </div>
      ))}
    </div>
  );
}
