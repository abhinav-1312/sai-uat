import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RoutesComponent from './routers/Routes.jsx';
import SignIn from './auth/Login.jsx';
import ChangePasswordForm from './auth/ChangePasswordForm.jsx';
import { UserProvider } from './context/UserContext.js';
import { useDispatch } from 'react-redux';
import { fetchDepartments } from './redux/slice/departmentSlice.jsx';
import { fetchEmployees } from './redux/slice/employeeSlice.jsx';
import { fetchLocations } from './redux/slice/locationSlice.jsx';
import { fetchUsers } from './redux/slice/userSlice.jsx';
import { fetchVendors } from './redux/slice/vendorSlice.jsx';
import { fetchLocators } from './redux/slice/locatorSlice.jsx';
import { fetchOrganizations } from './redux/slice/organizationSlice.jsx';
import { fetchUOM } from './store/actions/UOMActions.js';
import { fetchItemData } from './redux/slice/itemSlice.jsx';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   // Check if user is already logged in
  //   const userLoggedIn = localStorage.getItem('userCd');
  //   if (userLoggedIn) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);
  const dispatch = useDispatch()

  const populateStore = () => {
    dispatch(fetchDepartments())
    dispatch(fetchEmployees())
    dispatch(fetchLocations())
    dispatch(fetchLocators())
    dispatch(fetchUsers())
    dispatch(fetchVendors())
    dispatch(fetchOrganizations())
    dispatch(fetchUOM())

  }

  useEffect(()=>{
    // populateStore()
}, [])


  
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
        {/* <UserProvider> */}
        <Router>
        <RoutesComponent />
        </Router>
        {/* </UserProvider> */}
        
        {/* </Routes>
      </Router> */}
    </div>
  );
}

export default App;
