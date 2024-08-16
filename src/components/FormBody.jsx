import { Form } from 'antd'
import React from 'react'

const FormBody = ({children, formData}) => {
    const [form] = Form.useForm();
  return (
    <>
        <Form
          form={form}
          layout="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            margin: "0.5rem 0",
          }}
          initialValues={formData}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {children}
            </div>
        </Form>
    </>
  )
}

export default FormBody
