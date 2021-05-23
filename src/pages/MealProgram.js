import { Avatar, Button, Form, Input, InputNumber, message, Select, Space } from 'antd';
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
    if (this.state.mealProgramId != null) {
      form.id = this.state.mealProgramId
      this.editMealProgram(form)
    } else {
      this.createMealProgram(form)
    }
  }

  editMealProgram = async (form) => {
    console.log("editMeal", form);
    await this.context.axios({
      method: "PUT",
      url: Url.TrainerMealProgram + "/" + form.id,
      data: form
    })
    message.success("Sửa bữa ăn thành công")
    await this.initMealProgramData();
  }

  createMealProgram = async (form) => {
    console.log("createMeal", form);
    let response = await this.context.axios({
      method: "POST",
      url: Url.TrainerMealProgram + "/" + form.id,
      data: form
    })
    message.success("Tạo bữa ăn thành công");
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
            label={localized.get("foodName")}
            name="title"
            rules={[{ required: true, message: 'Hãy nhập tên bữa ăn' }]}
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
            label="Bữa ăn"
          >
            <Space style={{ marginTop: 6, marginBottom: 20, display: 'flex', flexDirection: 'row' }} >
              <span style={{ marginRight: 190 }}>Tên bữa ăn</span>
              <span style={{ marginRight: 50 }}>Tuần</span>
              <span>Ngày</span>
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
                        rules={[{ required: true, message: 'Bạn chưa chọn bữa ăn' }]}
                      >
                        <Select
                          style={{ width: 250 }}
                          placeholder="Choose A Meal"
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
                        rules={[{ required: true, message: 'Bạn chưa nhập tuần' }]}
                      >
                        <InputNumber placeholder={localized.get("week")} onChange={value => {
                          this.changeFormValueByIndex("meals", key, "week", value)
                        }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'day']}
                        fieldKey={[fieldKey, 'day']}
                        rules={[{ required: true, message: 'Bạn chưa chọn ngày' }]}
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
                      {localized.get("nutritionIngredient")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

          </Form.Item>
          <Form.Item
            name="users"
            label="Học viên sử dụng"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn học viên">
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