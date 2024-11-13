import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";
import dayjs from "dayjs";
import {
  deleteEmployee,
  fetchEmployees,
  saveEmployee,
  updateEmployee,
} from "../../redux/slice/employeeSlice";

const EmployeePage = () => {
  const [visible, setVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");
  const employees = useSelector((state) => state.employees.data);
  const userCd = useSelector((state) => state.auth.userCd);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(fetchEmployees());
  }, []);

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
    dispatch(deleteEmployee({ employeeId, userId: userCd }));
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingEmployee) {
        await dispatch(
          updateEmployee({ employeeId: editingEmployee.id, values })
        ).unwrap();
      } else {
        await dispatch(saveEmployee(values)).unwrap();
      }

      setVisible(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error while editing or saving employee", error);
      message.error("Error while editing or saving employee.");
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
        employees={employees?.filter((employee) =>
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
