import { Toaster } from 'react-hot-toast';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/layout';
import store, { persistor } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// importing pages -------------------
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import ForgotPassword from './pages/forgotPassword/forgotPassword';
import { useState, useEffect } from 'react';
import AppLoading from './components/appLoading/appLoading';
import Jobs from './pages/jobs/jobs';
import Companies from './pages/companies/companies';
import Profile from './pages/profile/profile';
import ApplicationsList from './pages/applications/applications';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (


    <Provider store={store}>
      <PersistGate loading={<AppLoading />} persistor={persistor}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected route */}
            <Route path="/" element={<Layout />}>
              {/* Redirect '/' to '/jobs' */}
              <Route index element={<Navigate to="/jobs" />} />
              {/* Child routes */}
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/applications" element={<ApplicationsList />} />

            </Route>


            {/* Protected routes */}
            {/* <Route path="/details" element={<Details />} /> */}




          </Routes>
        </Router>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{


          }}
          toastOptions={{
            // Default toast options
            className: 'animate-slide-down',
            duration: 3000,
            style: {
              border: '2px solid #1dd1a1',
              textTransform: 'capitalize',
              boxShadow: '5px 5px 10px rgba(0, 0, 10, 1)',
              background: '#fff', // Change default background color (e.g., blue)
              fontWeight: 'bold',
              color: '#000', // Text color
            },
            // Success toast options
            success: {
              duration: 2000,
              style: {
                // background: '#28a745', // Change success background color (e.g., green)
                // color: '#fff', // Success text color
              },
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            // You can add error, warning, etc. styles here as well
          }}
        />

      </PersistGate>
    </Provider>

  );
}

export default App;
