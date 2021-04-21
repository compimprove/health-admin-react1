import React, { useState } from 'react';
import { Layout, Form, Input, Button, Space, InputNumber, message } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import 'antd/dist/antd.css';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import StepCreator from '../component/StepCreator';
import { LogUtils } from '../service/logUtils';
import { UserContext } from '../context/UserContext';

class TrainingCreator extends React.Component {
  static routeName = "/training-creator"
  static contextType = UserContext;
  state = {

  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ color: "white" }}>Training Creator</Header>
          <TrainingCreatorForm />
        </Layout>
      </Layout>);
  }
}


const TrainingCreatorForm = () => {
  let [steps, setSteps] = useState();

  const onFinish = values => {
    values.steps = steps;
    console.log('Received values of form:', values);
  };

  let saveStep = function (params) {
    message.success("Đã lưu");
    LogUtils.log(steps);
  }

  return (
    <Form name="training-creator" onFinish={onFinish} autoComplete="off" style={{ width: "900px", margin: "30px" }}>
      <Form.List name="training">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space style={{ display: "flex" }} key={key} >
                <div>
                  < hr />
                  <Form.Item
                    {...restField}
                    name={[name, 'first']}
                    fieldKey={[fieldKey, 'first']}
                    rules={[{ required: true, message: 'Missing' }]}
                    label="Mô tả"
                    style={{ width: "300px" }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'length']}
                    fieldKey={[fieldKey, 'length']}
                    rules={[{ required: true, message: 'Missing' }]}
                    label="Thời lượng (phút)"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'steps']}
                    fieldKey={[fieldKey, 'steps']}
                    label="Các bước"
                  >
                    <StepCreator setAllSteps={setSteps} />
                  </Form.Item>
                </div>
                <div>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20 }} />
                  <SaveOutlined onClick={saveStep} style={{ marginLeft: 20 }} />
                </div>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Thêm bài tập
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu lại
        </Button>
      </Form.Item>
    </Form>
  );
};



export default TrainingCreator;