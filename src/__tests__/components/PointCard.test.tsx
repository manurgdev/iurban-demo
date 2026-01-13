import { render, screen, fireEvent } from '@testing-library/react';
import PointCard from '@/components/PointCard';
import { PointItemLight } from '@/types/api';

jest.mock('@/context/LocaleContext', () => ({
  useLocale: () => ({
    locale: 'es',
    messages: {
      common: {
        addToFavorites: 'Añadir a favoritos',
        removeFromFavorites: 'Quitar de favoritos',
      },
      accessibility: {
        pointImage: 'Imagen de {name}',
      },
    },
  }),
}));

describe('PointCard', () => {
  const mockPoint: PointItemLight = {
    id: 123,
    name: { es: 'Museo del Prado', en: 'Prado Museum' },
    nameSlug: { es: 'museo-del-prado', en: 'prado-museum' },
    image: 'https://example.com/image.jpg',
    itemType: 'point',
    location: 'Madrid, España',
    price: '10€',
    durationc: '1 hora',
    start: '2026-01-01',
    end: '2026-01-01',
  };

  it('should render the point name', () => {
    render(<PointCard point={mockPoint} />);
    expect(screen.getByRole('heading', { name: 'Museo del Prado' })).toBeInTheDocument();
  });

  it('should render the point image', () => {
    render(<PointCard point={mockPoint} />);
    const image = screen.getByAltText('Imagen de Museo del Prado');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('example.com'));
  });

  it('should render link with correct href for point', () => {
    render(<PointCard point={mockPoint} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/point/123/museo-del-prado');
  });

  it('should render link with correct href for event', () => {
    const eventPoint: PointItemLight = { ...mockPoint, itemType: 'event' };
    render(<PointCard point={eventPoint} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/event/123/museo-del-prado');
  });

  it('should toggle favorite on button click', () => {
    render(<PointCard point={mockPoint} />);
    const button = screen.getByRole('button', { name: 'Añadir a favoritos' });
    
    expect(button).toHaveAttribute('aria-pressed', 'false');
    
    fireEvent.click(button);
    
    expect(screen.getByRole('button', { name: 'Quitar de favoritos' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('should render placeholder when no image', () => {
    const pointWithoutImage: PointItemLight = { ...mockPoint, image: '' };
    render(<PointCard point={pointWithoutImage} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should use priority loading when priority prop is true', () => {
    render(<PointCard point={mockPoint} priority />);
    const image = screen.getByAltText('Imagen de Museo del Prado');
    expect(image).not.toHaveAttribute('loading', 'lazy');
  });

  it('should use lazy loading by default', () => {
    render(<PointCard point={mockPoint} />);
    const image = screen.getByAltText('Imagen de Museo del Prado');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});
