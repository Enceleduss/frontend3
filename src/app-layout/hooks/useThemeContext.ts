import {useContext,useState,createContext} from 'react';
const [theme,setTheme] = useState('light');
const ThemeContext = createContext({theme:'light',setTheme:()=>{}});
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};