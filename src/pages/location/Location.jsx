// LocationPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  // fetchLocations,
  // updateLocation,
  // saveLocation,
  // deleteLocation,
} from "../../store/actions/LocationAction";
import LocationTable from "./LocationTable";
import LocationForm from "./LocationForm";
import dayjs from "dayjs";
import { deleteLocation, fetchLocations, saveLocation, updateLocation } from "../../redux/slice/locationSlice";
import { apiCall } from "../../utils/Functions";

const LocationPage = ({
  // locations,
  // fetchLocations,
  // updateLocation,
  // saveLocation,
  // deleteLocation,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const locations = useSelector(state => state.locations.data)
  const {userCd, token} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const getLocation = async (id) => {
    // const itemResponse = await apiRequest(
    //   "/master/getLocationMasterById",
    //   "POST",
    //   {
    //     locationId: id,
    //     userId: userCd,
    //   }
    // );
    try{
      const itemResponse = await apiCall("POST", "/master/getLocationMasterById", token, {locationId: id, userId: userCd})
      return itemResponse.responseData;
    }catch(error){
      console.log("Error fetching location by id.", error)
      alert("Error fetching location by id.")
    }
  }

  const handleEdit = async (location) => {
    const locationObject = await getLocation(location);
    const dateObject = new Date(locationObject?.endDate);
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

  const handleDelete = async (locationId) => {
    // Implement delete logic using the Redux action
    try{
      dispatch(deleteLocation({locationId, userId: userCd})).umwrap();
      dispatch(fetchLocations())
    }catch(error){
      console.log("Errpr deleting location.", error)
    }

  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingLocation) {
        // Update logic using the Redux action
        await dispatch(updateLocation({locationId: editingLocation.id, values})).unwrap();
      } else {
        // Create logic using the Redux action
        await dispatch(saveLocation(values)).unwrap();
      }
      dispatch(fetchLocations())
      setVisible(false); // Close the modal
      setEditingLocation(null); // Reset the editing location
    } catch (error) {
      console.error("Error:", error);
      alert("Error occured while adding or saving location.")
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
        locations={locations?.filter((location) =>
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
          console.log("Clicked")
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
