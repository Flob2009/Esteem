import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EE',
    },
    secondary: {
      main: '#5D6DFF',
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Arial', 'sans-serif'].join(','),
  },
});

export default theme;