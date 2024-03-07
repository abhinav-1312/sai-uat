// UserPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import {
  fetchUsers,
  updateUser,
  saveUser,
  deleteUser,
} from "../../store/actions/UsersActions";
import UserTable from "./UserTable";
import UserForm from "./UserForm";

const initialUsers = [
  {
    id: 1,
    organizationId: "O001",
    userId: "U001",
    userFirstName: "John",
    userLastName: "Doe",
    password: "password123",
    userType: "Admin",
    department: "IT",
    emailId: "john.doe@example.com",
    contactNo: "9876543210",
    userStatus: "Active",
    privileges: "Full Access",
  },
  // Add more dummy data as needed
];

const UserPage = ({ users, fetchUsers, updateUser, saveUser, deleteUser }) => {
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setVisible(true);
  };

  const handleDelete = (userId) => {
    // Implement delete logic here
    deleteUser(userId);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingUser) {
        // Implement update logic here
        await updateUser(editingUser.id, values);
      } else {
        // Implement create logic here
        await saveUser(values);
      }
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
          placeholder="Search users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add User
        </Button>
      </div>
      <UserTable
        users={users.filter((user) =>
          Object.values(user).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={visible}
        onCancel={() => {
          setEditingUser(null);
          setVisible(false);
        }}
        footer={null}
      >
        <UserForm
          key={editingUser ? `edit-${editingUser.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingUser}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users.users,
});

const mapDispatchToProps = {
  fetchUsers,
  updateUser,
  saveUser,
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
