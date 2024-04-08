// LocationTable.js
import React from "react";
import { Table, Space, Button } from "antd";

const convertEpochToDateString = (epochTime) => {
  // Convert epoch time to milliseconds
  let date = new Date(epochTime);

  // Extract the day, month, and year from the Date object
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month starts from 0
  let year = date.getFullYear();

  // Add leading zeros if needed
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  // Return the date string in DD/MM/YYYY format
  return `${day}/${month}/${year}`;
}

const LocationTable = ({ locations, onEdit, onDelete }) => {
  const columns = [
    { title: "LOCATION ID", dataIndex: "id", key: "id", fixed: "left" },
    {
      title: "LOCATION NAME",
      dataIndex: "locationName",
      key: "locationName",
      fixed: "left",
    },
    { title: "ADDRESS", dataIndex: "locationAddr", key: "locationAddr" },
    { title: "CITY", dataIndex: "city", key: "city" },
    { title: "ZIP CODE", dataIndex: "zipcode", key: "pincode" },
    { title: "STATE", dataIndex: "state", key: "state" },
    { title: "PAN NO.", dataIndex: "pan", key: "pan" },
    { title: "EMAIL ID", dataIndex: "email", key: "email" },
    { title: "CONTACT NO.", dataIndex: "contactNo", key: "contactNo" },
    { title: "Location Type", dataIndex: "locationType", key: "locationType" },
    { title: "GSTIN NO.", dataIndex: "gstin", key: "gstin" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    { title: "CREATE DATE", dataIndex: "endDate", key: "endDate", render: (endDate) => convertEpochToDateString(endDate) },
    { title: "LATITUDE", dataIndex: "latitude", key: "latitude" },
    { title: "LONGITUDE", dataIndex: "longitude", key: "longitude" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            className="saitheme-btn"
            onClick={() => onEdit(record.id)}
          >
            Edit
          </Button>

          <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={locations}
      columns={columns}
      scroll={{ x: "max-content" }}
    />
  );
};

export default LocationTable;
