// import { BASE_URL } from "../../utils/BaseUrl";
import { message } from "antd";
import {BASE_URL} from "../../utils/BaseUrl"
import {apiHeader} from "../../utils/Functions"
import axios from "axios"

export const setUsers = (users) => ({
  type: "SET_USERS",
  payload: users,
});

const token = localStorage.getItem("token");
export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await fetch(`/getUserMaster`, apiHeader("GET", token));
    const data = await response.json();

    dispatch(setUsers(data.responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUser = (userId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateUserMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.error("Users updated successfully");
      dispatch(fetchUsers());
    } else {
      message.error("Update Failed");
      console.error("Update failed:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// export const saveUser = (values) => async (dispatch) => {
//   try {
//     const createResponse = await fetch(`/saveUserMaster`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization' : token
//       },
//       body: JSON.stringify(values),
//     });

//     if (createResponse.ok) {
//       message.error("Users Added Successfully");
//       dispatch(fetchUsers());
//     } else {
//       message.error("User Added Failed");
//       console.error("Create failed:", createResponse.statusText);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

export const saveUser = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveUserMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const responseData = await createResponse.json();

    if (responseData && responseData.responseStatus && responseData.responseStatus.statusCode === 200) {
      message.error("Users Added Successfully");
      dispatch(fetchUsers());
    } else {
      // Handle error based on response body
      if (responseData && responseData.responseStatus) {
        message.error(responseData.responseStatus.message);
      } else {
        message.error("User Added Failed");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    message.error("An error occurred while processing your request");
  }
};



export const deleteUser = (userId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteUserMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: "string",
        id: userId,
      }),
    });

    if (deleteResponse.ok) {
      message.error("Users deleted successfully");
      dispatch(fetchUsers());
    } else {
      message.error("failed to delete Users");
      console.error("Delete failed:", deleteResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
