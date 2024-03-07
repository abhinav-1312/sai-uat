// utilsActions.js
import { BASE_URL } from "../../utils/BaseUrl";

export const authenticateUser = (userCd, password) => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/login/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userCd,
        password,
      }),
    });
    const data = await response.json();
console.log(data);
    if (response.ok) {
      const { userDetails, organizationDetails } = data.responseData;
      dispatch(setUserDetails(userDetails));
      dispatch(setOrganizationDetails(organizationDetails));
      // Optionally, you may perform additional actions upon successful authentication
    } else {
      console.error('Authentication failed:', data.responseStatus.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const setUserDetails = (userDetails) => ({
  type: 'SET_USER_DETAILS',
  payload: userDetails,
});

export const setOrganizationDetails = (organizationDetails) => ({
  type: 'SET_ORGANIZATION_DETAILS',
  payload: organizationDetails,
});
