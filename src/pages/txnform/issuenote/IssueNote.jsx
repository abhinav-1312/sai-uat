// IssueNote.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  message,
  Modal,
  Popover,
  Table,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PrinterOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

import {
  apiHeader,
  handleSearch,
  mergeItemMasterAndOhq,
  printOrSaveAsPDF,
  searchedData,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import useHandlePrint from "../../../components/useHandlePrint";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const IssueNote = () => {
  const dispatch = useDispatch()

  const {data: itemData} = useSelector(state => state.item)
  const {data: ohqData} = useSelector(state => state.ohq)
  const data = useMemo( () => mergeItemMasterAndOhq(itemData, ohqData), [itemData, ohqData])

  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [buttonVisible, setButtonVisible] = useState(false);
  const [Type, setType] = useState("IRP");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // State to hold selected item data
  const [tableOpen, setTableOpen] = useState(false);

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

  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const handleFormReset = () => {
    window.location.reload();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "interRdDemandNote") {
      setFormData((prevValues) => {
        return {
          ...prevValues,
          interRdDemandNote: value,
          demandNoteNo: value,
        };
      });
    }
    if (fieldName === "processType") {
      setFormData((prevValues) => {
        return {
          ...prevValues,
          processType: value,
          type: value,
        };
      });
    }
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const itemHandleChange = (fieldName, value, index) => {
    if (fieldName === "quantity") {
      // const formItemQuantity = formData.items[index]
      const {
        // quantity: formItemQuantity,
        itemCode,
        locatorId: formDataLocId,
      } = formData.items[index];
      const filteredItemObj = filteredData.find(
        (obj) =>
          obj.itemMasterCd === itemCode &&
          obj.qtyList.some((inObj) => inObj.locatorId === formDataLocId)
      );
      const foundObj = filteredItemObj.qtyList.find(
        (obj) => obj.locatorId === formDataLocId
      );

      if (value > foundObj.quantity) {
        message.error(
          `Required quantity is greater than available quantity at Serial no: ${
            index + 1
          }`
        );
        return;
      }
    }

    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value,
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
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
  const { organizationDetails, locationDetails, userDetails, token, userCd } = useSelector((state) => state.auth);

  // const populateItemData = async () => {
  //   const itemMasterUrl =
  //     "/master/getItemMaster";
  //   const ohqUrl =
  //     "/master/getOHQ";
  //   const vendorMasteUrl =
  //     "/master/getVendorMaster";
  //   const locationMasterUrl =
  //     "/master/getLocationMaster";
  //   try {
  //     const [itemMaster, ohq, vendorMaster, locationMaster] = await Promise.all(
  //       [
  //         axios.get(itemMasterUrl, apiHeader("GET", token)),
  //         axios.post(
  //           ohqUrl,
  //           { itemCode: null, user: userCd },
  //           apiHeader("GET", token)
  //         ),
  //         axios.get(vendorMasteUrl, apiHeader("GET", token)),
  //         axios.get(locationMasterUrl, apiHeader("GET", token)),
  //       ]
  //     );

  //     const { responseData: itemMasterData } = itemMaster.data;
  //     // const {responseData : locatorMasterData} = locatorMaster.data
  //     // const {responseData : uomMasterData} = uomMaster.data
  //     const { responseData: ohqData } = ohq.data;
  //     const { responseData: vendorMasterData } = vendorMaster.data;
  //     const { responseData: locationMasterData } = locationMaster.data;

  //     const mergedItemMaster = mergeItemMasterAndOhq(itemMasterData, ohqData);

  //     // setData([...mergedItemMaster]);
  //     setFilteredData([...mergedItemMaster]);

  //     const locationMasterObj = locationMasterData.reduce((acc, obj) => {
  //       acc[obj.id] = obj.locationName;
  //       return acc;
  //     }, {});

  //     const vendorMasterObj = vendorMasterData.reduce((acc, obj) => {
  //       acc[obj.id] = obj.vendorName;
  //       return acc;
  //     }, {});
  //     // setVendorMaster({ ...vendorMasterObj });
  //     // setLocationMaster({ ...locationMasterObj });
  //   } catch (error) {
  //     console.log("Populate item data error: ", error);
  //   }
  // };

  useEffect(() => {

    dispatch(fetchOhq())

    const fetchUserDetails = () => {
      const currentDate = dayjs();
      setFormData((prev) => {
        return {
          ...prev,
          crRegionalCenterCd: organizationDetails.id,
          crRegionalCenterName: organizationDetails.organizationName,
          crAddress: organizationDetails.locationAddr,
          crZipcode: locationDetails.zipcode,
          genName: userDetails.firstName + " " + userDetails.lastName,
          userId: userCd,
          issueNoteNo: "not defined",
          genDate: currentDate.format(dateFormat),
          issueDate: currentDate.format(dateFormat),
          approvedDate: currentDate.format(dateFormat),
          issueNoteDt: currentDate.format(dateFormat),
          demandNoteDt: currentDate.format(dateFormat),
        };
      });
    };
    fetchUserDetails();
  }, [organizationDetails.id, organizationDetails.organizationName, locationDetails.zipcode, organizationDetails.locationAddr, userCd, userDetails.firstName, userDetails.lastName,  dispatch]);

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
      setFormData((prevValues) => {
        const newItem = {
          srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
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

        const updatedItems = [...(prevValues.items || []), newItem];
        return { ...prevValues, items: updatedItems };
      });
    } else {
      // If item is already selected, deselect it
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  // const fetchUserDetails = () => {
  //   const currentDate = dayjs();
  //   setFormData((prev) => {
  //     return {
  //       ...prev,
  //       crRegionalCenterCd: organizationDetails.id,
  //       crRegionalCenterName: organizationDetails.organizationName,
  //       crAddress: organizationDetails.locationAddr,
  //       crZipcode: locationDetails.zipcode,
  //       genName: userDetails.firstName + " " + userDetails.lastName,
  //       userId: userCd,
  //       issueNoteNo: "not defined",
  //       genDate: currentDate.format(dateFormat),
  //       issueDate: currentDate.format(dateFormat),
  //       approvedDate: currentDate.format(dateFormat),
  //       issueNoteDt: currentDate.format(dateFormat),
  //       demandNoteDt: currentDate.format(dateFormat),
  //     };
  //   });
  // };

  console.log("DATAA: ", data)

  const handleCeRccChange = async (value) => {
    const url =
      "/master/getOrgMasterById";
    const { data } = await axios.post(
      url,
      { id: value, userId: userCd },
      apiHeader("POST", token)
    );

    console.log("RESPONSE RCC: ", data);
    const { responseStatus, responseData } = data;

    if (
      responseStatus.message === "Success" &&
      responseStatus.statusCode === 200
    ) {
      setFormData((prev) => {
        return {
          ...prev,
          ceRegionalCenterCd: responseData.id,
          ceRegionalCenterName: responseData.organizationName,
          ceAddress: responseData.locationAddr,
          ceZipcode: responseData.locationDetails.zipcode,
        };
      });
    }
  };

  const onFinish = async () => {
    setDisableSubmitBtn(true);
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
        "/saveIssueNote";
      const response = await axios.post(
        apiUrl,
        formDataCopy,
        apiHeader("POST", token)
      );
      if (
        response.status === 200 &&
        response.data &&
        response.data.responseStatus &&
        response.data.responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } =
          response.data.responseData;
        setFormData((prevValues) => {
          return {
            ...prevValues,
            issueNoteNo: processId,
          };
        });
        setButtonVisible(true);
        setSuccessMessage(
          `Issue note saved successfully! Issue Note No : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Issue note saved successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        // fetchUserDetails()
      } else {
        // Display a generic success message if specific data is not available
        setErrorMessage("Failed to save issue note. Please try again later.")
        message.error("Failed to save issue note. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving issue note:", error);
      message.error("Failed to submit issue note. ");
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const removeItem = (index) => {
    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems.splice(index, 1);

      const updatedItems1 = updatedItems.map((item, key) => {
        return { ...item, srNo: key + 1 };
      });

      return { ...prevValues, items: updatedItems1 };
    });
  };

  useEffect(()=> {
    console.log("RE rendered")
  }, [data])

  return (
    <>
      <div className="a4-container" ref={formRef}>
        <div className="heading-container">
          <h4>
            Issue Note No. : <br /> {formData.issueNoteNo}
          </h4>
          <h2 className="a4-heading">Sports Authority Of India - Issue Note</h2>
          <h4>
            Issue Note Date. : <br /> {formData.issueNoteDt}
          </h4>
        </div>

        <Form
          layout="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            margin: "0.5rem 0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "1rem",
              margin: "1rem 0",
            }}
          >
            <div className="consignor-container">
              <h3 className="consignor-consignee-heading">Consignor Details</h3>
              <FormInputItem
                label="Regional Center Code"
                value={formData.crRegionalCenterCd}
              />
              <FormInputItem
                label="Regional Center Name"
                value={formData.crRegionalCenterName}
              />
              <FormInputItem label="Address" value={formData.crAddress} />
              <FormInputItem label="Zipcode" value={formData.crZipcode} />
            </div>

            <div className="consignee-container">
              <h3 className="consignor-consignee-heading">Consignee Details</h3>

              {formData.processType === "IRP" ||
              formData.processType === "NIRP" ? (
                <>
                  <FormInputItem
                    label="Consumer Name"
                    name="consumerName"
                    onChange={handleChange}
                  />
                  <FormInputItem
                    label="Contact No."
                    name="contactNo"
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <FormInputItem
                    label="Regional Center Code"
                    value={formData.ceRegionalCenterCd}
                  />
                  <FormInputItem
                    label="Regional Center Name"
                    value={formData.crRegionalCenterName}
                  />
                  <FormInputItem label="Address" value={formData.crAddress} />
                  <FormInputItem label="Zipcode" value={formData.crZipcode} />
                </>
              )}
            </div>

            <div className="other-container">
              <h3 className="consignor-consignee-heading">Other Details</h3>

              <Form.Item label="Type" name="type">
                <Select
                  onChange={(value) => handleChange("processType", value)}
                >
                  <Option value="IRP">1. RETURNABLE</Option>
                  <Option value="NIRP">2. NON RETURNABLE</Option>
                  <Option value="IOP">3. INTER - ORG. TRANSFER</Option>
                </Select>
              </Form.Item>

              <FormInputItem
                label="Demand Note No."
                name="demandNoteNo"
                onChange={handleChange}
              />
              <FormDatePickerItem
                label="Demand Note Date"
                defaultValue={dayjs()}
                name="demandNoteDt"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="item-details-container">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>Item Details</h3>
              {/* <Button type="dashed" icon={<PlusOutlined />}>
                Add Item
              </Button> */}

              <Popover
                onClick={() => setTableOpen(true)}
                content={
                  <Table
                    pagination={{ pageSize: 3 }}
                    // dataSource={searchedData(data, searchValue)}
                    dataSource={data !== undefined && data?.filter((item) =>
                        Object.values(item).some(
                          (value) =>
                            typeof value === "string" &&
                            value.toLowerCase().includes(searchValue.toLowerCase())
                        )
                      )}
                    
                    columns={tableColumns}
                    scroll={{ x: "max-content" }}
                    style={{
                      width: "600px",
                      display: tableOpen ? "block" : "none",
                    }}
                  />
                }
                title="Filtered Item Data"
                trigger="click"
                // open={true}
                open={searchValue !== "" && filteredData.length > 0}
                style={{ width: "200px" }}
                placement="right"
              >
                <Input.Search
                  placeholder="Search Item Data"
                  allowClear
                  enterButton="Search"
                  size="medium"
                  style={{ width: "16rem" }}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </Popover>
            </div>

            <div className="each-item-detail-container">
              <div className="each-item-detail-container-grid">
                <FormInputItem label="S. No." />
                <FormInputItem label="Item Code" />
                <FormInputItem
                  label="Item Description"
                  className="item-desc-cell"
                />
                <FormInputItem label="Unit of Measurement" />
                <FormInputItem label="Required Quantity" />
                <FormInputItem label="Req. For No. of Days" />
                <FormInputItem label="Remark" />
                <Button icon={<DeleteOutlined />} className="delete-button" />
              </div>
            </div>

            <div className="each-item-detail-container">
              <div className="each-item-detail-container-grid">
                <FormInputItem label="S. No." />
                <FormInputItem label="Item Code" />
                <FormInputItem
                  label="Item Description"
                  className="item-desc-cell"
                />
                <FormInputItem label="Unit of Measurement" />
                <FormInputItem label="Required Quantity" />
                <FormInputItem label="Req. For No. of Days" />
                <FormInputItem label="Remark" />
                <Button icon={<DeleteOutlined />} className="delete-button" />
              </div>
            </div>
          </div>

          <div className="terms-condition-container">
            <div>
              <h3>Terms And Conditions</h3>
              <TextArea rows={4} />
            </div>
            <div>
              <h3>Note</h3>
              <TextArea rows={4} />
            </div>
          </div>

          <div className="designations-container">
            <div className="each-desg">
              <h4> Generated By </h4>
              <FormInputItem placeholder="Name and Designation" />
              <FormDatePickerItem defaultValue={dayjs()} />
            </div>
            <div className="each-desg">
              <h4> Approved By </h4>
              <FormInputItem placeholder="Name and Designation" />
              <FormDatePickerItem defaultValue={dayjs()} />
            </div>
            <div className="each-desg">
              <h4> Received By </h4>
              <FormInputItem placeholder="Name and Signature" />
              <FormDatePickerItem defaultValue={dayjs()} />
            </div>
          </div>
        </Form>

        <div className="button-container">
          <Button
            onClick={handlePrint}
            type="primary"
            danger
            style={{ width: "200px" }}
            icon={<UndoOutlined />}
          >
            Reset
          </Button>
          <Button
            onClick={handlePrint}
            type="primary"
            style={{
              backgroundColor: "#4CAF50",
              width: "200px",
            }}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
          <Button
            onClick={handlePrint}
            type="primary"
            style={{ width: "200px" }}
            icon={<PrinterOutlined />}
          >
            Print
          </Button>
        </div>
      </div>
      <Modal
          title="Issue note saved successfully"
          visible={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>

    </>
  );

  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
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
            <FormInputItem
              label="ISSUE NOTE NO. :"
              value={
                formData.issueNoteNo === "string"
                  ? "not defined"
                  : formData.issueNoteNo
              }
              disabled={true}
            />
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
                    value={formData?.ceRegionalCenterCd}
                    onChange={(e) => handleCeRccChange(e.target.value)}
                  />
                </Form.Item>
                <FormInputItem
                  label="REGIONAL CENTER NAME"
                  value={formData.ceRegionalCenterName}
                />
                <FormInputItem label="ADDRESS" value={formData.ceAddress} />
                <FormInputItem label="ZIPCODE" value={formData.ceZipcode} />
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
        <h2>ITEM DETAILS</h2>
        <div style={{ width: "300px" }}>
          <Popover
            onClick={() => setTableOpen(true)}
            content={
              <Table
                pagination={{ pageSize: 3 }}
                dataSource={filteredData}
                columns={tableColumns}
                scroll={{ x: "max-content" }}
                style={{
                  width: "600px",
                  display: tableOpen ? "block" : "none",
                }}
              />
            }
            title="Filtered Item Data"
            trigger="click"
            // open={true}
            open={searchValue !== "" && filteredData.length > 0}
            style={{ width: "200px" }}
            placement="right"
          >
            <Input.Search
              placeholder="Search Item Data"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={(e) =>
                handleSearch(
                  e.target?.value || "",
                  data,
                  setFilteredData,
                  setSearchValue
                )
              }
              onChange={(e) =>
                handleSearch(
                  e.target?.value || "",
                  data,
                  setFilteredData,
                  setSearchValue
                )
              }
            />
          </Popover>
        </div>

        <Form.List name="items" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData?.items?.length > 0 &&
                formData.items.map((item, key) => {
                  return (
                    // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

                    <div
                      key={key}
                      style={{
                        marginBottom: 16,
                        border: "1px solid #d9d9d9",
                        padding: 16,
                        borderRadius: 4,
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                      }}
                    >
                      <Form.Item label="Serial No.">
                        <Input value={item.srNo} readOnly />
                      </Form.Item>

                      <Form.Item label="ITEM CODE">
                        <Input value={item.itemCode} readOnly />
                      </Form.Item>

                      <Form.Item label="ITEM DESCRIPTION">
                        <Input value={item.itemDesc} readOnly />
                      </Form.Item>

                      <Form.Item label="UOM">
                        <Input value={item.uomDesc} />
                      </Form.Item>

                      {/* <Form.Item label="LOCATOR DESCRIPITON">
                          <Input value= {item.locatorDesc}readOnly />
                        </Form.Item> */}

                      <Form.Item label="REQUIRED QUANTITY">
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            itemHandleChange("quantity", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Form.Item label="REQUIRED FOR NO. OF DAYS">
                        <Input
                          value={item.noOfDays}
                          onChange={(e) =>
                            itemHandleChange("noOfDays", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Form.Item label="REMARK">
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            itemHandleChange("remarks", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Col span={1}>
                        <MinusCircleOutlined
                          onClick={() => removeItem(key)}
                          style={{ marginTop: 8 }}
                        />
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
              <Form.Item rules={[{ required: true }]}>
                <Input
                  name="approvedName"
                  onChange={(e) => handleChange("approvedName", e.target.value)}
                  required={true}
                />
              </Form.Item>
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
              <Form.Item rules={[{ required: true }]}>
                <Input
                  name="issueName"
                  onChange={(e) => handleChange("issueName", e.target.value)}
                  required={true}
                />
              </Form.Item>
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
              onClick={handleFormReset}
              style={{ width: "200px", margin: 16 }}
            >
              RESET
            </Button>
          </Form.Item>

          <Form.Item>
            <Tooltip
              title={
                disableSubmitBtn ? "Press reset button to enable submit." : ""
              }
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                  width: "200px",
                  margin: 16,
                }}
                disabled={disableSubmitBtn}
              >
                SUBMIT
              </Button>
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Button
              disabled={!buttonVisible}
              onClick={() => printOrSaveAsPDF(formRef)}
              type="primary"
              danger
              style={{ width: "200px", margin: 16, alignContent: "end" }}
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
