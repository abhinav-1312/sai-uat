import { Button, Tooltip } from "antd";
import React from "react";
import {
  UndoOutlined,
  SaveOutlined,
  CloudDownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const ButtonContainer = ({
  submitBtnEnabled,
  onFinish,
  printBtnEnabled,
  handlePrint,
  draftDataName,
  draftBtnEnabled,
  formData,
  disabled
}) => {
  const navigate = useNavigate();
  const location = useLocation()
  const saveDraft = () => {
    localStorage.setItem(draftDataName, JSON.stringify(formData))
  }

  const handleReset = () => {
    localStorage.removeItem(draftDataName);
    navigate(location.pathname,
      {
        state: {data: null, itemList: null}
      }
    )
    window.location.reload();
  }

  return (
    <div className="button-container">
      <Tooltip title="Clear form">
        <Button
          type="primary"
          danger
          icon={<UndoOutlined />}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Tooltip>

      <Tooltip
        title={
          submitBtnEnabled
            ? "Submit form"
            : "Press reset button to enable submit."
        }
      >
        <Button
          onClick={onFinish}
          type="primary"
          style={{
            backgroundColor: "#4CAF50",
          }}
          icon={<SaveOutlined />}
          disabled={disabled ? true : (submitBtnEnabled ? false : true)}
        >
          Submit
        </Button>
      </Tooltip>

      <Tooltip title={"Save the form as draft."}>
        <Button
          onClick={saveDraft}
          type="primary"
          style={{
            backgroundColor: "#eed202",
          }}
          icon={<CloudDownloadOutlined />}
          disabled={disabled ? true : (draftBtnEnabled ? false : true)}
        >
          Save draft
        </Button>
      </Tooltip>

      <Tooltip
        title={
          printBtnEnabled ? "Print form" : "Submit the form to enable print."
        }
      >
        <Button
          onClick={handlePrint}
          type="primary"
          icon={<PrinterOutlined />}
          disabled={printBtnEnabled ? false : true}
        >
          Print
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonContainer;
