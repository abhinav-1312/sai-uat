// UOMPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import UOMTable from "./UOMTable";
import UOMForm from "./UOMForm";
import { deleteUom, fetchUoms, saveUom, updateUom } from "../../redux/slice/uomSlice";

const UOMPage = () => {
  const [visible, setVisible] = useState(false);
  const [editingUOM, setEditingUOM] = useState(null);
  const [searchText, setSearchText] = useState("");

  const userCd = useSelector(state => state.auth.userCd)
  const uoms = useSelector(state => state.uoms.data)
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(fetchUoms());
  }, []);

  const handleEdit = (uom) => {
    setEditingUOM(uom);
    setVisible(true);
  };

  const handleDelete = (uomId) => {
    // Implement delete logic here
    dispatch(deleteUom({uomId, userId: userCd}));
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingUOM) {
        // Implement update logic here
        await dispatch(updateUom({uomId: editingUOM.id, values})).unwrap();
      } else {
        // Implement create logic here
        await dispatch(saveUom(values)).unwrap();
      }
      setVisible(false);
      setEditingUOM(null);
    } catch (error) {
      console.error("Error: ", error);
      message.error("Error occured while saving or updaating UOM.")
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
          placeholder="Search UOMs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add UOM
        </Button>
      </div>
      <UOMTable
        uoms={uoms?.filter((uom) =>
          uom.uomName.toLowerCase().includes(searchText.toLowerCase())
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingUOM ? "Edit UOM" : "Add UOM"}
        visible={visible}
        onCancel={() => {
          setEditingUOM(null);
          setVisible(false);
        }}
        footer={null}
      >
        <UOMForm
          key={editingUOM ? `edit-${editingUOM.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingUOM}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  uoms: state.uoms.uoms,
});

const mapDispatchToProps = {
  fetchUoms,
  updateUom,
  saveUom,
  deleteUom,
};

export default connect(mapStateToProps, mapDispatchToProps)(UOMPage);
