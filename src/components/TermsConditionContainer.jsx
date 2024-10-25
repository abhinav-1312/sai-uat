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

}) => {
  return (
    <div className="terms-condition-container">
      {termsConditionVisible && (
        <div>
          <h3>Terms And Conditions</h3>
          <TextArea
            autoSize={{ minRows: 4, maxRows: 16 }}
            // value={termsCondition}
            name="termsCondition"
            onChange={(e) => handleChange("termsCondition", e.target.value)}
          />
        </div>
      )}
      {noteVisible && (
        <div>
          <h3>Note</h3>
          <TextArea
            autoSize={{ minRows: 4, maxRows: 16 }}
            // value={note}
            name="note"
            onChange={(e) => handleChange("note", e.target.value)}
          />
        </div>
      )}
      {conditionOfGoodsVisible && (
        <div>
          <h3>Condition of Goods</h3>
          <TextArea
            autoSize={{ minRows: 4, maxRows: 16 }}
            value={conditionOfGoods}
            onChange={(e) => handleChange("conditionOfGoods", e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default TermsConditionContainer;
