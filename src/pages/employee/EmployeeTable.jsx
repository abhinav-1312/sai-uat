// EmployeeTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  const columns = [
    
    { title: 'ID', dataIndex: 'id', key: 'id', },
    { title: 'EMPLOYEE ID', dataIndex: 'employeeId', key: 'employeeCode', fixed: 'left', },
    { title: 'FIRST NAME', dataIndex: 'firstName', key: 'firstName', fixed: 'left', },
    { title: 'LAST NAME', dataIndex: 'lastName', key: 'lastName' },
    { title: 'CONTACT NO.', dataIndex: 'contactNo', key: 'contactNo' },
    { title: 'EMAIL', dataIndex: 'email', key: 'email' },
    { title: 'Sub-ORGANIZATION', dataIndex: 'organizationName', key: 'subOrganization' },
    { title: 'DEPARTMENT', dataIndex: 'departmentName', key: 'department' },
    { title: 'JOINING DATE', dataIndex: 'endDate', key: 'joiningDate' },
    { title: 'SALARY INFORMATION', dataIndex: 'salary', key: 'salaryInformation' },
    { title: 'STATUS', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="primary" className='saitheme-btn' onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => onDelete(record.id)}>
          Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={employees} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default EmployeeTable;
