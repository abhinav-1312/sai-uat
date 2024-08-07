import React from "react";

const FormHeading = ({formTitle, txnType, date, txnNo}) => {
  return (
    <div className="heading-container">
      <h4>
        {txnType} No. : <br />
        {txnNo}
      </h4>
      <h2 className="a4-heading">
        Sports Authority Of India - {formTitle}
      </h2>
      <h4>
        {txnType} Date. : <br /> {date}
      </h4>
    </div>
  );
};

export default FormHeading;
