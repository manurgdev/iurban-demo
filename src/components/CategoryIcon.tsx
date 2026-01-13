/**
 * Componente de icono de categoría usando Lucide React.
 * Mapeo el slug del icono de la API a un icono de Lucide.
 */

import {
  MapPin,
  Mountain,
  UtensilsCrossed,
  Landmark,
  Theater,
  TreePine,
  ShoppingBag,
  Gamepad2,
  Leaf,
  Home,
  Calendar,
  type LucideIcon,
} from 'lucide-react';

interface CategoryIconProps {
  icon: string;
  className?: string;
  isDark?: boolean;
}

/**
 * Mapeo de iconos de categoría a componentes Lucide.
 */
const iconMap: Record<string, LucideIcon> = {
  'aventura': Mountain,
  'restauracion': UtensilsCrossed,
  'patrimonio': Landmark,  
  'cultural': Theater,
  'parques-y-jardines': TreePine,
  'compras': ShoppingBag,
  'zona-de-ocio': Gamepad2,
  'naturaleza': Leaf,
  'nucleo': Home,
  'eventos': Calendar,
};

export default function CategoryIcon({ icon, className = 'w-6 h-6', isDark = false }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || MapPin;
  const colorClass = isDark ? 'text-white' : 'text-sky-600';

  return (
    <IconComponent 
      className={`${className} ${colorClass}`}
      aria-hidden="true"
      strokeWidth={2}
    />
  );
}
