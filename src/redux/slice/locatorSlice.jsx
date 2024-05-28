import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall } from '../../utils/Functions';

const locatorSlice = createSlice({
    name: "locators",
    initialState: {
        data: null
    },
    reducers: {
        clearLocator(state, action){
            state.data = null
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
            const {responseData} = await apiCall("GET", `${BASE_URL}/master/getLocatorMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching locator details.", error)
            alert("Error occured while fetching locator details.")
        }
    }
)

export const updateLocator = createAsyncThunk(
    'locators/updateLocator',
    async ({locatorId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/updateLocatorMaster`, token, {locatorId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating locator.", error)
            alert("Error occured while updating locator.")
        }
    }
)
export const saveLocator = createAsyncThunk(
    'locators/saveLocator',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/saveLocatorMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding locator.", error)
            alert("Error occured while adding locator.")
        }
    }
)
export const deleteLocator = createAsyncThunk(
    'locators/deleteLocator',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/deleteLocatorMaster`, token, {...formData})
            
        }
        catch(error){
            console.log("Error occured while deleting locator.", error)
            alert("Error occured while deleting locator.")
        }
    }
)

export const { clearLocator } = locatorSlice.actions;
export default locatorSlice.reducer