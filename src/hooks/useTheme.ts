import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';
import { Theme } from '../types';

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
