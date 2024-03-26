import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RoutesComponent from './routers/Routes.jsx';
import SignIn from './auth/Login.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const userLoggedIn = localStorage.getItem('userCd');
    if (userLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        {isLoggedIn ? (
          <Layout>
            <RoutesComponent />
          </Layout>
        ) : (
          <SignIn />
        )}
      </Router>
    </div>
  );
}

export default App;
