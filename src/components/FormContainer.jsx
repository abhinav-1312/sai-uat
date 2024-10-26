import React, { useRef } from "react";
import ButtonContainer from "./ButtonContainer";
import { useReactToPrint } from "react-to-print";
import { message } from "antd";

const FormContainer = ({ children, onFinish, submitBtnEnabled, printBtnEnabled }) => {
  const ref = useRef()
  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: 'SAI_Form',
});

  return (
    <div className="a4-container" ref={ref}>
      {children}

      <div style={{ marginTop: "1rem" }}>
        <ButtonContainer handlePrint={handlePrint} onFinish={onFinish} submitBtnEnabled={submitBtnEnabled} printBtnEnabled={printBtnEnabled} />
      </div>
    </div>
  );
};

export default FormContainer;
