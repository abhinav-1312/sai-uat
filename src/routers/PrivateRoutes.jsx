import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { fetchDepartments } from '../redux/slice/departmentSlice'
import { fetchEmployees } from '../redux/slice/employeeSlice'
import { fetchLocations } from '../redux/slice/locationSlice'
import { fetchLocators } from '../redux/slice/locatorSlice'
import { fetchUsers } from '../redux/slice/userSlice'
import { fetchVendors } from '../redux/slice/vendorSlice'
import { fetchOrganizations } from '../redux/slice/organizationSlice'
import { fetchUoms } from '../redux/slice/uomSlice'
import { fetchItemData } from '../redux/slice/itemSlice'

const PrivateRoutes = () => {
    const isLoggedIn = useSelector(state => state.auth.token !== null)

    const dispatch = useDispatch()

    useEffect(() => {
      if(isLoggedIn){
        dispatch(fetchDepartments())
        dispatch(fetchEmployees())
        dispatch(fetchLocations())
        dispatch(fetchLocators())
        dispatch(fetchUsers())
        dispatch(fetchVendors())
        dispatch(fetchOrganizations())
        dispatch(fetchUoms())
        dispatch(fetchItemData())
      }
    }, [])
  return (
    <>
      {
        isLoggedIn ? <Outlet /> : <Navigate to = "/login" />
      }
    </>
  )
}

export default PrivateRoutes
