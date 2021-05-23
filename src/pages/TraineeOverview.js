import { Avatar, Button, Col, Divider, Drawer, List, Row, Table, Typography } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../component/MainLayout';
import Popup from '../component/Popup';
import { UserContext } from '../context/UserContext';
import Url from '../service/url';
import Utils from '../service/utils';
import MealProgram from './MealProgram';
import TraineeManagement from './TraineeManagement';
import TrainingProgramCreator from './TrainingProgramCreator';
const { Title } = Typography;

class TraineeOverview extends Component {
  static routeName = "/trainee-overview";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      currentTrainee: [],
      registeredTrainee: [],
      traineeData: {},
      showDrawer: false
    }
  }


  componentDidMount() {
    this.getCurrentTrainee();
    this.getRegisteredTrainee();
  }

  getCurrentTrainee = async () => {
    let response = await this.context.axios({
      url: Url.TrainerCurrentTrainee
    })
    let currentTrainee = response.data;
    currentTrainee.sort(function (trainee1, trainee2) {
      return trainee2.created - trainee1.created;
    });
    this.setState({
      currentTrainee
    })
  }

  getRegisteredTrainee = async () => {
    let response = await this.context.axios({
      url: Url.TrainerRegisteredTrainee
    })
    let registeredTrainee = response.data;
    registeredTrainee.sort(function (trainee1, trainee2) {
      return trainee2.created - trainee1.created;
    });
    this.setState({
      registeredTrainee
    })
  }

  async acceptRegisteredTrainee(traineeId) {
    await this.context.axios({
      method: 'POST',
      url: Url.TrainerRegisteredTrainee + '/' + traineeId,
    });
    this.getCurrentTrainee();
    this.getRegisteredTrainee();
  }

  onCloseDrawer = () => {
    this.setState({ showDrawer: false });
  }

  async showTraineeDrawer(traineeId) {
    await this.getTraineeData(traineeId);
    this.setState({ showDrawer: true });
  }

  getTraineeData = async (traineeId) => {
    if (this.state.traineeData != null && this.state.traineeData._id == traineeId) {
      return;
    }
    let url = Url.TrainerTraineeData + "/" + traineeId;
    let response = await this.context.axios({
      url: url
    });
    this.setState({ traineeData: response.data });
  }

  getDateTimeString(milliseconds) {
    let date = new Date(milliseconds);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()} / ${date.getMonth() + 1}`
  }

  render() {
    return (
      <MainLayout title="Quản lý học viên">
        <Row gutter={[100, 50]} style={{ marginLeft: "30px", marginRight: "30px", paddingTop: "30px" }}>
          <Col span={12}>
            <Title level={3}>Học viên đang theo học</Title>
            <List
              itemLayout="horizontal"
              dataSource={this.state.currentTrainee}
              pagination={{
                pageSize: 7,
              }}
              renderItem={item => {

                return (
                  <List.Item
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a onClick={this.showTraineeDrawer.bind(this, item._id)} >{item.name}</a>}
                      description={`Tham gia từ ${this.getDateTimeString(item.created)}`}
                    />
                  </List.Item>)
              }}
            />
          </Col>
          <Col span={12}>
            <Title level={3}>Học viên đăng ký</Title>
            <List
              itemLayout="horizontal"
              dataSource={this.state.registeredTrainee}
              pagination={{
                pageSize: 7,
              }}
              renderItem={item => {
                return (
                  <List.Item
                    extra={<Popup
                      btnContent="Chấp nhận"
                      onOk={this.acceptRegisteredTrainee.bind(this, item._id)}
                      title="Bạn thực sự muốn thêm học viên">
                      <Avatar src={item.avatar} />
                      <span style={{ marginLeft: "20px" }}>{item.name}</span>
                    </Popup>}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a onClick={this.showTraineeDrawer.bind(this, item._id)} >{item.name}</a>}
                      description={`Đăng ký vào ${this.getDateTimeString(item.created)}`}
                    />
                  </List.Item>)
              }}
            />
          </Col>
        </Row>
        <TraineeDrawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.onCloseDrawer}
          visible={this.state.showDrawer}
          userData={this.state.traineeData}
        ></TraineeDrawer>
      </MainLayout>
    );
  }
}

function TraineeDrawer({ onClose, visible, userData }) {
  let height = userData.height / 100;
  let weight = userData.weight;
  let joiningDate = new Date(userData.joiningTime);
  return (<Drawer
    width={640}
    height={"200vh"}
    placement="right"
    closable={false}
    onClose={onClose}
    visible={visible}
  >
    <p><Avatar size={70} src={userData.avatar} style={{ marginRight: "10px" }} /> {userData.name}</p>
    <Divider />
    <p className="site-description-item-profile-p">Thông tin cá nhân</p>
    <Row>
      <Col span={12}>
        <DescriptionItem title="Họ tên" content={userData.name} />
      </Col>
      <Col span={12}>
        <DescriptionItem title="Cân nặng" content={`${weight} kg`} />
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <DescriptionItem title="Ngày tham gia" content={`${joiningDate.getDate()} /${joiningDate.getMonth() + 1}/${joiningDate.getFullYear()}`} />
      </Col>
      <Col span={12}>
        <DescriptionItem title="Chiều cao" content={`${height} m`} />
      </Col>
    </Row>
    <Row>
      <Col span={12}>
      </Col>
      <Col span={12}>
        <DescriptionItem title="BMI" content={(weight / (height * height)).toFixed(2)} />
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span={12}>
        <p className="site-description-item-profile-p">Chương trình tập luyện tham gia:</p>
        <ol style={{ paddingInlineStart: "20px" }}>
          {userData.trainingPrograms && userData.trainingPrograms.map((training => (
            <li style={{ marginBottom: "5px" }}>
              <Link to={Utils.createUrlWithParams(TrainingProgramCreator.routeName, {
                trainingId: training._id
              })}>{training.title}</Link>
            </li>
          )))}
        </ol>
      </Col>
      <Col span={12}>
        <p className="site-description-item-profile-p">Chương trình dinh dưỡng tham gia:</p>
        <ol style={{ paddingInlineStart: "20px" }}>
          {userData.mealPrograms && userData.mealPrograms.map((mealProgram => (
            <li style={{ marginBottom: "5px" }}>
              <Link to={Utils.createUrlWithParams(MealProgram.routeName, {
                mealProgramId: mealProgram._id
              })}>{mealProgram.title}</Link>
            </li>
          )))}
        </ol>
      </Col>
    </Row>
    <Divider />
    <p className="site-description-item-profile-p">Lịch sử tập luyện</p>
    <List
      style={{ marginLeft: "10px" }}
      itemLayout="horizontal"
      dataSource={userData.exerciseHistory}
      renderItem={item => {
        let time = new Date(item.time);
        let trainingLength = item.duration;
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={35} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{`${time.getDay()} / ${time.getMonth() + 1}`}</Avatar>}
              title={<span>{item.title}</span>}
              description={`${Utils.timeToString(trainingLength)}`}
            />
          </List.Item>)
      }} />
  </Drawer >)
}

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

export default TraineeOverview;