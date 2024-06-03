import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall, convertArrayToObject } from '../../utils/Functions';

const locationSlice = createSlice({
    name: "locations",
    initialState: {
        data: null,
        locationObj: null
    },
    reducers: {
        clearLocation(state, action){
            state.data = null
            state.locationObj = null
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchLocations.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchLocations.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
            state.locationObj = convertArrayToObject(action.payload, "id", "locationName")
          })
          .addCase(fetchLocations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchLocations = createAsyncThunk(
    'locations/fetchLocations',
    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `/master/getLocationMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching location details.", error)
            alert("Error occured while fetching location details.")
        }
    }
)

export const updateLocation = createAsyncThunk(
    'locations/updateLocation',
    async ({locationId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateLocationMaster`, token, {locationId, ...values})
            alert("Location updated succesfully.")
            
        }
        catch(error){
            console.log("Error occured while updating location.", error)
            alert("Error occured while updating location.")
        }
    }
)
export const saveLocation = createAsyncThunk(
    'locations/saveLocation',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveLocationMaster`, token, {...values})
            alert("Location saved succesfully.")
            
        }
        catch(error){
            console.log("Error occured while adding location.", error)
            alert("Error occured while adding location.")
        }
    }
)
export const deleteLocation = createAsyncThunk(
    'locations/deleteLocation',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteLocationMaster`, token, {...formData})
            alert("Location deleted succesfully.")
        }
        catch(error){
            console.log("Error occured while deleting location.", error)
            alert("Error occured while deleting location.")
        }
    }
)

export const { clearLocation } = locationSlice.actions;
export default locationSlice.reducer