import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { apiCall, convertArrayToObject } from '../../utils/Functions';
import { message } from 'antd';

const organizationSlice = createSlice({
    name: "organizations",
    initialState: {
        data: null,
        orgMasterObj: null
    },
    reducers: {
        clearOrganization(state, action){
            state.data = null
        }
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
            state.orgMasterObj = convertArrayToObject(action.payload, "id", "organizationName")
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
            const {responseData} = await apiCall("GET", `/master/getOrgMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching organizations.", error)
            message.error("Error occured while fetching organizations.")
        }
    }
)

export const updateOrganization = createAsyncThunk(
    'organizations/updateOrganization',
    async ({organizationId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateOrgMaster`, token, {organizationId, ...values})
            message.error("ORganization updated successfully.")
            
        }
        catch(error){
            console.log("Error occured while updating organizations.", error)
            message.error("Error occured while updating organization.")
        }
    }
)
export const saveOrganization = createAsyncThunk(
    'organizations/saveOrganization',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveOrgMaster`, token, {...values})
            message.error("ORganization saved successfully.")
            
        }
        catch(error){
            console.log("Error occured while adding organization.", error)
            message.error("Error occured while adding organization.")
        }
    }
)
export const deleteOrganization = createAsyncThunk(
    'organizations/deleteOrganization',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteOrgMaster`, token, {...formData})
            message.error("ORganization deleted successfully.")
        }
        catch(error){
            console.log("Error occured while deleting organization.", error)
            message.error("Error occured while deleting organization.")
        }
    }
)

export const { clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer