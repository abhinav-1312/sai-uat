// LocationPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchLocations,
  updateLocation,
  saveLocation,
  deleteLocation,
} from "../../store/actions/LocationAction";
import LocationTable from "./LocationTable";
import LocationForm from "./LocationForm";
import dayjs from "dayjs";

const apiRequest = async (url, method, requestData) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "POST") {
    options["body"] = JSON.stringify(requestData);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.responseData;
  } catch (error) {
    console.error("Error: ", error);
  }
};

const LocationPage = ({
  locations,
  fetchLocations,
  updateLocation,
  saveLocation,
  deleteLocation,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch data from Redux store on component mount
    fetchLocations();
  }, [fetchLocations]);
  console.log(editingLocation);

  const getLocation = async (id) => {
    const itemResponse = await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocationMasterById",
      "POST",
      {
        locationId: id,
        userId: "12345",
      }
    );
    return itemResponse;
  };

  const handleEdit = async (location) => {
    const locationObject = await getLocation(location);
    const dateObject = new Date(locationObject.endDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth(); // Months are zero-based, so add 1
    const date = dateObject.getDate();
    const tempItem = {
      ...locationObject,
      endDate: dayjs(new Date(year, month, date)),
    };
    setEditingLocation(tempItem);
    setVisible(true);
  };

  const handleDelete = (locationId) => {
    // Implement delete logic using the Redux action
    deleteLocation(locationId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingLocation) {
        // Update logic using the Redux action
        await updateLocation(editingLocation.id, values);
      } else {
        // Create logic using the Redux action
        await saveLocation(values);
      }

      setVisible(false); // Close the modal
      setEditingLocation(null); // Reset the editing location
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search locations"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Location
        </Button>
      </div>
      <LocationTable
        locations={locations.filter((location) =>
          Object.values(location).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}

        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingLocation ? "Edit Location" : "Add Location"}
        visible={visible}
        onCancel={() => {
          setEditingLocation(null);
          setVisible(false);
        }}
        footer={null}
      >
        <LocationForm
          key={editingLocation ? `edit-${editingLocation.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingLocation}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  locations: state.locations.locations,
});

const mapDispatchToProps = {
  fetchLocations,
  updateLocation,
  saveLocation,
  deleteLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationPage);
