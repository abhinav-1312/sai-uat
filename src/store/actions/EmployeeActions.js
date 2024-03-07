import { BASE_URL } from "../../utils/BaseUrl";

export const setEmployees = (employees) => ({
  type: 'SET_EMPLOYEES',
  payload: employees,
});

export const fetchEmployees = () => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/getEmpMaster`);
    const data = await response.json();

    dispatch(setEmployees(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateEmployee = (employeeId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`${BASE_URL}/updateEmpMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      alert('Employee updated successfully')
      dispatch(fetchEmployees()); 
    } else {
      alert('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveEmployee = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`${BASE_URL}/saveEmpMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      alert("Employee Added successfully")
      dispatch(fetchEmployees()); 
    } else {
      alert("something went wrong")
      console.error('Create failed:', createResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteEmployee = (employeeId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`${BASE_URL}/deleteEmpMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'string', 
        id: employeeId,
      }),
    });

    if (deleteResponse.ok) {
      alert("Employee deleted successfully")
      dispatch(fetchEmployees());
    } else {
      alert("Failed to delete employee")
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
