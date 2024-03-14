// IssueNote.js
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  AutoComplete,
  message,
  Modal,
  Popover,
  Table,
  List,
} from "antd";
import { itemNames, types, allDisciplines, subCategories, categories, sizes, usageCategories, brands, colors } from "../../items/KeyValueMapping";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import ItemSearchFilter from "../../../components/ItemSearchFilter";
import moment from "moment";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

const IssueNote = () => {
  const [Type, setType] = useState("IRP");
  const [form] = Form.useForm(); // Create form instance
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemData, setItemData] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // State to hold selected item data
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tableOpen, setTableOpen] = useState(true);
  const [uomMaster, setUomMaster] = useState([])
  const [locatorMaster, setLocatorMaster] = useState([])
  const [locationMaster, setLocationMaster] = useState([])
  const [vendorMaster, setVendorMaster] = useState([])

  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    demandNoteNo: "",
    issueNoteNo: "",
    issueNoteDt: "",
    type: "IRP",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    contactNo: "",
    termsCondition: "",
    note: "",
    demandNoteDt: "",
    items: [
      // {
      //   srNo: 0,
      //   itemCode: "",
      //   itemDesc: "",
      //   uom: "",
      //   quantity: 0,
      //   noOfDays: 0,
      //   remarks: "",
      //   conditionOfGoods: "",
      //   budgetHeadProcurement: "",
      //   locatorId: ""
      // }
    ],
    userId: "string",
    processType: "IRP",
    interRdDemandNote: "",
  });
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleChange = (fieldName, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const itemHandleChange = (fieldName, value, index) => {
    setFormData((prevValues) => {
      const updatedItems = [...(prevValues.items) || []];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value === "" ? null : value,
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };

  const populateItemData = async() => {
    const itemMasterUrl = "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster"
    const locatorMasterUrl = "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster"
    const uomMasterUrl = "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster"
    const vendorMasteUrl = "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getVendorMaster"
    const locationMasterUrl = "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocationMaster"
    try{
      const [itemMaster, locatorMaster, uomMaster, vendorMaster, locationMaster] = await Promise.all([
        axios.get(itemMasterUrl),
        axios.get(locatorMasterUrl),
        axios.get(uomMasterUrl),
        axios.get(vendorMasteUrl),
        axios.get(locationMasterUrl)
      ])
      
      const {responseData : itemMasterData} = itemMaster.data
      const {responseData : locatorMasterData} = locatorMaster.data
      const {responseData : uomMasterData} = uomMaster.data
      const {responseData : vendorMasterData} = vendorMaster.data
      const {responseData : locationMasterData} = locationMaster.data


      setData([...itemMasterData])
      setUomMaster([...uomMasterData])
      setLocatorMaster([...locatorMasterData])
      setVendorMaster([...vendorMasterData])
      setLocationMaster([...locationMasterData])

    }catch(error){
      console.log("Populate item data error: ", error)
    }
  }

  useEffect(() => {
    // Fetch data from the API
    populateItemData()
  }, []);

  const handleOnSearch = (value) => {
    setSearchValue(value);
    // Filter data based on any field
    const filtered = data.filter((item) => {
      // Check if any field includes the search value
      return Object.values(item).some((field) => {
        if (typeof field === "string") {
          return field.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };
  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    // Filter data based on any field
    const filtered = data.filter((item) => {
      // Check if any field includes the search value
      return Object.values(item).some((field) => {
        if (typeof field === "string") {
          return field.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };

  const handleSelectItem = (record) => {
    console.log("Record: ", record)
    setTableOpen(false);
    // Check if the item is already selected
    const index = selectedItems.findIndex((item) => item.id === record.id);
    if (index === -1) {
      setSelectedItems((prevItems) => [...prevItems, record]); // Update selected items state
      // add data to formData hook
      setFormData((prevData) => {
        const newItem = {
          srNo: prevData.items ? prevData.items.length + 1 : 1,
          id: record.id,
          itemCode: record.itemMasterCd,
          itemDesc: record.itemMasterDesc,
          uom: record.uomId,
          quantity: 1,
          noOfDays: 1,
          remarks: "",
          conditionOfGoods: "",
          budgetHeadProcurement: "",
          locatorId: record.locatorId,
          locatorDesc: record.locatorDesc,
          itemName: record.itemName
        };
        const updatedItems = [...(prevData.items || []), newItem];
        return {
          ...prevData,
          items: updatedItems,
        };
      });
    } else {
      // If item is already selected, deselect it
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const findColumnValue = (id, dataSource, sourceName) => {
    const foundObject = dataSource.find(obj => obj.id === id);

    if(sourceName === "locationMaster")
      return foundObject ? foundObject['locationName'] : 'Undefined';
    if(sourceName === "locatorMaster")
      return foundObject ? foundObject['locatorDesc'] : 'Undefined';
    if(sourceName === "vendorMaster")
      return foundObject ? foundObject['vendorName'] : 'Undefined';
    if(sourceName === 'uomMaster')
      return foundObject ? foundObject['uomName'] : 'Undefined';
  }

  const columns = [
    { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
    {
      title: "ITEM CODE",
      dataIndex: "itemMasterCd",
      key: "itemCode",
    },
    {
      title: "ITEM DESCRIPTION",
      dataIndex: "itemName",
      key: "itemMasterDesc",
      render: (itemName) => itemNames[itemName]
    },
    { 
      title: "UOM", 
      dataIndex: "uomId", 
      key: "uom", 
      render: (uomId) => findColumnValue(uomId, uomMaster, "uomMaster")
    },
    {
      title: "QUANTITY ON HAND",
      dataIndex: "quantity",
      key: "quantity",
    },
    { 
      title: "LOCATION",
      dataIndex: "locationId",
      key: "location",
      render: (locationId) => findColumnValue(locationId, locationMaster, "locationMaster")
    },
    {
      title: "LOCATOR CODE",
      dataIndex: "locatorId",
      key: "locatorCode",
    },
    {
      title: "LOCATOR DESCRIPTION", 
      dataIndex: "locatorId", 
      key: "locatorId",
      render: (locatorId) => findColumnValue(locatorId, locatorMaster, "locatorMaster")
    },
    { title: "PRICE", dataIndex: "price", key: "price" },
    { 
      title: "VENDOR DETAIL", 
      dataIndex: "vendorId", 
      key: "vendorDetail",
      render: (vendorId) => findColumnValue(vendorId, vendorMaster, "vendorMaster")

    },
    { 
      title: "CATEGORY", 
      dataIndex: "category", 
      key: "category",
      render: (category) => categories[category]

    },
    { 
      title: "SUB-CATEGORY", 
      dataIndex: "subCategory", 
      key: "subCategory",
      render: (subCategory) => subCategories[subCategory]
    },
    { 
      title: "Type", 
      dataIndex: "type", 
      key: "type", 
      render: (type) => types[type]
    },
    { 
      title: "Disciplines", 
      dataIndex: "disciplines", 
      key: "disciplines",
      render: (disciplines) => allDisciplines[disciplines]
    },
    { 
      title: "Brand", 
      dataIndex: "brandId", 
      key: "brand",
      render: (brandId) => brands[brandId]
    },
    { 
      title: "Size", 
      dataIndex: "size", 
      key: "size",
      render: (size) => sizes[size]
    },
    { 
      title: "Colour", 
      dataIndex: "colorId", 
      key: "colour",
      render: (colorId) => colors[colorId]
    },
    {
      title: "Usage Category",
      dataIndex: "usageCategory",
      key: "usageCategory",
      render: (usageCategory) => usageCategories[usageCategory]
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
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (text, record) => (
        <Button
          type={
            selectedItems.some((item) => item.id === record.id)
              ? "warning"
              : "primary"
          }
          onClick={() => handleSelectItem(record)}
        >
          {selectedItems.some((item) => item.id === record.id)
            ? "Deselect"
            : "Select"}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchItemData();
    fetchUserDetails();
  }, []);

  const fetchItemData = async () => {
    try {
      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
      const response = await axios.get(apiUrl);
      const { responseData } = response.data;
      setItemData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/login/authenticate";
      const response = await axios.post(apiUrl, {
        userCd: "dkg",
        password: "string",
      });

      const { responseData } = response.data;
      const { organizationDetails } = responseData;
      const { userDetails } = responseData;
      // Get current date
      const currentDate = dayjs();
      // Update form data with fetched values
      setFormData({
        crRegionalCenterCd: organizationDetails.id,
        crRegionalCenterName: organizationDetails.location,
        crAddress: organizationDetails.locationAddr,
        crZipcode: "131021",
        genName: userDetails.firstName,
        userId: "string",
        type: "",
        issueNoteNo: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        issueNoteDt: currentDate.format(dateFormat),
        demandNoteDt: currentDate.format(dateFormat),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onFinish = async () => {
    try {
      const formDataCopy = { ...formData };
      
      // Ensure all fields are present
      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        "issueName",
        "approvedDate",
        "approvedName",
        "demandNoteNo",
        "issueNoteNo",
        "issueNoteDt",
        "type",
        "ceRegionalCenterCd",
        "ceRegionalCenterName",
        "ceAddress",
        "ceZipcode",
        "crRegionalCenterCd",
        "crRegionalCenterName",
        "crAddress",
        "crZipcode",
        "consumerName",
        "contactNo",
        "termsCondition",
        "note",
        "demandNoteDt",
        "userId",
        "processType",
        "interRdDemandNote",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/saveIssueNote";
      const response = await axios.post(apiUrl, formDataCopy);
      if (
        response.status === 200 &&
        response.data &&
        response.data.responseStatus &&
        response.data.responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } =
          response.data.responseData;
        setFormData(prevValues=>{
          return {
            ...prevValues,
            issueNoteNo: processId,
          }
        });
        setSuccessMessage(
          `Issue note saved successfully! Issue Note No : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Issue note saved successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setFormSubmitted(true);
        // fetchUserDetails()
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to save issue note. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving issue note:", error);
      message.error("Failed to submit issue note. ");
    }
  };

  console.log("FormData: ", formData)

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const removeItem = (index) => {
    setFormData(prevValues=>{
      const updatedItems = prevValues.items
      updatedItems.splice(index, 1)
      
      const updatedItems1 = updatedItems.map((item, key)=>{
        return {...item, srNo: key}
      })

      return {
        ...prevValues,
        items: updatedItems1
      }
    })
  }

  const findUomName = (uomId) => {
    const foundObj = uomMaster.find(obj => uomId === obj.id)
    return foundObj ? foundObj.uomName : "Undefined"
  }

  return (
    <div className="goods-receive-note-form-container">
      <h1>Sports Authority of India - Issue Note</h1>

      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
      >
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="issueNoteDt">
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "100%" }}
                name="issueNoteDt"
                onChange={(date, dateString) =>
                  handleChange("issueNoteDt", dateString)
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("processType", value)}>
                <Option value="IRP">1. RETURNABLE</Option>
                <Option value="NIRP">2. NON RETURNABLE</Option>
                <Option value="IOP">3. INTER - ORG. TRANSFER</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={6} offset={12}>
            <Form.Item label="ISSUE NOTE NO." name="issueNoteNo">
              <Input
                value={formData.issueNoteNo}
                onChange={(e) => handleChange("issueNoteNo", e.target.value)}
                disabled
              />
              <div style={{ display: "none" }}>{formData.issueNoteNo}</div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong underline level={2} type="danger">
              CONSIGNOR DETAIL :-
            </Title>
            <Form.Item label="REGIONAL CENTER CODE" name="crRegionalCenterCd">
              <Input
                value={formData.crRegionalCenterCd}
                name="crRegionalCenterCd"
              />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item
              label="REGIONAL CENTER NAME "
              name="crRegionalCenterName"
            >
              <Input
                value={formData.crRegionalCenterName}
                name="crRegionalCenterName"
              />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="crAddress">
              <Input value={formData.crAddress} name="crAddress" />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="crZipcode">
              <Input value={formData.crZipcode} name="crZipcode" />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
              {" "}
              CONSIGNEE DETAIL :-
            </Title>

            {(Type === "IRP" || Type === "NIRP") && (
              <>
                <Form.Item label="CONSUMER NAME :" name="consumerName">
                  <Input
                    onChange={(e) =>
                      handleChange("consumerName", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="CONTACT NO. :" name="contactNo">
                  <Input
                    onChange={(e) => handleChange("contactNo", e.target.value)}
                  />
                </Form.Item>
              </>
            )}

            {Type === "IOP" && (
              <>
                <Form.Item
                  label="REGIONAL CENTER CODE :"
                  name="ceRegionalCenterCd"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("ceRegionalCenterCd", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="REGIONAL CENTER NAME  :"
                  name="ceRegionalCenterName"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("ceRegionalCenterName", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="ADDRESS :" name="ceAddress">
                  <Input
                    onChange={(e) => handleChange("ceAddress", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="ZIP CODE :" name="ceZipcode">
                  <Input
                    onChange={(e) => handleChange("ceZipcode", e.target.value)}
                  />
                </Form.Item>
              </>
            )}
          </Col>
          <Col span={8}>
            {(Type === "IRP" || Type === "NIRP") && (
              <>
                <Form.Item></Form.Item>
                <Form.Item label="DEMAND NOTE NO." name="demandNoteNo">
                  <Input
                    onChange={(e) =>
                      handleChange("demandNoteNo", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="DEMAND NOTE DATE :" name="demandNoteDt">
                  <DatePicker
                    format={dateFormat}
                    style={{ width: "100%" }}
                    onChange={(date, dateString) =>
                      handleChange("demandNoteDt", dateString)
                    }
                  />
                </Form.Item>
              </>
            )}

            {/* hello */}

            {Type === "IOP" && (
              <>
                <Form.Item></Form.Item>
                <Form.Item
                  label="INTER RD DEMAND NOTE :"
                  name="interRdDemandNote"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("interRdDemandNote", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="INTER RD DEMAND NOTE DATE :"
                  name="demandNoteDt"
                >
                  <DatePicker
                    format={dateFormat}
                    style={{ width: "100%" }}
                    onChange={(date, dateString) =>
                      handleChange("demandNoteDt", dateString)
                    }
                  />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ADD ITEMS</h2>
        <div style={{ width: "300px" }}>
          <Popover
            onClick={() => setTableOpen(true)}
            content={
              <Table
                dataSource={filteredData}
                columns={columns}
                pagination={true}
                scroll={{ x: "max-content" }}
                style={{
                  width: "800px",
                  display: tableOpen ? "block" : "none",
                }}
              />
            }
            title="Filtered Item Data"
            trigger="click"
            visible={searchValue !== "" && filteredData.length > 0}
            style={{ width: "200px" }}
            placement="right"
          >
            <Input.Search
              placeholder="Search Item Data"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={handleOnSearch}
              onChange={handleOnChange}
            />
          </Popover>
        </div>

        <Form.List name="items" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData.items?.length > 0 &&
                formData.items.map((item, key) => {
                  return (
                    // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

                    <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px' }}>
                      
                        <Form.Item label="Serial No.">
                          <Input value={item.srNo} readOnly />
                        </Form.Item>
                      
                        <Form.Item label="ITEM CODE">
                          <Input value={item.itemCode} readOnly />
                        </Form.Item>
                        
                        <Form.Item label="ITEM DESCRIPTION">
                          <Input value={itemNames[item.itemName]} readOnly />
                        </Form.Item>

                        <Form.Item label="UOM">
                          <Input value={findUomName(item.uom)} />
                        </Form.Item>

                        <Form.Item label="LOCATOR DESCRIPITON">
                          <Input value={findColumnValue(item.locatorId, locatorMaster, "locatorMaster")} readOnly />
                        </Form.Item>

                        <Form.Item label="REQUIRED QUANTITY">
                          <Input value={item.quantity} onChange={(e)=>itemHandleChange("quantity", e.target.value, key)} />
                        </Form.Item>

                        <Form.Item label="REQUIRED FOR NO. OF DAYS">
                          <Input value={item.noOfDays} onChange={(e)=>itemHandleChange("noOfDays", e.target.value, key)} />
                        </Form.Item>

                        <Form.Item label="REMARK">
                          <Input value={item.remarks} onChange={(e)=>itemHandleChange("remarks", e.target.value, key)} />
                        </Form.Item>

                        <Col span={1}>
                          <MinusCircleOutlined onClick={() => removeItem(key)} style={{ marginTop: 8 }} />
                        </Col>
                    </div>
                  );
                })}
            </>
          )}
        </Form.List>

        {/* Condition of Goods */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="TERMS AND CONDITION" name="termsCondition">
              <Input.TextArea
                onChange={(e) => handleChange("termsCondition", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NOTE" name="note">
              <Input.TextArea
                onChange={(e) => handleChange("note", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="goods-receive-note-signature">GENERATED BY</div>
            <div className="goods-receive-note-signature">
              NAME & DESIGNATION :
              <Form>
                <Input
                  value={formData.genName}
                  name="genName"
                  onChange={(e) => handleChange("genName", e.target.value)}
                />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
                name="genDate"
                onChange={(date, dateString) =>
                  handleChange("genDate", dateString)
                }
              />
            </div>
          </div>
          <div>
            <div className="goods-receive-note-signature">APPROVED BY</div>
            <div className="goods-receive-note-signature">
              NAME & DESIGNATION :
              <Form>
                <Input
                  name="approvedName"
                  onChange={(e) => handleChange("approvedName", e.target.value)}
                />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
                name="approvedDate"
                onChange={(date, dateString) =>
                  handleChange("approvedDate", dateString)
                }
              />
            </div>
          </div>
          <div>
            <div className="goods-receive-note-signature">RECEIVED BY</div>
            <div className="goods-receive-note-signature">
              NAME & SIGNATURE :
              <Form>
                <Input
                  name="issueName"
                  onChange={(e) => handleChange("issueName", e.target.value)}
                />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
                name="issueDate"
                onChange={(date, dateString) =>
                  handleChange("issueDate", dateString)
                }
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="goods-receive-note-button-container">
          <Form.Item>
            <Button
              type="primary"
              htmlType="reset"
              onClick={() => setFormSubmitted(false)}
              style={{ width: "200px", margin: 16 }}
            >
              RESET
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
                width: "200px",
                margin: 16,
              }}
            >
              SUBMIT
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              disabled={formSubmitted ? false : true}
              style={{ width: "200px", margin: 16 }}
            >
              PRINT
            </Button>
          </Form.Item>
        </div>
        <Modal
          title="Issue note saved successfully"
          visible={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div>
  );
};

export default IssueNote;
