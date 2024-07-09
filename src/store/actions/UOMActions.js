import { message } from "antd";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token")

export const setUOM = (UOMs) => ({
  type: "SET_UOM",
  payload: UOMs,
});

export const fetchUOM = () => async (dispatch) => {
  try {
    const response = await fetch(`/getUOMMaster`, apiHeader("GET", token));
    const data = await response.json();

    dispatch(setUOM(data.responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUOM = (uomId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateUOMMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        uomId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      message.error("UOM updated successfully");
      dispatch(fetchUOM());
    } else {
      message.error("Update Failed");
      console.error("Update failed:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const saveUOM = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveUOMMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      message.error("UOM Added Successfully");
      dispatch(fetchUOM());
    } else {
      message.error("UOM Added Failed");
      console.error("Create failed:", createResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteUOM = (uomId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteUOMMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: "string",
        id: uomId,
      }),
    });

    if (deleteResponse.ok) {
      message.error("UOM deleted successfully");
      dispatch(fetchUOM());
    } else {
      message.error("failed to delete UOM");
      console.error("Delete failed:", deleteResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
