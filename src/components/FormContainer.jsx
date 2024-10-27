import React from "react";

const FormContainer = React.forwardRef((props, ref) => {
  const {children } = props

  return (
    <div className="a4-container" ref={ref}>
      {children}
    </div>
  );
});

export default FormContainer;
