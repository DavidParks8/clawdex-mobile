import type { AppTheme } from '../theme';
import { createDrawerContentStyleGroup1 } from './drawerContentStyles1';
import { createDrawerContentStyleGroup2 } from './drawerContentStyles2';
import { createDrawerContentStyleGroup3 } from './drawerContentStyles3';

export type DrawerContentStyles =
  & ReturnType<typeof createDrawerContentStyleGroup1>
  & ReturnType<typeof createDrawerContentStyleGroup2>
  & ReturnType<typeof createDrawerContentStyleGroup3>;

export function createDrawerContentStyles(theme: AppTheme): DrawerContentStyles {
  return {
    ...createDrawerContentStyleGroup1(theme),
    ...createDrawerContentStyleGroup2(theme),
    ...createDrawerContentStyleGroup3(theme),
  } as DrawerContentStyles;
}