import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { apiCall } from '../../utils/Functions';
import { message } from 'antd';

const userSlice = createSlice({
    name: "users",
    initialState: {
        data: null
    },
    reducers: {
        clearUser(state, action){
            state.data = null
        }
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
            const {responseData} = await apiCall("GET", `/master/getUserMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching user details.", error)
            message.error("Error occured while fetching user details.")
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({userId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateUserMaster`, token, {userId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating user.", error)
            message.error("Error occured while updating user.")
        }
    }
)
export const saveUser = createAsyncThunk(
    'users/saveUser',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveUserMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding user.", error)
            message.error("Error occured while adding user.")
        }
    }
)
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteUserMaster`, token, {userId})
            
        }
        catch(error){
            console.log("Error occured while deleting user.", error)
            message.error("Error occured while deleting user.")
        }
    }
)

export const { clearUser } = userSlice.actions;
export default userSlice.reducer