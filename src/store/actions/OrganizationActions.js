import { message } from "antd";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");
export const setOrganizations = (organizations) => ({
  type: 'SET_ORGANIZATIONS',
  payload: organizations,
});

const fetchOrganizations = () => async (dispatch) => {
  try {
    const response = await fetch(`/getOrgMaster`, apiHeader("GET", token) );
    const data = await response.json();

    dispatch(setOrganizations(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateOrganization = (organizationId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateOrgMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        organizationId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.success('Organizations updated successfully')
      dispatch(fetchOrganizations()); 
    } else {
      message.error('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveOrganization = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveOrgMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      message.success('Organizations Added Successfully')
      dispatch(fetchOrganizations()); 
    } else {
      message.error('Organizations Added Failed')
      console.error('Create failed:', createResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteOrganization = (organizationId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteOrgMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: "12345",
        id:organizationId,
      }),
    });

    if (deleteResponse.ok) {
      message.success('Organizations deleted successfully')
      dispatch(fetchOrganizations()); // Refresh the organization list after deletion
    } else {
      message.error('failed to delete Organizations')
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
