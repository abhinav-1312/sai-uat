import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  // fetchVendors,
  // updateVendor,
  // saveVendor,
  // deleteVendor,
} from "../../store/actions/VendorActions";
import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";
import { deleteVendor, fetchVendors, saveVendor, updateVendor } from "../../redux/slice/vendorSlice";

const VendorPage = ({
  // vendors,
  // fetchVendors,
  // updateVendor,
  // saveVendor,
  // deleteVendor,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchText, setSearchText] = useState("");

  const userCd = useSelector(state => state.auth.userCd)
  const vendors = useSelector(state => state.vendors.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchVendors());
  }, []);

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setVisible(true);
  };

  const handleDelete = (vendorId) => {
    dispatch(deleteVendor({vendorId, userId: userCd}));
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingVendor) {
        await dispatch(updateVendor({vendorId: editingVendor.id, values})).unwrap();
      } else {
        await dispatch(saveVendor(values)).unwrap();
      }
      setVisible(false);
      setEditingVendor(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error occured while saving or updating vendor.")
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
        vendors={vendors?.filter((vendor) =>
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
