import React, { useCallback, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./routers/Routes.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "./redux/slice/departmentSlice.jsx";
import { fetchEmployees } from "./redux/slice/employeeSlice.jsx";
import { fetchLocations } from "./redux/slice/locationSlice.jsx";
import { fetchLocators } from "./redux/slice/locatorSlice.jsx";
import { fetchUsers } from "./redux/slice/userSlice.jsx";
import { fetchVendors } from "./redux/slice/vendorSlice.jsx";
import { fetchOrganizations } from "./redux/slice/organizationSlice.jsx";
import { fetchUoms } from "./redux/slice/uomSlice.jsx";

function App() {
  const {token} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const populateStore = useCallback(() => {
    dispatch(fetchDepartments());
    dispatch(fetchEmployees());
    dispatch(fetchLocations());
    dispatch(fetchLocators());
    dispatch(fetchUsers());
    dispatch(fetchVendors());
    dispatch(fetchOrganizations());
    dispatch(fetchUoms());
  }, [dispatch])
  useEffect(() => {
    if(token){
      populateStore()
    }
  }, [token, populateStore])
  return (
    <div className="App">
      <Router>
        <RoutesComponent />
      </Router>
    </div>
  );
}

export default App;
