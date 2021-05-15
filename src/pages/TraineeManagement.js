import { Avatar, Col, Row } from 'antd';
import React, { Component } from 'react';
import MainLayout from '../component/MainLayout';
import { UserContext } from '../context/UserContext';
import Url from '../service/url';

class TraineeManagement extends Component {
  static routeName = "/trainee-management";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    let url = new URL(window.location.href);
    this.traineeId = url.searchParams.get('traineeId');
    this.state = {
      traineeData: null
    }
  }

  componentDidMount() {
    if (this.traineeId != null) {
      this.getTraineeData(this.traineeId);
    }
  }

  getTraineeData = async (traineeId) => {
    let url = Url.TrainerTraineeData + "/" + traineeId;
    let response = await this.context.axios({
      url: url
    });
    this.setState({ traineeData: response.data });
  }

  render() {
    if (this.state.traineeData == null) {
      return <MainLayout></MainLayout>;
    }
    let height = this.state.traineeData.height / 100;
    let weight = this.state.traineeData.weight;
    let joiningDate = new Date(this.state.traineeData.joiningTime);
    return (
      <Row gutter={[70, 50]} style={{ margin: "0 10px", paddingTop: "30px" }}>
        <Col span={12}>
          <div><Avatar src={this.state.traineeData.avatar} /></div>
          <div><span>Cân nặng {weight} kg</span></div>
          <div><span>Chiều cao {height} m</span></div>
          <div><span>BMI {(weight / (height * height)).toFixed(2)}</span></div>
          <div>{`Ngày tham gia ${joiningDate.getDate()}/${joiningDate.getMonth() + 1}/${joiningDate.getFullYear()}`}</div>
        </Col>
        <Col span={12}>

        </Col>
      </Row>
    );
  }
}

export default TraineeManagement;