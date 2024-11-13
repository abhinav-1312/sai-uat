import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import OrganizationTable from "./OrganizationTable";
import OrganizationForm from "./OrganizationForm";
import {
  deleteOrganization,
  fetchOrganizations,
  saveOrganization,
  updateOrganization,
} from "../../redux/slice/organizationSlice";

const OrganizationPage = () => {
  const [visible, setVisible] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const userCd = useSelector((state) => state.auth.userCd);

  const organizations = useSelector((state) => state.organizations.data);

  const handleEdit = (organization) => {
    setEditingOrganization(organization);
    setVisible(true);
  };

  const handleDelete = async (organizationId) => {
    await dispatch(
      deleteOrganization({ id: organizationId, userId: userCd })
    ).unwrap();
    dispatch(fetchOrganizations());
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingOrganization) {
        await dispatch(
          updateOrganization({ organizationId: editingOrganization.id, values })
        ).unwrap();
      } else {
        await dispatch(saveOrganization(values)).unwrap();
      }

      dispatch(fetchOrganizations());

      setVisible(false);
      setEditingOrganization(null);
    } catch (error) {
      console.error("Error:", error);
      message.error("Error occured while editing organization.");
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
          placeholder="Search organizations"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Organization
        </Button>
      </div>
      <OrganizationTable
        organizations={organizations?.filter((organization) =>
          Object.values(organization).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingOrganization ? "Edit Organization" : "Add Organization"}
        visible={visible}
        onCancel={() => {
          setEditingOrganization(null);
          setVisible(false);
        }}
        footer={null}
      >
        <OrganizationForm
          key={editingOrganization ? `edit-${editingOrganization.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingOrganization}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  organizations: state.organizations.organizations,
});

const mapDispatchToProps = {
  fetchOrganizations,
  updateOrganization,
  saveOrganization,
  deleteOrganization,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationPage);
