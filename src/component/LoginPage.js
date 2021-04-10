import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Provider, connect } from 'react-redux';
import { login } from '../redux/actions';
import { Form, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


function LoginPage({ login }) {
  const onFinish = (values) => {
    // values.router = router;
    login(values);
  };

  const onFinishFailed = (errorInfo) => {

    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>Login</Header>
        <Content style={{ width: "100%" }}>
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
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
        </Button>
        Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </Content>
        <Footer></Footer>
      </Layout>
    </>
  );
};

export default connect(
  null,
  { login }
)(LoginPage)