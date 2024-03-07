// UOMPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchUOM,
  updateUOM,
  saveUOM,
  deleteUOM,
} from "../../store/actions/UOMActions";
import UOMTable from "./UOMTable";
import UOMForm from "./UOMForm";

const initialUOMs = [
  {
    id: 1,
    uomCode: "EA",
    uomName: "EACH",
    uomDescription: "EACH",
    className: "QUANTITY",
    baseUomName: "EACH",
    endDate: null,
  },
];

const UOMPage = ({ uoms, fetchUOM, updateUOM, saveUOM, deleteUOM }) => {
  const [visible, setVisible] = useState(false);
  const [editingUOM, setEditingUOM] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUOM();
  }, [fetchUOM]);

  const handleEdit = (uom) => {
    setEditingUOM(uom);
    setVisible(true);
  };

  const handleDelete = (uomId) => {
    // Implement delete logic here
    deleteUOM(uomId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingUOM) {
        // Implement update logic here
        await updateUOM(editingUOM.id, values);
      } else {
        // Implement create logic here
        await saveUOM(values);
      }
      setVisible(false);
      setEditingUOM(null);
    } catch (error) {
      console.error("Error: ", error);
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
          placeholder="Search UOMs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add UOM
        </Button>
      </div>
      <UOMTable
        uoms={uoms.filter((uom) =>
          uom.uomName.toLowerCase().includes(searchText.toLowerCase())
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingUOM ? "Edit UOM" : "Add UOM"}
        visible={visible}
        onCancel={() => {
          setEditingUOM(null);
          setVisible(false);
        }}
        footer={null}
      >
        <UOMForm
          key={editingUOM ? `edit-${editingUOM.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingUOM}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  uoms: state.uoms.uoms,
});

const mapDispatchToProps = {
  fetchUOM,
  updateUOM,
  saveUOM,
  deleteUOM,
};

export default connect(mapStateToProps, mapDispatchToProps)(UOMPage);
