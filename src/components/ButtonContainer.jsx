import { Button, Tooltip } from "antd";
import React from "react";
import {
  UndoOutlined,
  SaveOutlined,
  CloudDownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const ButtonContainer = ({
  handleFormReset,
  submitBtnEnabled,
  onFinish,
  saveDraft,
  printBtnEnabled,
  handlePrint,
}) => {
  return (
    <div className="button-container">
      <Tooltip title="Clear form">
        <Button
          type="primary"
          danger
          icon={<UndoOutlined />}
          // onClick={handleFormReset}
          onClick={()=> window.location.reload()}
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
        >
          Submit
        </Button>
      </Tooltip>

      {/* <Tooltip title={"Save the form as draft."}>
        <Button
          onClick={saveDraft}
          type="primary"
          style={{
            backgroundColor: "#eed202",
          }}
          icon={<CloudDownloadOutlined />}
        >
          Save draft
        </Button>
      </Tooltip> */}

      <Tooltip
        title={
          printBtnEnabled ? "Print form" : "Submit the form to enable print."
        }
      >
        <Button
          onClick={handlePrint}
          type="primary"
          icon={<PrinterOutlined />}
          disabled={true}
        >
          Print
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonContainer;
