// DepartmentPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import DepartmentTable from "./DepartmentTable";
import DepartmentForm from "./DepartmentForm";
import {
  // fetchDepartments,
  // updateDepartment,
  // saveDepartment,
  // deleteDepartment,
} from "../../store/actions/DepartmentActions";
import { deleteDepartment, fetchDepartments, saveDepartment, updateDepartment } from "../../redux/slice/departmentSlice";

const DepartmentPage = ({
  // departments,
  // fetchDepartments,
  // updateDepartment,
  // saveDepartment,
  // deleteDepartment,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchText, setSearchText] = useState("");

  const departments = useSelector(state => state.departments.data)
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(fetchDepartments())
  }, []);

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setVisible(true);
  };

  const handleDelete = (departmentId) => {
    dispatch(deleteDepartment(departmentId))
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingDepartment) {
        // Update logic using the Redux action
        await dispatch(updateDepartment({departmentId: editingDepartment.id, values})).unwrap();
      } else {
        // Create logic using the Redux action
        await dispatch(saveDepartment(values)).unwrap();
      }

      setVisible(false); // Close the modal
      setEditingDepartment(null); // Reset the editing department
    } catch (error) {
      console.error("Error:", error);
      message.error("Error while saving or updating department.")
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
        departments={departments?.filter((department) =>
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
