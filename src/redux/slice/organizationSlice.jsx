import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall } from '../../utils/Functions';

const organizationSlice = createSlice({
    name: "organizations",
    initialState: {
        data: null
    },
    reducers: {

    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchOrganizations.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchOrganizations.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchOrganizations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})

export const fetchOrganizations = createAsyncThunk(
    'organizations/fetchOrganizations',
    async (_, {getState}) => {
        try{
            // const {token} = "1234"
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `${BASE_URL}/master/getOrgMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching organizations.", error)
            alert("Error occured while fetching organizations.")
        }
    }
)

export const updateOrganization = createAsyncThunk(
    'organizations/updateOrganization',
    async ({organizationId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/updateOrgMaster`, token, {organizationId, ...values})
            alert("ORganization updated successfully.")
            
        }
        catch(error){
            console.log("Error occured while updating organizations.", error)
            alert("Error occured while updating organization.")
        }
    }
)
export const saveOrganization = createAsyncThunk(
    'organizations/saveOrganization',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/saveOrgMaster`, token, {...values})
            alert("ORganization saved successfully.")
            
        }
        catch(error){
            console.log("Error occured while adding organization.", error)
            alert("Error occured while adding organization.")
        }
    }
)
export const deleteOrganization = createAsyncThunk(
    'organizations/deleteOrganization',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/deleteOrgMaster`, token, {...formData})
            alert("ORganization deleted successfully.")
        }
        catch(error){
            console.log("Error occured while deleting organization.", error)
            alert("Error occured while deleting organization.")
        }
    }
)

export default organizationSlice.reducer