"use client";

import { getIconComponent, IconName } from "@/lib/iconMap";

interface ProductSectionIconProps {
  iconName?: IconName;
}

export function ProductSectionIcon({ iconName }: ProductSectionIconProps) {
  if (!iconName) return null;
  
  const IconComponent = getIconComponent(iconName);
  if (!IconComponent) return null;
  
  return <IconComponent />;
}
