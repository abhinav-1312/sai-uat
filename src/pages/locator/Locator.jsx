import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchLocators,
  updateLocator,
  saveLocator,
  deleteLocator,
} from "../../store/actions/LocatorActions";
import LocatorTable from "./LocatorTable";
import LocatorForm from "./LocatorForm";

const LocatorPage = ({
  locators,
  fetchLocators,
  updateLocator,
  saveLocator,
  deleteLocator,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingLocator, setEditingLocator] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchLocators();
  }, [fetchLocators]);

  const handleEdit = (locator) => {
    console.log(locator);
    setEditingLocator(locator);
    setVisible(true);
  };

  const handleDelete = (locatorId) => {
    deleteLocator(locatorId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingLocator) {
        await updateLocator(editingLocator.id, values);
      } else {
        await saveLocator(values);
      }

      setVisible(false);
      setEditingLocator(null);
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
        locators={locators.filter((locator) =>
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
