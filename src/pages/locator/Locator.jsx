import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  // fetchLocators,
  // updateLocator,
  // saveLocator,
  // deleteLocator,
} from "../../store/actions/LocatorActions";
import LocatorTable from "./LocatorTable";
import LocatorForm from "./LocatorForm";
import { deleteLocator, fetchLocators, saveLocator, updateLocator } from "../../redux/slice/locatorSlice";

const LocatorPage = ({
  // locators,
  // fetchLocators,
  // updateLocator,
  // saveLocator,
  // deleteLocator,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingLocator, setEditingLocator] = useState(null);
  const [searchText, setSearchText] = useState("");
  const userCd = useSelector(state => state.auth.userCd)
  const locators = useSelector(state => state.locators.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchLocators());
  }, []);

  const handleEdit = (locator) => {
    console.log(locator);
    setEditingLocator(locator);
    setVisible(true);
  };

  const handleDelete = (locatorId) => {
    dispatch(deleteLocator({locatorId, userId: userCd}));
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingLocator) {
        await dispatch(updateLocator({locatorId: editingLocator.id, values})).unwrap();
      } else {
        await dispatch(saveLocator(values)).unwrap();
      }
      dispatch(fetchLocators())
      setVisible(false);
      setEditingLocator(null);
    } catch (error) {
      console.error("Error:", error);
      message.error("Error occured while saving or updating locator.")
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
          placeholder="Search locators"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#ff8a00" }}
          onClick={() => setVisible(true)}
        >
          Add Locator
        </Button>
      </div>
      <LocatorTable
        locators={locators?.filter((locator) =>
          Object.values(locator).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}

        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingLocator ? "Edit Locator" : "Add Locator"}
        visible={visible}
        onCancel={() => {
          setEditingLocator(null);
          setVisible(false);
        }}
        footer={null}
      >
        <LocatorForm
          key={editingLocator ? `edit-${editingLocator.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingLocator}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  locators: state.locators.locators,
});

const mapDispatchToProps = {
  fetchLocators,
  updateLocator,
  saveLocator,
  deleteLocator,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocatorPage);
