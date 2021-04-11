import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Form, Input, Button, Space, InputNumber, Select, Radio, Steps, Divider, message } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import 'antd/dist/antd.css';
import AppSiderBar from '../component/Sider';
import RouteDefine from '../route_define';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import StepCreator from '../component/StepCreator';
import { LogUtils } from '../service/logUtils';

class TrainingCreator extends React.Component {
  state = {

  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, color: "white" }}>Training Creator</Header>
          <TrainingCreatorForm />
        </Layout>
      </Layout>);
  }
}


const TrainingCreatorForm = () => {
  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  let [steps, setSteps] = useState();

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

const StepInput = function () {
  let { type, setType } = useState("rest");
  const onChangeType = (e) => {
    setType({ type: e.target.value });
  }
  const onFinish = values => {
    console.log('Received values StepInput:', values);
  };
  let typeOptions = [
    { label: "Nghỉ giữa chừng", value: "rest" },
    { label: "Tập", value: "active" },
  ]

  return (
    <Form onFinish={onFinish} name="step-input" autoComplete="off" style={{ width: "600px", margin: "30px" }}>
      <Form.List name="steps">
        {(fields, { add, remove }) => (
          <Space style={{ display: "flex" }} >
            <div>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <>
                  <Form.Item
                    {...restField}
                    name={[name, 'types']}
                    fieldKey={[fieldKey, 'types']}
                    label="Loại"
                    rules={[
                      {
                        required: true,
                        message: 'Hãy chọn loại bài tập',
                      },
                    ]}>
                    <Radio.Group
                      value={type}
                      onChange={onChangeType}
                      optionType="button"
                      buttonStyle="solid"
                      options={typeOptions}>
                    </Radio.Group>
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
                  {type == "active" &&
                    <>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        fieldKey={[fieldKey, 'description']}
                      >
                        <Input placeholder="Mô tả" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'videoUrl']}
                        fieldKey={[fieldKey, 'videoUrl']}
                      >
                        <Input placeholder="Video Link" />
                      </Form.Item>
                    </>}
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Thêm các bước tập
            </Button>
              </Form.Item>
            </div>
          </Space>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
      </Button>
      </Form.Item>
    </Form>
  );
}



export default TrainingCreator;