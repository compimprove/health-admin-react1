import {Avatar, Button, Form, Input, InputNumber, message, Select, Space, Upload} from 'antd';
import React, { Component } from 'react';
import MainLayout from '../component/MainLayout';
import { UserContext } from '../context/UserContext';
import localized from '../service/localized';
import Url from '../service/url';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
const { Option } = Select;


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};


class MealProgram extends Component {
  static routeName = "/meal-program";
  static contextType = UserContext;



  constructor(props) {
    super(props);
    let url = new URL(window.location.href);
    this.formRef = React.createRef();
    this.state = {
      imageUrl: "",
      trainees: [],
      meals: [],
      mealProgram: {},
      mealProgramId: url.searchParams.get('mealProgramId')
    }
  }


  async componentDidMount() {
    await this.getTraineesData();
    await this.getMealsData();
    if (this.state.mealProgramId != null) {
      await this.initMealProgramData()
    }
  }

  async initMealProgramData() {
    let programId = this.state.mealProgramId;
    let response = await this.context.axios({
      url: Url.TrainerMealProgram + "/" + programId
    })
    this.setState({
      mealProgram: response.data,
      imageUrl: response.data.imageUrl
    });
    console.log("get meal program", response.data);
    this.formRef.current.setFieldsValue(response.data);
  }

  async getMealsData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerMeal
    })
    console.log("get meals:", response.data);
    this.setState({ meals: response.data });
  }

  async getTraineesData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerTrainee
    })
    console.log("get trainees:", response.data);
    this.setState({ trainees: response.data });
  }

  onFinish = (form) => {
    form.imageUrl = this.state.imageUrl;
    if (this.state.mealProgramId != null) {
      form.id = this.state.mealProgramId
      this.editMealProgram(form)
    } else {
      this.createMealProgram(form)
    }
  }

  handleUploadImage = info => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        imageUrl: info.file.response.url
      })
    }
  };

  editMealProgram = async (form) => {
    console.log("editMeal", form);
    await this.context.axios({
      method: "PUT",
      url: Url.TrainerMealProgram + "/" + form.id,
      data: form
    })
    message.success("S???a b???a ??n th??nh c??ng")
    await this.initMealProgramData();
  }

  createMealProgram = async (form) => {
    console.log("createMeal", form);
    let response = await this.context.axios({
      method: "POST",
      url: Url.TrainerMealProgram + "/" + form.id,
      data: form
    })
    message.success("T???o b???a ??n th??nh c??ng");
    this.setState({
      mealProgram: response.data,
      mealProgramId: response.data._id
    });
    console.log("get meal program", response.data);
    this.formRef.current.setFieldsValue(response.data);
  }

  onFinishFailed = () => {

  }
  changeFormValueByIndex = (formField, index, key, value) => {
    let field = this.formRef.current.getFieldValue(formField);
    field[index] = field[index] || {};
    field[index][key] = value;
    this.formRef.current.setFieldsValue({ [formField]: field });
  }

  render() {
    let imageUrl = this.state.imageUrl;
    return (
      <MainLayout>
        <Form
          ref={this.formRef}
          style={{ width: 600, marginTop: 30 }}
          {...layout}
          name="mealProgramForm"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="T??n ch??? ????? ??n"
            name="title"
            rules={[{ required: true, message: 'H??y nh???p t??n b???a ??n' }]}
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
              action={Url.ImageUpload}
              onChange={this.handleUploadImage}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : <div>
                <PlusOutlined/>
                <div style={{marginTop: 8}}>Upload</div>
              </div>}
            </Upload>
          </Form.Item>


          <Form.Item
            label="B???a ??n"
          >
            <Space style={{ marginTop: 6, marginBottom: 20, display: 'flex', flexDirection: 'row' }} >
              <span style={{ marginRight: 190 }}>T??n b???a ??n</span>
              <span style={{ marginRight: 50 }}>Tu???n</span>
              <span>Ng??y</span>
            </Space>
            <Form.List
              name="meals"
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', flexDirection: 'row' }} align="baseline" >

                      <Form.Item
                        {...restField}
                        name={[name, 'mealId']}
                        fieldKey={[fieldKey, 'mealId']}
                        rules={[{ required: true, message: 'B???n ch??a ch???n b???a ??n' }]}
                      >
                        <Select
                          style={{ width: 250 }}
                          placeholder="Ch???n b???a ??n"
                        >
                          {this.state.meals.map(meal => (
                            <Option key={meal._id}><Avatar style={{ marginRight: 10 }} src={meal.imageUrl} />{meal.title}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'week']}
                        fieldKey={[fieldKey, 'week']}
                        rules={[{ required: true, message: 'B???n ch??a nh???p tu???n' }]}
                      >
                        <InputNumber placeholder={localized.get("week")} onChange={value => {
                          this.changeFormValueByIndex("meals", key, "week", value)
                        }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'day']}
                        fieldKey={[fieldKey, 'day']}
                        rules={[{ required: true, message: 'B???n ch??a ch???n ng??y' }]}
                      >
                        <InputNumber placeholder={localized.get("day")} onChange={value => {
                          this.changeFormValueByIndex("meals", key, "day", value)
                        }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Th??m b???a ??n
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

          </Form.Item>
          <Form.Item
            name="users"
            label="H???c vi??n s??? d???ng"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Ch???n h???c vi??n">
              {this.state.trainees.map(trainee =>
                <Option value={trainee._id}>{trainee.name}</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>
      </MainLayout>
    );
  }
}

export default MealProgram;