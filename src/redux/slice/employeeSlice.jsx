import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall } from '../../utils/Functions';

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
            console.log("Error occured while fetching employees data.", error)
            alert("Error occured while fetching employees data.")
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
            console.log("Error occured while updating employee.", error)
            alert("Error occured while updating employee.")
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
            console.log("Error occured while adding employee.", error)
            alert("Error occured while adding employee.")
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
            console.log("Error occured while deleting organization.", error)
            alert("Error occured while deleting organization.")
        }
    }
)

export const { clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer