import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCall } from "../../utils/Functions";

const ohqSlice = createSlice({
    name: "ohq",
    initialState: {
        data: null
    },
    reducers: {
        clearOhq(state, action){
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchOhq.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchOhq.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchOhq.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})

export const fetchOhq = createAsyncThunk(
    "ohq/fetchOhq",
    async (_, {getState}) => {
        try{
            const {token, userCd} = getState().auth
            const {responseData} = await apiCall("POST", `/master/getOHQ`, token, { itemCode: null, user: userCd })
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching ohq details.", error)
            alert("Error occured while fetching ohq details.")
        }
    }
)

export const { clearOhq } = ohqSlice.actions;
export default ohqSlice.reducer