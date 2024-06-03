import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCall } from "../../utils/Functions";
import { BASE_URL } from "../../utils/BaseUrl";

const itemSlice = createSlice({
    name: "item",
    initialState: {
        data: null
    },
    reducers: {
        clearItem(state, action){
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchItemData.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchItemData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchItemData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})

export const fetchItemData = createAsyncThunk(
    "item/fetchItemData",

    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `/master/getItemMaster`, token)
            return responseData
        }catch(error){
            console.log("Error occured while fetching item data.", error)
            alert("Error occured while fetching item data.")
        }
    }
)

export const { clearItem } = itemSlice.actions;
export default itemSlice.reducer