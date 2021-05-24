import React, { useState } from 'react';
import {
  Form,
  Input,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Layout,
  DatePicker,
  Collapse,
  Typography,
  message
} from 'antd';
import 'antd/dist/antd.css';
import MainLayout from '../component/MainLayout';
import { Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import axios from 'axios';
import Url from '../service/url';
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class TrainerRegisterPage extends React.Component {
  static routeName = "/trainer-register";
  formRef = React.createRef();

  componentDidMount() {
    if (process.env.REACT_APP_IS_DEVELOPMENT == "true") {
      this.formRef.current.setFieldsValue({
        name: "DinhNT",
        email: "dinh@gmail.com",
        password: "12345678",
        confirm: "12345678",
        phone: "12345678",
        height: 167,
        weight: 57,
        experience: "Many experiences"
      })
    }
  }

  onFinish = async (form) => {
    form.birthDayTime = form.birthday.valueOf();
    console.log(form);
    try {
      let res = await axios.post(Url.UserRegister, form);
      if (res.status == 200) {
        message.success("Đăng ký thành công");
        setTimeout(() =>{
          window.location.pathname = LoginPage.routeName;
        }, 1000);
      } else {
        message.error("Đăng ký lỗi");
      }
    } catch (error) {
      message.error("Đăng ký lỗi");
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", marginTop: "15px" }}><Title level={3} style={{ color: "white" }}>Đăng ký trở thành huấn luyện viên</Title></div>
          </Header>
          <Content>
            <Row style={{ marginTop: "25px" }}>
              <Col offset={6} span={12}>
                <Form
                  ref={this.formRef}
                  {...formItemLayout}
                  name="register"
                  onFinish={this.onFinish}
                  scrollToFirstError
                >
                  <Form.Item
                    name="name"
                    label="Tên của bạn"
                    rules={[
                      {
                        required: true,
                        message: 'Hãy nhập email của bạn!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: 'email',
                        message: 'Bạn không nhập đúng email',
                      },
                      {
                        required: true,
                        message: 'Hãy nhập email của bạn!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: 'Hãy nhập mật khẩu của bạn!',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm mật khẩu"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Hãy nhập lại mật khẩu của bạn!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Hãy nhập số điện thoại của bạn!' }]}
                  >
                    <Input style={{ width: '100%' }} />
                  </Form.Item>

                  {/* <Form.Item
                    name="fbLink"
                    label="Facebook của bạn"
                  >
                    <Input style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name="igLink"
                    label="Instagram của bạn"
                  >
                    <Input style={{ width: '100%' }} />
                  </Form.Item> */}

                  <Form.Item
                    label="Ngày sinh của bạn"
                    name="birthday"
                    rules={[{ required: true, message: 'Hãy nhập ngày sinh của bạn!' }]}
                  >
                    <DatePicker />
                  </Form.Item>

                  <Row>
                    <Col flex="125px"></Col>
                    <Col span={9}>
                      <Form.Item
                        labelCol={14}
                        label="Chiều cao"
                        name="height"
                        rules={[{ required: true, message: 'Hãy nhập chiều cao của bạn!' }]}
                      >
                        <Input addonAfter="cm" />
                      </Form.Item>

                    </Col>
                    <Col span={1}>

                    </Col>
                    <Col span={9}>
                      <Form.Item
                        labelCol={12}
                        label="Cân nặng"
                        name="weight"
                        rules={[{ required: true, message: 'Hãy nhập cân nặng của bạn!' }]}
                      >
                        <Input addonAfter="kg" />
                      </Form.Item>

                    </Col>
                  </Row>

                  <Form.Item
                    label="Kinh nghiệm cá nhân"
                    name="experience"
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Row></Row>
                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "20px" }}>
                      Đăng ký
                    </Button>
                    Đã có tài khoản <Link to={LoginPage.routeName}>Đăng nhập ngay</Link>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>);
  }
}

export default TrainerRegisterPage;