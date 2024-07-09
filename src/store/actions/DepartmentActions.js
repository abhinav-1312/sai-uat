// DepartmentActions.js
import { message } from "antd";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";


const token = localStorage.getItem("token");

export const setDepartments = (departments) => ({
  type: 'SET_DEPARTMENTS',
  payload: departments,
});

export const fetchDepartments = () => async (dispatch) => {
  try {
    const response = await fetch(`/getDeptMaster`, apiHeader("GET", token));
    console.log("Response: ", response)
    const data = await response.json();

    dispatch(setDepartments(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


export const updateDepartment = (departmentId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateDeptMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        departmentId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.error('Department updated successfully')
      dispatch(fetchDepartments()); 
    } else {
      message.error('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveDepartment = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveDeptMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      message.error('Department Added Successfully')
      dispatch(fetchDepartments());
    } else {
      message.error('Department Added Failed')
      console.error('Create failed:', createResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteDepartment = (departmentId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteDeptMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 'string', 
        departmentId,
      }),
    });

    if (deleteResponse.ok) {
      message.error('Department deleted successfully')
      dispatch(fetchDepartments()); 
    } else {
      message.error('failed to delete department')
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
