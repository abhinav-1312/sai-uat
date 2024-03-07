import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchVendors,
  updateVendor,
  saveVendor,
  deleteVendor,
} from "../../store/actions/VendorActions";
import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";

const VendorPage = ({
  vendors,
  fetchVendors,
  updateVendor,
  saveVendor,
  deleteVendor,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setVisible(true);
  };

  const handleDelete = (vendorId) => {
    deleteVendor(vendorId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingVendor) {
        await updateVendor(editingVendor.id, values);
      } else {
        await saveVendor(values);
      }
      setVisible(false);
      setEditingVendor(null);
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
          placeholder="Search vendors"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Vendor
        </Button>
      </div>
      <VendorTable
        vendors={vendors.filter((vendor) =>
          Object.values(vendor).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
        visible={visible}
        onCancel={() => {
          setEditingVendor(null);
          setVisible(false);
        }}
        footer={null}
      >
        <VendorForm
          key={editingVendor ? `edit-${editingVendor.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingVendor}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  vendors: state.vendors.vendors,
});

const mapDispatchToProps = {
  fetchVendors,
  updateVendor,
  saveVendor,
  deleteVendor,
};

export default connect(mapStateToProps, mapDispatchToProps)(VendorPage);
