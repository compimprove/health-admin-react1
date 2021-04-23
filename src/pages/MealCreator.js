import { Button, Form, Input, InputNumber, Layout, Radio, Space } from 'antd';
import React, { Component } from 'react';
import localized from '../service/localized';
const { Header } = Layout;
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


class MealCreator extends React.Component {
  static routeName = "/meal-creator";
  
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ color: "white" }}>Meal Creator</Header>
          <MealForm />
        </Layout>
      </Layout>);
  }
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class MealForm extends Component {

  onFinish = (values) => {
    console.log(values);
  }
  onFinishFailed = () => {

  }

  render() {
    return (
      <div>
        <Form
          style={{ width: 700, marginTop: 30 }}
          {...layout}
          // name="basic"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label={localized.get("foodName")}
            name="name"
            rules={[{ required: true, message: 'Please input the food name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={localized.get("description")}
            name="description"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={localized.get("prepTime")}
            name="prepTime"

          >
            <InputNumber /><span className="ant-form-text">{" " + localized.get("minute")}</span>
          </Form.Item>

          <Form.Item
            label={localized.get("cookTime")}
            name="cookTime"
          >
            <InputNumber /><span className="ant-form-text">{" " + localized.get("minute")}</span>
          </Form.Item>

          <Form.Item
            label={localized.get("type")}
            name="type"
            rules={[{ required: true, message: 'Please input the type!' }]}
          >
            <Radio.Group
              buttonStyle="solid">
              <Radio.Button value="mainDish">{localized.get("mainDish")}</Radio.Button>
              <Radio.Button value="sideDish">{localized.get("sideDish")}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={localized.get("nutrition")}
          >
            <Form.List
              name="nutrition"
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Input placeholder={localized.get("nutritionIngredient")} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        fieldKey={[fieldKey, 'amount']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <Input placeholder={localized.get("amount")} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {localized.get("nutritionIngredient")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            label={localized.get("ingredient")}
          >
            <Form.List
              name="ingredient"
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8, marginLeft: 50 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Input placeholder={localized.get("ingredientName")} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        fieldKey={[fieldKey, 'amount']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <Input placeholder={localized.get("amount")} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {localized.get("ingredient")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
        </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default MealCreator;
