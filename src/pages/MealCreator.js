import { Button, Col, Form, Input, InputNumber, Layout, Radio, Row, Space, Upload, Typography, message } from 'antd';
import React, { Component } from 'react';
import localized from '../service/localized';
const { Header } = Layout;
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { LogUtils } from "../service/logUtils";
import { UserContext } from '../context/UserContext';
import Url from '../service/url';
import MealOverview from './MealOverview';
const { Title } = Typography;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


class MealCreator extends React.Component {
  static routeName = "/meal-creator";
  static contextType = UserContext;

  constructor(props) {
    super(props);
  }



  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ color: "white" }}>Bữa ăn</Header>
          <MealForm initData={this.props.initData} />
        </Layout>
      </Layout>);
  }
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

class MealForm extends React.Component {
  imageUrl = null;
  formRef = React.createRef();
  static contextType = UserContext;


  constructor(props) {
    super(props);
    let url = new URL(window.location.href);
    this.state = {
      initData: {},
      mealId: url.searchParams.get('mealId'),
      imageUrl: ""
    }
  }

  async componentDidMount() {
    if (this.state.mealId != null) {
      await this.getMealsData();
    }
  }

  getMealsData = async () => {
    let response = await this.context.axios({
      url: Url.TrainerMeal + '/' + this.state.mealId
    })
    console.log("get mealId", this.state.mealId, response.data);
    this.formRef.current.setFieldsValue(this.transformReponseDataToFormData(response.data))
    this.setState({
      initData: response.data,
      imageUrl: response.data.imageUrl
    });
  }

  transformReponseDataToFormData(data) {
    if (Array.isArray(data.ingredients)) {
      data.ingredients = data.ingredients.map(value => {
        return {
          name: value
        }
      })
    }
    if (Array.isArray(data.directions)) {
      data.directions = data.directions.map(value => {
        return {
          name: value
        }
      })
    }
    return data;
  }


  onFinish = async (form) => {
    if (form.nutritions == null) {
      form.nutritions = [];
    }
    if (form.directions != null) {
      form.ingredients = form.ingredients.map(value => value.name);
    }
    if (form.directions != null) {
      form.directions = form.directions.map(value => value.name);
    }
    form.imageUrl = this.state.imageUrl;
    if (this.state.mealId != null) {
      await this.context.axios({
        method: "PUT",
        url: Url.TrainerMeal + "/" + this.state.mealId,
        data: form
      })
    } else {
      await this.context.axios({
        method: "POST",
        url: Url.TrainerMeal,
        data: form
      })
    }
    await this.getMealsData();
    message.success("Cập nhật bữa ăn thành công")
  }
  onFinishFailed = () => {

  }

  setFormValue = (params) => {

  }

  changeFormValueByIndex = (formField, index, key, value) => {
    let field = this.formRef.current.getFieldValue(formField);
    field[index] = field[index] || {};
    field[index][key] = value;
    this.formRef.current.setFieldsValue({ [formField]: field });
  }

  handleUploadImage = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        imageUrl: info.file.response.url
      })
    }
  };

  render() {
    let imageUrl = this.state.imageUrl;
    let prepTime = this.state.initData.prepTime;
    let cookTime = this.state.initData.cookTime;
    return (
      <div>
        <Form
          ref={this.formRef}
          style={{ width: 600, marginTop: 30 }}
          {...layout}
          name="mealForm"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label={localized.get("foodName")}
            name="title"
            rules={[{ required: true, message: 'Please input the food name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={localized.get("description")}
            name="description"
          >
            <Input.TextArea autoSize placeholder={localized.get("description")} />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label={localized.get("mealImage")}
            valuePropName="file"
            extra=""
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={this.handleUploadImage}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>}
            </Upload>
          </Form.Item>

          <Form.Item
            label={localized.get("prepTime")}
            name="prepTime"
            rules={[{ required: true, message: 'Please input the type!' }]}
          >
            {this.state.mealId != null && prepTime != null &&
              <InputNumber defaultValue={prepTime} onChange={value => this.formRef.current.setFieldsValue({ prepTime: value })} />}
            {this.state.mealId == null &&
              <InputNumber defaultValue={0} onChange={value => this.formRef.current.setFieldsValue({ prepTime: value })} />}
            <span className="ant-form-text">{" " + localized.get("minute")}</span>
          </Form.Item>

          <Form.Item
            label={localized.get("cookTime")}
            name="cookTime"
            rules={[{ required: true, message: 'Please input the type!' }]}
          >
            {this.state.mealId != null && cookTime != null &&
              <InputNumber defaultValue={cookTime} onChange={value => this.formRef.current.setFieldsValue({ cookTime: value })} />}
            {this.state.mealId == null &&
              <InputNumber defaultValue={0} onChange={value => this.formRef.current.setFieldsValue({ cookTime: value })} />}
            <span className="ant-form-text">{" " + localized.get("minute")}</span>
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
            {/* <Row gutter={16} style={{ marginTop: 32 }}> */}
            {/* <Col className="gutter-row" span={12}>
                <span className="ant-form-text">Cơ bản</span>
                <Form.Item
                  {...layout}
                  style={{ marginTop: "20px" }}
                  label={localized.get("carbs")}
                  name="carbs"
                  rules={[{ required: true, message: 'Please input the type!' }]}
                >
                  <InputNumber onChange={value => this.formRef.current.setFieldsValue({ carbs: value })} />
                  <span className="ant-form-text">{" " + localized.get("gram")}</span>
                </Form.Item>
                <Form.Item
                  {...layout}
                  label={localized.get("protein")}
                  name="protein"
                  rules={[{ required: true, message: 'Please input the type!' }]}
                >
                  <InputNumber onChange={value => this.formRef.current.setFieldsValue({ protein: value })} />
                  <span className="ant-form-text">{" " + localized.get("gram")}</span>
                </Form.Item>
                <Form.Item
                  {...layout}
                  label={localized.get("lipit")}
                  name="lipit"
                  rules={[{ required: true, message: 'Please input the type!' }]}
                >
                  <InputNumber onChange={value => this.formRef.current.setFieldsValue({ lipit: value })} />
                  <span className="ant-form-text">{" " + localized.get("gram")}</span>
                </Form.Item>
              </Col> */}
            {/* <Col className="gutter-row" span={24}> */}
            <Form.List
              name="nutritions"
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
                        <InputNumber placeholder={localized.get("amount")} onChange={value => {
                          this.changeFormValueByIndex("nutritions", key, "amount", value)
                        }} />
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
            {/* </Col> */}
            {/* </Row> */}
          </Form.Item>

          <Form.Item
            label={localized.get("ingredient")}
          >
            <Form.List
              name="ingredients"
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <Form.Item
                        {...restField}
                        style={{ width: 450, }}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Input.TextArea autoSize placeholder={localized.get("ingredientName")} />
                      </Form.Item>
                      {/* <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        fieldKey={[fieldKey, 'amount']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <InputNumber placeholder={localized.get("amount")} onChange={value => {
                          this.changeFormValueByIndex("ingredients", key, "amount", value)
                        }} />
                      </Form.Item> */}
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
          <Form.Item
            label={localized.get("direction")}
          >
            <Form.List
              name="directions"
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', justifyContent: "space-between" }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        style={{ width: 450, }}
                        rules={[{ required: true, message: localized.get("missingDirection") }]}
                      >
                        <Input.TextArea autoSize placeholder={localized.get("direction")} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {localized.get("direction")}
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
