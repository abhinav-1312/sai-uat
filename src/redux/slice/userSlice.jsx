import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall } from '../../utils/Functions';

const userSlice = createSlice({
    name: "users",
    initialState: {
        data: null
    },
    reducers: {

    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `${BASE_URL}/master/getUserMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching user details.", error)
            alert("Error occured while fetching user details.")
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({userId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/updateUserMaster`, token, {userId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating user.", error)
            alert("Error occured while updating user.")
        }
    }
)
export const saveUser = createAsyncThunk(
    'users/saveUser',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/saveUserMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding user.", error)
            alert("Error occured while adding user.")
        }
    }
)
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/deleteUserMaster`, token, {userId})
            
        }
        catch(error){
            console.log("Error occured while deleting user.", error)
            alert("Error occured while deleting user.")
        }
    }
)

export default userSlice.reducer