import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { apiCall, convertArrayToObject } from '../../utils/Functions';
import { message } from 'antd';

const locatorSlice = createSlice({
    name: "locators",
    initialState: {
        data: null,
        locatorObj: null
    },
    reducers: {
        clearLocator(state, action){
            state.data = null
            state.locatorObj = null
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchLocators.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchLocators.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
            state.locatorObj = convertArrayToObject(action.payload, "id", "locatorDesc")
          })
          .addCase(fetchLocators.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchLocators = createAsyncThunk(
    'locators/fetchLocators',
    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `/master/getLocatorMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching locator details.", error)
            message.error("Error occured while fetching locator details.")
        }
    }
)

export const updateLocator = createAsyncThunk(
    'locators/updateLocator',
    async ({locatorId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateLocatorMaster`, token, {locatorId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating locator.", error)
            message.error("Error occured while updating locator.")
        }
    }
)
export const saveLocator = createAsyncThunk(
    'locators/saveLocator',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveLocatorMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding locator.", error)
            message.error("Error occured while adding locator.")
        }
    }
)
export const deleteLocator = createAsyncThunk(
    'locators/deleteLocator',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteLocatorMaster`, token, {...formData})
            
        }
        catch(error){
            console.log("Error occured while deleting locator.", error)
            message.error("Error occured while deleting locator.")
        }
    }
)

export const { clearLocator } = locatorSlice.actions;
export default locatorSlice.reducer