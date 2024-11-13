// UserPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { deleteUser, fetchUsers, saveUser, updateUser } from "../../redux/slice/userSlice";

const UserPage = (
) => {
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const users = useSelector(state => state.users.data)
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(fetchUsers());
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setVisible(true);
  };

  const handleDelete = (userId) => {
    // Implement delete logic here
    dispatch(deleteUser(userId));
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingUser) {
        // Implement update logic here
        await dispatch(updateUser({userId: editingUser.id, values})).unwrap();
      } else {
        // Implement create logic here
        await dispatch(saveUser(values)).unwrap();
      }
    } catch (error) {
      console.error("Error: ", error);
      message.error("Error occured while adding or updating user.")
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
        users={users?.filter((user) =>
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
