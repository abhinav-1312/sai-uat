import { BASE_URL } from "../../utils/BaseUrl";

export const setUOM = (UOMs) => ({
  type: "SET_UOM",
  payload: UOMs,
});

export const fetchUOM = () => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/getUOMMaster`);
    const data = await response.json();

    dispatch(setUOM(data.responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUOM = (uomId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`${BASE_URL}/updateUOMMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uomId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      alert("UOM updated successfully");
      dispatch(fetchUOM());
    } else {
      alert("Update Failed");
      console.error("Update failed:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const saveUOM = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`${BASE_URL}/saveUOMMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      alert("UOM Added Successfully");
      dispatch(fetchUOM());
    } else {
      alert("UOM Added Failed");
      console.error("Create failed:", createResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteUOM = (uomId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`${BASE_URL}/deleteUOMMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "string",
        id: uomId,
      }),
    });

    if (deleteResponse.ok) {
      alert("UOM deleted successfully");
      dispatch(fetchUOM());
    } else {
      alert("failed to delete UOM");
      console.error("Delete failed:", deleteResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
