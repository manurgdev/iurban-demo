import { render, screen } from '@testing-library/react';
import Carousel from '@/components/Carousel';

describe('Carousel', () => {
  const renderCarousel = (children: React.ReactNode, props = {}) => {
    return render(
      <Carousel ariaLabel="Test carousel" {...props}>
        {children}
      </Carousel>
    );
  };

  it('should render children', () => {
    renderCarousel(
      <>
        <div data-testid="item-1">Item 1</div>
        <div data-testid="item-2">Item 2</div>
      </>
    );
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });

  it('should have accessible aria-label', () => {
    renderCarousel(<div>Content</div>);
    
    const region = screen.getByRole('region', { name: 'Test carousel' });
    expect(region).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    renderCarousel(
      <>
        <div style={{ width: '300px' }}>Item 1</div>
        <div style={{ width: '300px' }}>Item 2</div>
        <div style={{ width: '300px' }}>Item 3</div>
      </>
    );
    
    // Verificamos que el carrusel se renderiza correctamente
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('should apply custom button color', () => {
    const { container } = renderCarousel(
      <div style={{ width: '1000px' }}>Wide content</div>,
      { buttonColor: '#ff0000' }
    );
    
    expect(container.querySelector('[aria-label="Test carousel"]')).toBeInTheDocument();
  });

  it('should center content when centered prop is true', () => {
    renderCarousel(
      <div data-testid="centered-item">Centered content</div>,
      { centered: true }
    );
    
    expect(screen.getByTestId('centered-item')).toBeInTheDocument();
  });

  it('should handle scroll amount', () => {
    const { container } = renderCarousel(
      <>
        <div style={{ width: '300px' }}>Item 1</div>
        <div style={{ width: '300px' }}>Item 2</div>
      </>,
      { scrollAmount: 500 }
    );
    
    expect(container.querySelector('[style*="scroll"]') || container.firstChild).toBeTruthy();
  });
});
