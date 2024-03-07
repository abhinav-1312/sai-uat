import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchEmployees,
  updateEmployee,
  saveEmployee,
  deleteEmployee,
} from "../../store/actions/EmployeeActions";
import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";
import dayjs from "dayjs";

const EmployeePage = ({
  employees,
  fetchEmployees,
  updateEmployee,
  saveEmployee,
  deleteEmployee,
}) => {
  const [visible, setVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = (employee) => {
    const dateObject = new Date(employee.endDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const date = dateObject.getDate();
    const tempItem = {
      ...employee,
      endDate: dayjs(new Date(year, month, date)),
    };
    setEditingEmployee(tempItem);
    setVisible(true);
  };

  const handleDelete = (employeeId) => {
    deleteEmployee(employeeId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, values);
      } else {
        await saveEmployee(values);
      }

      setVisible(false);
      setEditingEmployee(null);
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
          placeholder="Search employees"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Employee
        </Button>
      </div>
      <EmployeeTable
        employees={employees.filter((employee) =>
          Object.values(employee).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        visible={visible}
        onCancel={() => {
          setEditingEmployee(null);
          setVisible(false);
        }}
        footer={null}
      >
        <EmployeeForm
          key={editingEmployee ? `edit-${editingEmployee.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingEmployee}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  employees: state.employees.employees,
});

const mapDispatchToProps = {
  fetchEmployees,
  updateEmployee,
  saveEmployee,
  deleteEmployee,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeePage);
