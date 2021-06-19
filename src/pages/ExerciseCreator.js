import React, { useState } from 'react';
import { Layout, Form, Input, Button, Space, InputNumber, message } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import 'antd/dist/antd.css';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import StepCreator from '../component/StepCreator';
import { UserContext } from '../context/UserContext';
import ExerciseStep from '../models/ExerciseStep';
import MainLayout from '../component/MainLayout';
import Url from '../service/url';


const ExerciseType = {
  Rest: "rest",
  Warmup: "warmup",
  Cooldown: "cooldown",
  Active: "active"
}

class ExerciseCreator extends React.Component {
  static routeName = "/training-creator"
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    let url = new URL(window.location.href);
    this.id = url.searchParams.get('id');
    this.state = {
      steps: [new ExerciseStep({ length: 10, exerciseType: ExerciseType.Warmup, title: "Đi bộ" })]
    }
  }

  async componentDidMount() {
    if (this.id) {
      await this.initExerciseData();
    }
  }

  async initExerciseData() {
    let id = this.id;
    let response = await this.context.axios({
      url: Url.TrainerExercise + "/" + id
    })
    this.setState({
      training: response.data,
      steps: response.data.steps
    });
    console.log("get exercise", response.data);
    this.formRef.current.setFieldsValue(response.data);
  }



  onFinish = form => {
    console.log('Received values of form:', form);
    form.steps = this.state.steps;
    let id = this.id;
    if (id == null || id == "") {
      this.createExercise(form)
    } else {
      this.editExercise(form, id);
    }
  };

  createExercise = async form => {
    let response = await this.context.axios({
      method: 'POST',
      url: Url.TrainerExercise,
      data: form
    })
    this.setState({
      training: response.data,
      steps: response.data.steps
    });
    console.log("get exercise", response.data);
    message.success("Tạo bài tập thành công");
    this.formRef.current.setFieldsValue(response.data);
  }

  clearTrainingState = () => {
    this.id = null
    message.info("Đã thay đổi")
  }

  editExercise = async (form, id) => {
    let response = await this.context.axios({
      method: 'PUT',
      url: Url.TrainerExercise + '/' + id,
      data: form
    })
    this.setState({
      training: response.data,
      steps: response.data.steps
    });
    console.log("get exercise", response.data);
    message.success("Sửa bài tập thành công");
    this.formRef.current.setFieldsValue(response.data);
  }



  setSteps = (steps) => {
    this.setState({ steps: steps });
  }

  render() {
    return (
      <MainLayout title="Tạo bài tập">
        {/* <a onClick={this.clearTrainingState}>Tạo bài tập mới từ bài này</a> */}
        <Form
          ref={this.formRef}
          name="training-creator"
          onFinish={this.onFinish}
          autoComplete="off"
          style={{ width: "900px", margin: "30px" }}>

          <Space style={{ display: "flex" }}>
            <div>
              <Form.Item
                name="title"
                rules={[{ required: true, message: 'Missing' }]}
                label="Tên"
                style={{ width: "300px" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                style={{ width: "300px" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="steps">
                <StepCreator setAllSteps={this.setSteps} steps={this.state.steps} />
              </Form.Item>
            </div>
          </Space>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu lại
        </Button>
          </Form.Item>
        </Form>
      </MainLayout>);
  }
}

export default ExerciseCreator;