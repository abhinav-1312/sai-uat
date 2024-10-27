import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const TermsConditionContainer = ({
  termsCondition,
  note,
  conditionOfGoods,
  termsConditionVisible,
  noteVisible,
  conditionOfGoodsVisible,
  handleChange,
  readOnly

}) => {
  return (
    <div className="terms-condition-container">
      {termsConditionVisible && (
        <div>
          <h3>Terms And Conditions</h3>
          <Form.Item name="termsCondition">

          <TextArea
            autoSize={{ minRows: 4, maxRows: 16 }}
            onChange={(e) => handleChange("termsCondition", e.target.value)}
            readOnly={readOnly}
            />
            </Form.Item>
        </div>
      )}
      {noteVisible && (
        <div>
          <h3>Note</h3>
          <Form.Item name="note">

          <TextArea
            autoSize={{ minRows: 4, maxRows: 16 }}
            onChange={(e) => handleChange("note", e.target.value)}
            readOnly={readOnly}
            />
            </Form.Item>
        </div>
      )}
      {conditionOfGoodsVisible && (
        <div>
          <h3>Condition of Goods</h3>
          <TextArea
            autoSize={{ minRows: 4, maxRows: 16 }}
            value={conditionOfGoods}
            onChange={(e) => handleChange("conditionOfGoods", e.target.value)}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
};

export default TermsConditionContainer;
