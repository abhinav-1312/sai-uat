import React from "react";
import ItemSearch from "../pages/txnform/issuenote/ItemSearch";

const ItemDetailsContainer = ({
  children,
  itemSearch,
  itemArray,
  setFormData
}) => {
  return (
    <div className="item-details-container">
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <h3>Item Details</h3>
        {itemSearch && (
          <ItemSearch itemArray={itemArray} setFormData={setFormData} />
        )}
      </div>
      {children}
    </div>
  );
};

export default ItemDetailsContainer;
