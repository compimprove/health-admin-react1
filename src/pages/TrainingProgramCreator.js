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


class TrainingProgramCreator extends Component {
  static routeName = "/training-program-creator";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    let url = new URL(window.location.href);
    this.formRef = React.createRef();
    this.state = {
      trainees: [],
      exercises: [],
      trainingProgram: {},
      trainingId: url.searchParams.get('trainingId')
    }
  }

  async componentDidMount() {
    await this.getTraineesData();
    await this.getExercisesData();
    if (this.state.trainingId != null) {
      await this.initTrainingProgramData()
    }
  }

  async initTrainingProgramData() {
    let programId = this.state.trainingId;
    let response = await this.context.axios({
      url: Url.TrainerTraining + "/" + programId
    })
    this.setState({
      trainingProgram: response.data,
    });
    console.log("get training program", response.data);
    this.formRef.current.setFieldsValue(response.data);
  }

  async getExercisesData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerExercise
    })
    console.log("get exercise data:", response.data);
    this.setState({ exercises: response.data });
  }

  async getTraineesData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerTrainee
    })
    console.log("get trainees:", response.data);
    this.setState({ trainees: response.data });
  }

  clearTrainingState = () => {
    this.setState({ trainingId: false });
  }

  onFinish = (form) => {
    if (this.state.trainingId != null) {
      form.id = this.state.trainingId
      this.editTrainingProgram(form)
    } else {
      this.createTrainingProgram(form)
    }
  }

  editTrainingProgram = async (form) => {
    console.log("editTrainingProgram", form);
    await this.context.axios({
      method: "PUT",
      url: Url.TrainerTraining + "/" + this.state.trainingId,
      data: form
    })
    message.success("Sửa thành công")
    await this.initTrainingProgramData();
  }
 
  createTrainingProgram = async (form) => {
    console.log("createTrainingProgram", form);
    let response = await this.context.axios({
      method: "POST",
      url: Url.TrainerTraining,
      data: form
    })
    message.success("Tạo thành công");
    this.setState({
      trainingProgram: response.data,
      trainingId: response.data._id
    });
    console.log("get training program", response.data);
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
        <Button onClick={this.clearTrainingState}>Tạo bài tập mới từ bài này</Button>
        <Form
          ref={this.formRef}
          style={{ width: 600, marginTop: 30 }}
          {...layout}
          name="trainingProgramForm"
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
            label={localized.get("Meals")}
          >
            <Space style={{ marginTop: 6, marginBottom: 20, display: 'flex', flexDirection: 'row' }} >
              <span style={{ marginRight: 190 }}>{localized.get("trainingName")}</span>
              <span style={{ marginRight: 50 }}>{localized.get("week")}</span>
              <span>{localized.get("day")}</span>
            </Space>
            <Form.List
              name="exercises"
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', flexDirection: 'row' }} align="baseline" >

                      <Form.Item
                        {...restField}
                        name={[name, 'exerciseId']}
                        fieldKey={[fieldKey, 'exerciseId']}
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Select
                          style={{ width: 250 }}
                          placeholder="Choose A Exercise"
                        >
                          {this.state.exercises.map(exercise => (
                            <Option key={exercise._id}>{exercise.title}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'week']}
                        fieldKey={[fieldKey, 'week']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <InputNumber placeholder={localized.get("week")} onChange={value => {
                          this.changeFormValueByIndex("exercises", key, "week", value)
                        }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'day']}
                        fieldKey={[fieldKey, 'day']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <InputNumber placeholder={localized.get("day")} onChange={value => {
                          this.changeFormValueByIndex("exercises", key, "day", value)
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
            label={localized.get("users")}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Tags Mode">
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

export default TrainingProgramCreator;