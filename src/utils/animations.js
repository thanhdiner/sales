export const flyToCartAnimation = (e, imgUrl) => {
  if (!e || !imgUrl) return;

  const cartIcon = document.querySelector('.header__action__cart');
  if (!cartIcon) return;

  const cartRect = cartIcon.getBoundingClientRect();
  
  // Try to find the closest product image, fallback to click position
  const productContainer = e.target.closest('.product') || e.target.closest('.product-detail') || e.target.closest('.product-card');
  let startRect;
  if (productContainer) {
    const productImg = productContainer.querySelector('img');
    if (productImg) {
      startRect = productImg.getBoundingClientRect();
    }
  }

  const startX = startRect ? startRect.left + startRect.width / 2 : e.clientX;
  const startY = startRect ? startRect.top + startRect.height / 2 : e.clientY;

  // Create ghost element
  const ghost = document.createElement('img');
  ghost.src = imgUrl;
  ghost.style.position = 'fixed';
  ghost.style.zIndex = '999999';
  ghost.style.width = '60px';
  ghost.style.height = '60px';
  ghost.style.objectFit = 'cover';
  ghost.style.borderRadius = '50%';
  ghost.style.left = `${startX - 30}px`;
  ghost.style.top = `${startY - 30}px`;
  ghost.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  ghost.style.pointerEvents = 'none';
  ghost.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  
  document.body.appendChild(ghost);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ghost.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
      ghost.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
      ghost.style.width = '20px';
      ghost.style.height = '20px';
      ghost.style.opacity = '0.3';
      ghost.style.transform = 'scale(0.5)';
    });
  });

  // Cleanup & Cart bump effect
  setTimeout(() => {
    if (ghost.parentNode) {
      ghost.parentNode.removeChild(ghost);
    }
    
    // Add bump to cart icon wrapper
    const cartWrapper = cartIcon.closest('.header__action__cart--btn') || cartIcon;
    cartWrapper.style.transition = 'transform 0.15s ease-out';
    cartWrapper.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
      cartWrapper.style.transform = 'scale(1)';
    }, 150);
    
  }, 800);
}
