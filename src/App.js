import { Box, Container, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import './App.css';
import DefaultTheme from './Theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RouteIndex from './Routes/RouteIndex';
import RouteError from './Routes/RouteError';
import Header from './Components/Header';
import RouteBeatmaps from './Routes/RouteBeatmaps';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={DefaultTheme}>
        <CssBaseline />
        <Header />
        <Box sx={{ m: 5 }}>
          <Routes>
            <Route index element={<RouteIndex />} />
            <Route path="/beatmaps" element={<RouteBeatmaps />} />
            <Route path="*" element={<RouteError />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
