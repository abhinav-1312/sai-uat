// DepartmentPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import DepartmentTable from "./DepartmentTable";
import DepartmentForm from "./DepartmentForm";
import {
  fetchDepartments,
  updateDepartment,
  saveDepartment,
  deleteDepartment,
} from "../../store/actions/DepartmentActions";

const DepartmentPage = ({
  departments,
  fetchDepartments,
  updateDepartment,
  saveDepartment,
  deleteDepartment,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch data from Redux store on component mount
    fetchDepartments();
  }, [fetchDepartments]);

  const handleEdit = (department) => {
    console.log(department);
    setEditingDepartment(department);
    setVisible(true);
  };

  const handleDelete = (departmentId) => {
    // Implement delete logic using the Redux action
    deleteDepartment(departmentId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingDepartment) {
        // Update logic using the Redux action
        await updateDepartment(editingDepartment.id, values);
      } else {
        // Create logic using the Redux action
        await saveDepartment(values);
      }

      setVisible(false); // Close the modal
      setEditingDepartment(null); // Reset the editing department
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
          placeholder="Search departments"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Department
        </Button>
      </div>
      <DepartmentTable
        departments={departments.filter((department) =>
          Object.values(department).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingDepartment ? "Edit Department" : "Add Department"}
        visible={visible}
        onCancel={() => {
          setEditingDepartment(null);
          setVisible(false);
        }}
        footer={null}
      >
        <DepartmentForm
          key={editingDepartment ? `edit-${editingDepartment.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingDepartment}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  departments: state.departments.departments,
});

const mapDispatchToProps = {
  fetchDepartments,
  updateDepartment,
  saveDepartment,
  deleteDepartment,
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentPage);
