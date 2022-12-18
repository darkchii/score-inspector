import { Card, CardContent, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
  },
  {
    path: 'update/:updateId',
    element: <Update />,
    errorElement: <Error />,
  }
]);

function App() {
  return (
    <>
      <ThemeProvider theme={createTheme(Theme)}>
        <CssBaseline />
        <Header />
        <Container>
          <Card>
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