import { Button, Input, InputNumber, Steps, Form, message, Radio, Space, Divider, Upload, Row } from "antd";
import React, { useState } from 'react';
import ExerciseStep from "../models/ExerciseStep";
import { LogUtils } from "../service/logUtils";
import { UploadOutlined } from '@ant-design/icons';

const { Step } = Steps;
const ExerciseType = {
  Rest: "rest",
  Warmup: "warmup",
  Cooldown: "cooldown",
  Active: "active"
}

const StepCreator = ({ setAllSteps }) => {
  let [currentStep, setCurrent] = React.useState(0);
  let [steps, _setSteps] = useState([new ExerciseStep({ length: 10, type: ExerciseType.Warmup })]);
  let [uploadType, setUploadType] = React.useState(true);
  const setSteps = function (newStep) {
    _setSteps(newStep);
    setAllSteps(newStep);
  }
  const addEmptyStep = () => {
    let newStep = [...steps,
    new ExerciseStep({ length: 5, type: ExerciseType.Active })
    ];
    setSteps(newStep);
    setCurrent(newStep.length - 1);
  }

  const getCurrentLength = () => {
    let result = 0
    if (steps[currentStep]) {
      result = steps[currentStep].length;
    }
    LogUtils.log("getCurrentLength", result);
    return result;
  }

  const setCurrentType = (e) => {
    let value = e.target.value;
    let newSteps = [...steps];
    if (newSteps[currentStep] != null) {
      LogUtils.log("setCurrentType", value);
      newSteps[currentStep].type = value;
      setSteps(newSteps);
    } else {
      message.error("Chọn bước muốn chỉnh sửa");
      LogUtils.error("setCurrentType", value);
    }
  }

  const setCurrentLength = (value) => {
    let newSteps = [...steps];
    if (newSteps[currentStep] != null) {
      LogUtils.log("setCurrentLength", value);
      newSteps[currentStep].length = value
      setSteps(newSteps);
    } else {
      message.error("Chọn bước muốn chỉnh sửa");
      LogUtils.error("setCurrentLength", value);
    }
  }

  const setCurrentDescription = (e) => {
    let value = e.target.value;
    LogUtils.log("setCurrentLength", value);
    let newSteps = [...steps];
    if (newSteps[currentStep] != null) {
      newSteps[currentStep].description = value;
      setSteps(newSteps);
    } else {
      message.error("Chọn bước muốn chỉnh sửa");
      LogUtils.error("setCurrentDescription", value);
    }
  }

  const getCurrentType = () => {
    let result = 0;
    if (steps[currentStep]) {
      result = steps[currentStep].type;
    }
    LogUtils.log("getCurrentType", result)
    return result;
  }

  const getCurrentDescription = () => {
    let result = "";
    if (steps[currentStep]) {
      result = steps[currentStep].description;
    }
    LogUtils.log("getCurrentDescription", result)
    return result;
  }

  const onUploadFile = ({ file, fileList, event }) => {
    LogUtils.log("onUploadFile state change");
    LogUtils.log(file, fileList, event);
  }

  const setStep = (index, value) => {
    steps[index] = value;
    setSteps(
      [...steps]);
  }
  const next = () => {
    setCurrent(currentStep + 1);
  };

  const prev = () => {
    LogUtils.log("go prev: ", currentStep - 1);
    setCurrent(currentStep - 1);
  };

  const deleteStep = () => {
    let newSteps = steps.filter((value, index) => index != currentStep);
    setSteps(newSteps);
  }

  const onChange = current => {
    LogUtils.log('setCurrent:', current);
    setCurrent(current);
  };

  const options = [
    { label: 'Nghỉ', value: 'rest' },
    { label: 'Tập luyện', value: 'active' },
    { label: 'Khởi động', value: 'warmup' },
    { label: 'Cooldown', value: 'cooldown' }
  ];

  const findTypeTitle = function (type) {
    let result = options.find(value => value.value == type);
    if (result != null) return result.label;
    return "Loại không rõ";
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
        <Steps className="steps-title" current={currentStep} onChange={onChange} direction="vertical">
          {steps.length > 0 && steps.map((item, index) => (
            <Step key={index} title={findTypeTitle(item.type) + " " + item.length + " phút"} />
          ))}
        </Steps>
        <div className="steps-content">
          <Radio.Group
            options={options}
            onChange={setCurrentType}
            value={getCurrentType()}
            optionType="button"
            buttonStyle="solid"
          />
          <Divider orientation="left">Thời lượng</Divider>
          <Row align="middle">
            <InputNumber value={getCurrentLength()} onChange={setCurrentLength} />
            <span style={{ marginLeft: 10 }}>Phút</span>
          </Row>
          <Divider orientation="left">Mô tả</Divider>
          <Input.TextArea autoSize allowClear value={getCurrentDescription()} onChange={setCurrentDescription} />
          <Divider orientation="left">Video hướng dẫn</Divider>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            maxCount={1}
            onChange={onUploadFile}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
          <Input disabled={uploadType} placeholder="Link video" style={{ marginTop: 10 }} />
        </div>
      </div>
      {steps.length > 0 && <div className="steps-action">
        <Button type="primary" onClick={addEmptyStep}>
          Thêm bước
          </Button>
        <Button danger style={{ marginLeft: 10 }} onClick={deleteStep}>
          Xóa bước
          </Button>
      </div>}
      {steps.length == 0 && <div>
        <Button type="primary" onClick={() => addEmptyStep()}>
          Thêm bước
          </Button>
      </div>}
    </>
  );
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const StepForm = function ({ index, initialStep = {}, setStep }) {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  console.log("StepForm initialStep:", initialStep);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  let [type, setType] = useState(initialStep.type);
  let [length, setLength] = useState(initialStep.length);

  return (
    <>

      <Form.Item {...tailLayout}>
        <Button type="primary">
          Submit
        </Button>
      </Form.Item>
    </>);
}



export default StepCreator;