import RoundedBallIcon from "@/components/shared/icons/RoundedBallIcon";
import ObIcon from "@/components/shared/icons/ObIcon";

export const ICON_MAP = {
  "RoundedBallIcon": RoundedBallIcon,
  "ObIcon": ObIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;

export function getIconComponent(iconName: IconName | undefined): React.ComponentType | undefined {
  if (!iconName) return undefined;
  return ICON_MAP[iconName];
}
