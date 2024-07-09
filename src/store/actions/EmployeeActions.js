import { message } from "antd";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token")

export const setEmployees = (employees) => ({
  type: 'SET_EMPLOYEES',
  payload: employees,
});

export const fetchEmployees = () => async (dispatch) => {
  try {
    const response = await fetch(`/getEmpMaster`, apiHeader("GET", token));
    const data = await response.json();

    dispatch(setEmployees(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateEmployee = (employeeId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateEmpMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        employeeId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.error('Employee updated successfully')
      dispatch(fetchEmployees()); 
    } else {
      message.error('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveEmployee = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveEmpMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    console.log("Created response: ", createResponse)
    // if (createResponse.ok) {
    //   message.error("Employee Added successfully")
    //   dispatch(fetchEmployees()); 
    // } else {
    //   message.error("something went wrong")
    //   console.error('Create failed:', createResponse.statusText);
    // }
  } catch (error) {

    console.error('Error occured creating employee:', error);
  }
};

export const deleteEmployee = (employeeId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteEmpMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 'string', 
        id: employeeId,
      }),
    });

    if (deleteResponse.ok) {
      message.error("Employee deleted successfully")
      dispatch(fetchEmployees());
    } else {
      message.error("Failed to delete employee")
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
