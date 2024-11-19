import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { apiCall } from '../../utils/Functions';
import { message } from 'antd';

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
        data: null
    },
    reducers: {
        clearEmployee(state, action){
            state.data = null
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchEmployees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `/master/getEmpMaster`, token)
            return responseData
        }
        catch(error){
            message.error("Error occured while fetching employees data.")
        }
    }
)

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async ({employeeId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateEmpMaster`, token, {employeeId, ...values})
            
        }
        catch(error){
            message.error("Error occured while updating employee.")
        }
    }
)
export const saveEmployee = createAsyncThunk(
    'employees/saveEmployee',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveEmpMaster`, token, {...values})
            
        }
        catch(error){
            message.error("Error occured while adding employee.")
        }
    }
)
export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteEmpMaster`, token, {...formData})
            
        }
        catch(error){
            message.error("Error occured while deleting organization.")
        }
    }
)

export const { clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer