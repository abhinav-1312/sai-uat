// LocationActions.js
import { message } from "antd";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");

export const setLocations = (locations) => ({
  type: 'SET_LOCATIONS',
  payload: locations,
});

export const fetchLocations = () => async (dispatch) => {
  try {
    const response = await fetch(`/getLocationMaster`, apiHeader("GET", token) );
    const data = await response.json();

    dispatch(setLocations(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateLocation = (locationId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateLocationMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        locationId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.success('Location updated successfully')
      dispatch(fetchLocations()); 
    } else {
      message.error('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveLocation = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/master/saveLocationMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      message.success('Location Added Successfully')
      dispatch(fetchLocations()); 
    } else {
      message.error('Location Added Failed')
      console.error('Create failed:', createResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteLocation = (locationId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteLocationMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' :`Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 'string', 
        locationId,
      }),
    });

    if (deleteResponse.ok) {
      message.success('Location deleted successfully')
      dispatch(fetchLocations());
    } else {
      message.error('failed to delete Location')
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
