import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import React from 'react';
import { UserContext } from '../context/UserContext';
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
        <Header>Login</Header>
        <Content>
          <Card style={{ width: "400px", marginLeft: "auto", marginRight: "auto", marginTop: "50px" }} title="Login">
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
                    message: 'Please input your Username!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button style={{ marginRight: "20px" }} type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
                  Or <a href="">register now!</a>
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

