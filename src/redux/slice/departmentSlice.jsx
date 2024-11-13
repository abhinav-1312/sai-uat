import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { apiCall } from '../../utils/Functions';
import { message } from 'antd';

const departmentSlice = createSlice({
    name: "departments",
    initialState: {
        data: null
    },
    reducers: {
        clearDepartment(state, action){
            state.data = null
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchDepartments.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchDepartments.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchDepartments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',
    async (_, {getState}) => {
        try{
            // const {token} = "1234"
            console.log("Called dept disp")
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `/master/getDeptMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching departments.", error)
            message.error("Error occured while fetching departments.")
        }
    }
)

export const updateDepartment = createAsyncThunk(
    'departments/updateDepartment',
    async ({departmentId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateDeptMaster`, token, {departmentId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating department.", error)
            message.error("Error occured while updating department.")
        }
    }
)
export const saveDepartment = createAsyncThunk(
    'departments/saveDepartment',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveDeptMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding department.", error)
            message.error("Error occured while adding department.")
        }
    }
)
export const deleteDepartment = createAsyncThunk(
    'departments/deleteDepartment',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteDeptMaster`, token, {...formData})
            
        }
        catch(error){
            console.log("Error occured while deleting organization.", error)
            message.error("Error occured while deleting organization.")
        }
    }
)

export const { clearDepartment } = departmentSlice.actions;
export default departmentSlice.reducer