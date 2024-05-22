import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RoutesComponent from './routers/Routes.jsx';
import SignIn from './auth/Login.jsx';
import ChangePasswordForm from './auth/ChangePasswordForm.jsx';

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
      {/* <Router> */}
        {/* {isLoggedIn ? (
          <Layout>
            <RoutesComponent />
          </Layout>
        ) : (
          <SignIn />
        )}
        <Routes>
          <Route path='/changePassword' element={<ChangePasswordForm />} />
        </Routes> */}
        {/* <Routes>
          <Route path='/' element={<Layout />}> 
            <RoutesComponent />
          </Route>
          <Route path='/changePassword' element={<ChangePasswordForm />} />
          <Route path='/login' element={<SignIn />} />
        </Routes> */}
        {/* <RoutesComponent /> */}
        {/* <Routes>
        <Route path='/changePassword' element={<ChangePasswordForm />} />
        <Route path='/login' element={<SignIn />} /> */}
        {/* <Route path='/' element={<Layout />}>

        </Route> */}
        <Router>
        <RoutesComponent />
        </Router>
        
        {/* </Routes>
      </Router> */}
    </div>
  );
}

export default App;
