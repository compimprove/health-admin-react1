import { Button, Input, InputNumber, Steps, Form, message, Radio, Space, Divider, Upload, Row } from "antd";
import React, { useState } from 'react';
import ExerciseStep from "../models/ExerciseStep";
import { LogUtils } from "../service/logUtils";
import { UploadOutlined } from '@ant-design/icons';
import { ExerciseType } from "../models/EnumDefine";
import Utils from "../service/utils";
import Url from "../service/url";

const { Step } = Steps;

const StepCreator = ({ setAllSteps, steps }) => {
  let [currentStep, setCurrent] = React.useState(0);
  let [uploadType, setUploadType] = React.useState(true);
  const setSteps = setAllSteps

  const addEmptyStep = () => {
    let newStep = [...steps,
    new ExerciseStep({ length: 5, exerciseType: ExerciseType.Active, title: "Đi bộ" })
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

  const getCurrentTitle = () => {
    let result = "";
    if (steps[currentStep]) {
      result = steps[currentStep].title;
    }
    LogUtils.log("getCurrentTitle", result);
    return result;
  }

  const setCurrentType = (e) => {
    let value = e.target.value;
    let newSteps = [...steps];
    if (newSteps[currentStep] != null) {
      LogUtils.log("setCurrentType", value);
      newSteps[currentStep].exerciseType = value;
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

  const setCurrentTitle = (e) => {
    let value = e.target.value
    let newSteps = [...steps];
    if (newSteps[currentStep] != null) {
      LogUtils.log("setCurrentTitle", value);
      newSteps[currentStep].title = value
      setSteps(newSteps);
    } else {
      message.error("Chọn bước muốn chỉnh sửa");
      LogUtils.error("setCurrentTitle", value);
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
      result = steps[currentStep].exerciseType;
    }
    LogUtils.log("getCurrentType", result)
    return result;
  }

  const saveCurrentStepVideoUrl = e => {
    let newSteps = [...steps];
    if (newSteps[currentStep] != null) {
      newSteps[currentStep].videoUrl = e.target.value;
      setSteps(newSteps);
    } else {
      LogUtils.error("onUploadVideo", value);
    }
  }

  const getCurrentDescription = () => {
    let result = "";
    if (steps[currentStep]) {
      result = steps[currentStep].description;
    }
    LogUtils.log("getCurrentDescription", result)
    return result;
  }

  const onUploadVideo = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      let newSteps = [...steps];
      if (newSteps[currentStep] != null) {
        newSteps[currentStep].videoUrl = info.file.response.url;
        setSteps(newSteps);
      } else {
        LogUtils.error("onUploadVideo", value);
      }
    }
  };

  const getCurrentVideoUrl = () => {
    let result = "";
    if (steps[currentStep]) {
      result = steps[currentStep].videoUrl || "";
    }
    LogUtils.log("getCurrentVideoUrl", result)
    return result;
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
    { label: 'Giãn cơ', value: 'cooldown' }
  ];

  const findTypeTitle = function (type) {
    let result = options.find(value => value.value == type);
    if (result != null) return result.label;
    return "Loại không rõ";
  }
  let exerciseTimeString = steps == null ? 0
    : Utils.timeToString(steps.reduce((previous, current) => (previous + current.length), 0));
  console.log(exerciseTimeString);
  return (
    <>
      <div>Thời lượng <span>{exerciseTimeString}</span></div>
      <div><span>Các bước: </span></div>
      <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
        <Steps className="steps-title" current={currentStep} onChange={onChange} direction="vertical">
          {steps.length > 0 && steps.map((item, index) => (
            <Step key={index} title={findTypeTitle(item.exerciseType) + ": " + steps[index].title + " " + Utils.timeToString(item.length)} />
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
          <Divider orientation="left">Tiêu đề</Divider>
          <Row align="middle">
            <Input value={getCurrentTitle()} onChange={setCurrentTitle} />
          </Row>
          <Divider orientation="left">Thời lượng</Divider>
          <Row align="middle">
            <InputNumber value={getCurrentLength()} onChange={setCurrentLength} />
            <span style={{ marginLeft: 10 }}>Giây</span>
          </Row>
          <Divider orientation="left">Mô tả</Divider>
          <Input.TextArea autoSize={{ minRows: 3 }} allowClear value={getCurrentDescription()} onChange={setCurrentDescription} />
          <Divider orientation="left">Video hướng dẫn</Divider>
          <Upload
            name="video"
            listType="picture"
            maxCount={1}
            action={Url.ExerciseVideo}
            onChange={onUploadVideo}
            beforeUpload={file => {
              if (file.type !== 'video/mp4') {
                message.error(`${file.name} is not a video mp4 file`);
              }
              return file.type === 'video/mp4' ? true : Upload.LIST_IGNORE;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
          <Input value={getCurrentVideoUrl()} placeholder="Link video" style={{ marginTop: 10, marginBottom: 30 }} onChange={saveCurrentStepVideoUrl} />
          {getCurrentVideoUrl() != null
            && getCurrentVideoUrl() != ""
            && <video style={{ width: 500 }} controls src={getCurrentVideoUrl()} />}
          {getCurrentVideoUrl() == null
            || getCurrentVideoUrl() == ""
            && <span>Không có video</span>}
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

  let [type, setType] = useState(initialStep.exerciseType);
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