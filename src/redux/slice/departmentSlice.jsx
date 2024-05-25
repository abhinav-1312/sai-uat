import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall } from '../../utils/Functions';

const departmentSlice = createSlice({
    name: "departments",
    initialState: {
        data: null
    },
    reducers: {

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
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `${BASE_URL}/master/getDeptMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching departments.", error)
            alert("Error occured while fetching departments.")
        }
    }
)

export const updateDepartment = createAsyncThunk(
    'departments/updateDepartment',
    async ({departmentId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/updateDeptMaster`, token, {departmentId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating department.", error)
            alert("Error occured while updating department.")
        }
    }
)
export const saveDepartment = createAsyncThunk(
    'departments/saveDepartment',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/saveDeptMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding department.", error)
            alert("Error occured while adding department.")
        }
    }
)
export const deleteDepartment = createAsyncThunk(
    'departments/deleteDepartment',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/deleteDeptMaster`, token, {...formData})
            
        }
        catch(error){
            console.log("Error occured while deleting organization.", error)
            alert("Error occured while deleting organization.")
        }
    }
)

export default departmentSlice.reducer