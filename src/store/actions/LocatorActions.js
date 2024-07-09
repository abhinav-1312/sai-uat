// LocatorActions.js
import { message } from "antd";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";
const token = localStorage.getItem("token");

export const setLocators = (locators) => ({
  type: 'SET_LOCATORS',
  payload: locators,
});

export const fetchLocators = () => async (dispatch) => {
  try {
    const response = await fetch(`/getLocatorMaster`, apiHeader("GET", token));
    const data = await response.json();

    dispatch(setLocators(data.responseData));
  } catch (error) {
    message.error('Error fetching locator data:', error);
  }
};

export const updateLocator = (locatorId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateLocatorMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        locatorMasterId: locatorId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.success('Locator updated successfully')
      dispatch(fetchLocators());
    } else {
      message.error('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveLocator = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveLocatorMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      message.success('Locator Added Successfully')
      dispatch(fetchLocators()); 
    } else {
      message.error('Locator Added Failed')
      console.error('Create failed:', createResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteLocator = (locatorId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteLocatorMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 'string', 
        id: locatorId,
      }),
    });

    if (deleteResponse.ok) {
      message.success('Locator deleted successfully')
      dispatch(fetchLocators()); 
    } else {
      message.error('failed to delete Locator')
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
