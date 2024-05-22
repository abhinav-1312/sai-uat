import React from "react";
import { Form, Input, Button } from "antd";

const IndependentVariableForm = ({ heading }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Values: ", values)
  }

  return (
    <>
    <div style={{padding: "1rem 0"}}>
      <h2> {heading} </h2>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "1rem",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
        }}
      >
        <Form.Item
        style={{flex: 1}}
          label="Description"
          name="paramDesc"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
        style={{flex: 1}}
          label="Value"
          name="paramVal"
          rules={[{ required: true, message: "Please input the value!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      </div>
    </>
  );
};

export default IndependentVariableForm;
