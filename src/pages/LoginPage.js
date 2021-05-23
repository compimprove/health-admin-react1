import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import React from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import TrainerRegisterPage from './TrainerRegisterPage';
const { Header, Footer, Sider, Content } = Layout;


function _LoginPage({ login }) {
  const onFinish = (values) => {
    login(values);
  };

  const onFinishFailed = (errorInfo) => {

    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh", width: "100%" }}>
        <Header>Đăng nhập</Header>
        <Content>
          <Card style={{ width: "400px", marginLeft: "auto", marginRight: "auto", marginTop: "50px" }} title="Đăng nhập">
            <Form
              style={{ width: "300px" }}
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập email của bạn!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập mật khẩu của bạn!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Nhớ mật khẩu của tôi</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button style={{ marginRight: "20px", marginBottom: "10px" }} type="primary" htmlType="submit" className="login-form-button">
                  Đăng nhập
                </Button>
                <br />
                  Hoặc <Link to={TrainerRegisterPage.routeName}>đăng ký trở thành huấn luyện viên</Link>
              </Form.Item>
            </Form>

          </Card>
        </Content>
        <Footer></Footer>
      </Layout>
    </>
  );
};

const LoginPage = function () {
  return <UserContext.Consumer>
    {context => <_LoginPage login={context.login} />}
  </UserContext.Consumer>
}
LoginPage.routeName = "/login";

export default LoginPage;

