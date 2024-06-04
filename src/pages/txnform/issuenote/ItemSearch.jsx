import { Button, Popover, Table, Input } from 'antd';
import React, { useState } from 'react'
import { handleSearch } from '../../../utils/Functions';

const { Search } = Input;

const ItemSearch = ({itemArray, updateFormData}) => {
    const [selectedItems, setSelectedItems] = useState([]); // State to hold selected item data
    const [filteredData, setFilteredData] = useState(null)
    const [tableOpen, setTableOpen] = useState(false)
    const [searchText, setSearchText] = useState("")

    const handleSelectItem = (record, subRecord) => {
        setTableOpen(false);
    
        const recordCopy = record; // delete qtyList array from record
    
        // Check if the item is already selected
        const index = selectedItems.findIndex(
          (item) => item.id === record.id && item.locatorId === subRecord.locatorId
        );
        if (index === -1) {
          setSelectedItems((prevItems) => [
            ...prevItems,
            { ...recordCopy, locatorId: subRecord.locatorId },
          ]); // Update selected items state
        //   setFormData((prevValues) => {
            const newItem = {
            //   srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
              itemCode: record.itemMasterCd,
              itemId: record.id,
              itemDesc: record.itemMasterDesc,
              uom: record.uomId,
              uomDesc: record.uomDtls.baseUom,
              quantity: 1,
              noOfDays: 1,
              conditionOfGoods: "",
              budgetHeadProcurement: "",
              locatorId: subRecord.locatorId,
              locatorDesc: subRecord.locatorDesc,
              remarks: "",
              // qtyList: record.qtyList
            };

            
        //     const updatedItems = [...(prevValues.items || []), newItem];
        //     return { ...prevValues, items: updatedItems };
        // });
        updateFormData(newItem)
        } else {
          // If item is already selected, deselect it
          const updatedItems = [...selectedItems];
          updatedItems.splice(index, 1);
          setSelectedItems(updatedItems);
        }
      };

    const renderLocatorISN = (obj, rowRecord) => {
        return (
          <Table
            dataSource={obj}
            pagination={false}
            columns={[
              {
                title: "LOCATOR DESCRIPTION",
                dataIndex: "locatorDesc",
                key: "locatorDesc",
              },
              {
                title: "QUANTITY",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                title: "ACTION",
                fixed: "right",
                render: (_, record) => (
                  <Button
                    onClick={() => handleSelectItem(rowRecord, record)}
                    type={
                      selectedItems?.some(
                        (item) =>
                          item.locatorId === record.locatorId &&
                          item.id === rowRecord.id
                      )
                        ? "default"
                        : "primary"
                    }
                  >
                    {selectedItems?.some(
                      (item) =>
                        item.locatorId === record.locatorId &&
                        item.id === rowRecord.id
                    )
                      ? "Deselect"
                      : "Select"}
                  </Button>
                ),
              },
            ]}
          />
        );
      };

      console.log("Filtered data: ", filteredData)

    const tableColumns = [
        { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
        {
          title: "ITEM DESCRIPTION",
          dataIndex: "itemMasterDesc",
          key: "itemMasterDesc",
          fixed: "left",
        },
        {
          title: "ITEM CODE",
          dataIndex: "itemMasterCd",
          key: "itemCode",
        },
        {
          title: "UOM DESCRIPTION",
          dataIndex: "uomDtls",
          key: "uomDtls",
          render: (uomDtls) => uomDtls?.baseUom,
        },
        {
          title: "LOCATION",
          dataIndex: "locationDesc",
          key: "location",
        },
    
        { title: "PRICE", dataIndex: "price", key: "price" },
    
        {
          title: "CATEGORY",
          dataIndex: "categoryDesc",
          key: "category",
        },
        {
          title: "SUB-CATEGORY",
          dataIndex: "subCategoryDesc",
          key: "subCategory",
        },
        {
          title: "Type",
          dataIndex: "typeDesc",
          key: "type",
        },
        {
          title: "Disciplines",
          dataIndex: "disciplinesDesc",
          key: "disciplines",
        },
        {
          title: "Brand",
          dataIndex: "brandDesc",
          key: "brand",
        },
        {
          title: "Size",
          dataIndex: "sizeDesc",
          key: "size",
        },
        {
          title: "Colour",
          dataIndex: "colorDesc",
          key: "colour",
        },
        {
          title: "Usage Category",
          dataIndex: "usageCategoryDesc",
          key: "usageCategory",
        },
        {
          title: "MINIMUM STOCK LEVEL",
          dataIndex: "minStockLevel",
          key: "minStockLevel",
        },
        {
          title: "MAXIMUM STOCK LEVEL",
          dataIndex: "maxStockLevel",
          key: "maxStockLevel",
        },
        { title: "RE ORDER POINT", dataIndex: "reOrderPoint", key: "reOrderPoint" },
        { title: "STATUS", dataIndex: "status", key: "status" },
        { title: "CREATE DATE", dataIndex: "endDate", key: "endDate" },
        {
          title: "LOCATOR QUANTITY DETAILS",
          dataIndex: "qtyList",
          key: "qtyList",
          render: (locatorQuantity, rowRecord) =>
            renderLocatorISN(locatorQuantity, rowRecord),
        },
      ];

      const content = (
        // <Table dataSource={filteredData} columns={tableColumns} />
        <Table pagination={{ pageSize: 3 }}
                        dataSource={filteredData}
                        columns={tableColumns}
                        scroll={{ x: "max-content" }}
                        style={{
                          width: "600px",
                          display: tableOpen ? "block" : "none",
                        }} />
      )

  return (
    <div>
      <Popover
        content={content}
        title="Search Results"
        trigger="click"
        open={tableOpen}
        onOpenChange={(v) => setTableOpen(v)}
        style={{ width: "200px" }}
              placement="right"
      >
        <Search
          placeholder="input search text"
        //   onSearch={handleSearch}
        //   onChange={(e) => handleSearch(e.target.value)}
          onChange={(e) =>
                            handleSearch(
                              e.target?.value || "",
                              itemArray,
                              setFilteredData,
                              setSearchText
                            )
                          }
          value={searchText}
          style={{ width: 200 }}
        />
      </Popover>
    </div>
  )
}

export default ItemSearch
