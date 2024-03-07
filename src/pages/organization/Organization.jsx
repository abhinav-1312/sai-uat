import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchOrganizations,
  updateOrganization,
  saveOrganization,
  deleteOrganization,
} from "../../store/actions/OrganizationActions";
import OrganizationTable from "./OrganizationTable";
import OrganizationForm from "./OrganizationForm";

const OrganizationPage = ({
  organizations,
  fetchOrganizations,
  updateOrganization,
  saveOrganization,
  deleteOrganization,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleEdit = (organization) => {
    console.log(organization);
    setEditingOrganization(organization);
    setVisible(true);
  };

  const handleDelete = (organizationId) => {
    deleteOrganization(organizationId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingOrganization) {
        await updateOrganization(editingOrganization.id, values);
      } else {
        await saveOrganization(values);
      }

      setVisible(false);
      setEditingOrganization(null);
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
    
        organizations={organizations.filter((organization) =>
          Object.values(organization).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          ))}
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
