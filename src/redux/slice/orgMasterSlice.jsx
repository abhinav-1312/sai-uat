import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCall, convertArrayToObject } from "../../utils/Functions";

const orgMasterSlice = createSlice({
    name: 'orgMaster',
    initialState:  {
        data: null,
        orgMasterObj: null
    },
    reducers: {
        clearOrgMaster(state, action){
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchOrgMaster.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchOrgMaster.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
            state.orgMasterObj = convertArrayToObject(action.payload, "id", "organizationName")
          })
          .addCase(fetchOrgMaster.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})

export const fetchOrgMaster = createAsyncThunk (
    'orgMaster/fetchOrgMaster',
    async (_, {getState}) => {
        const {token} = getState().auth
        const {responseData} = await apiCall('GET', "/master/getOrgMaster",  token)
        return responseData
    }
)

export const { clearOrgMaster } = orgMasterSlice.actions;
export default orgMasterSlice.reducer