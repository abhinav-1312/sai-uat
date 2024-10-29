// import { Form } from 'antd'
// import React from 'react'
// import ButtonContainer from './ButtonContainer';

// const FormBody = React.forwardRef({children, formData, ref}) => {
//     const [form] = Form.useForm();

//     const updateField = (updatedFormData) => {
//       console.log("UPDAYE: ", updatedFormData)
//       form.setFieldsValue(updatedFormData)
//     }

//     React.useImperativeHandle(ref , () => ({
//       updateField: updateField
//     }))
//   return (
//     <>
//         <Form
//           form={form}
//           layout="vertical"
//           // style={{
//           //   display: "flex",
//           //   flexDirection: "column",
//           //   gap: "1rem",
//           //   margin: "0.5rem 0",
//           // }}
//           initialValues={formData}
//         >
//           <div
//             style={{
//               display: "flex",
//               // gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
//               gap: "1.2rem",
//               flexDirection: 'column',
//               marginTop: "1rem",
//             }}
//           >
//             {children}
//             </div>
//         </Form>
//     </>
//   )
// }

// export default FormBody


import { Form } from 'antd';
import React from 'react';

const FormBody = React.forwardRef((props, ref) => {
  const { children, formData, onFinish } = props; // Destructure props

  const [form] = Form.useForm();

  const updateField = (updatedFormData) => {
    form.setFieldsValue(updatedFormData);
  };

  React.useImperativeHandle(ref, () => ({
    updateField: updateField,
  }));


  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onFinish={onFinish}
      >
        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            flexDirection: 'column',
            marginTop: "1rem",
          }}
        >
          {children}
        </div>
      </Form>
    </>
  );
});

export default FormBody;
