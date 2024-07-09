import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { message } from 'antd'
import axios from 'axios'

const userRoleMap = {
    "01": "ssadmin",
    "11": "admin",
    "12": "InventoryManager",
    "13": "QualityManager",
    "14": "ItemAdmin",
    "15": "VendorAdmin",
    "99": "SuperAdmin"
}

const initialState = {
    userCd: null,
    userRole: null, 
    token: null,
    organizationDetails: null,
    locationDetails: null,
    userDetails: null
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userLogout(state, action){
            state.userCd =  null
            state.userRole = null 
            state.token =  null
            state.organizationDetails =  null
            state.locationDetails =  null
            state.userDetails =  null
        },
    },
    extraReducers: (builder) => {
        builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { userRole, userCd, token, organizationDetails, locationDetails, userDetails } = action.payload;
        state.userRole = userRole
        state.userCd = userCd
        state.token = token
        state.organizationDetails = organizationDetails
        state.locationDetails = locationDetails
        state.userDetails = userDetails

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    }
})

export const login = createAsyncThunk(

    'auth/login',
    async (formData) => {
        try {
            const url = "/login/authenticate"
            const {data} = await axios.post(url, formData)
            const { userCd, userType } = data.responseData.userDetails;
            const { token } = data.responseData;
            const { organizationDetails, locationDetails, userDetails } = data.responseData;
            const userRole = userRoleMap[userType]
            console.log("Login successful")
            return {userCd, userRole, token, organizationDetails, locationDetails, userDetails}
        }catch(error){
            console.log("Error while loggin in.", error)
            message.error("Some error occured while logging in. Please try again.")
        }
    }
)

export const { userLogout } = authSlice.actions;
export default authSlice.reducer;