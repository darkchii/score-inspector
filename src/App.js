import { Card, CardContent, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import './App.css';
import Theme from './Theme';
import Root from './Routes/Root';
import Header from './Components/Header';
import Error from './Routes/Error';
import Footer from './Components/Footer';
import Update from './Routes/Update';
import { Route, Routes } from 'react-router-dom/dist';
import User from './Routes/User';
import Leaders from './Routes/Leaders';
import Snowfall from 'react-snowfall';
import { getSettings, loadSettings } from './Helpers/Settings';

function App() {
  const [, setRefresher] = useState(0);

  useEffect(() => {
    loadSettings();
    const onSettings = () => { setRefresher(Math.random()); };
    window.addEventListener('settings', onSettings);
    return () => { window.removeEventListener('settings', onSettings); };
  }, []);

  return (
    <>
      {
        getSettings().snowFall ?
          <Snowfall style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
          }} /> : <></>
      }
      <ThemeProvider theme={createTheme(Theme)}>
        <CssBaseline />
        <Header />
        <Container>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              {/* <RouterProvider router={router} /> */}
              <Routes>
                <Route path="/" element={<Root />} />
                <Route path="update/:id" element={<Update />} />
                <Route path="*" element={<Error />} />
                <Route path="user/:id" element={<User />} />
                <Route path="leaderboard" element={<Leaders />}>
                  <Route index element={<Leaders />} />
                  <Route path="stat/:stat" element={<Leaders />}>
                    <Route index element={<Leaders />} />
                    <Route path="page/:page" element={<Leaders />} />
                  </Route>
                </Route>
              </Routes>
            </CardContent>
          </Card>
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;