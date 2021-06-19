import {Avatar, Badge, Button, Calendar, Card, Col, Divider, Drawer, List, message, Row, Table, Typography} from 'antd';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import MainLayout from '../component/MainLayout';
import Popup from '../component/Popup';
import {UserContext} from '../context/UserContext';
import Url from '../service/url';
import Utils from '../service/utils';
import MealProgram from './MealProgram';
import TraineeManagement from './TraineeManagement';
import TrainingProgramCreator from './TrainingProgramCreator';
import moment from "moment";
import {CheckOutlined, MinusOutlined} from "@ant-design/icons";

const {Title} = Typography;

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
    this.setState({showDrawer: false});
  }

  async showTraineeDrawer(traineeId) {
    await this.getTraineeData(traineeId);
    this.setState({showDrawer: true});
  }

  async getTraineeData(traineeId) {
    if (this.state.traineeData != null && this.state.traineeData._id == traineeId) {
      return;
    }
    let url = Url.TrainerTraineeData + "/" + traineeId;
    let response = await this.context.axios({
      url: url
    });
    this.setState({traineeData: response.data});
  }

  async deleteTrainee(traineeId) {
    let url = Url.TrainerTrainee + "/" + traineeId;
    let response = await this.context.axios({
      method: "DELETE",
      url: url
    });
    this.getCurrentTrainee();
  }

  deleteRegisteredTrainee = async (traineeId) => {
    let url = Url.TrainerRegisteredTrainee + "/" + traineeId;
    let response = await this.context.axios({
      method: "DELETE",
      url: url
    });
    this.getRegisteredTrainee();
  }

  getDateTimeString(milliseconds) {
    let date = new Date(milliseconds);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()} / ${date.getMonth() + 1}`
  }

  render() {
    return (
      <MainLayout title="Quản lý học viên">
        <Row gutter={[20, 50]} style={{marginLeft: "30px", marginRight: "30px", paddingTop: "30px"}}>
          <Col span={12}>
            <Card title="Học viên đang theo học">
              <List
                itemLayout="horizontal"
                dataSource={this.state.currentTrainee}
                pagination={{
                  pageSize: 7,
                }}
                renderItem={item => {
                  return (
                    <List.Item
                      extra={
                        <Popup
                          btnStyle={{
                            type: "primary", danger: true, icon: < MinusOutlined/>, shape: "circle"
                          }}
                          onOk={this.deleteTrainee.bind(this, item._id)}
                          title="Bạn thực sự muốn xóa học viên">
                          <Avatar src={item.avatar}/>
                          <span style={{marginLeft: "20px"}}>{item.name}</span>
                        </Popup>
                      }
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={<a onClick={this.showTraineeDrawer.bind(this, item._id)}>{item.name}</a>}
                        description={`Tham gia từ ${this.getDateTimeString(item.created)}`}
                      />
                    </List.Item>)
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Học viên đăng ký">
              <List
                itemLayout="horizontal"
                dataSource={this.state.registeredTrainee}
                pagination={{
                  pageSize: 7,
                }}
                renderItem={item => {
                  return (
                    <List.Item
                      extra={<>
                        <Popup
                          btnStyle={{
                            style: {
                              marginRight: "8px"
                            },
                            type: "primary", icon: < CheckOutlined/>, shape: "circle"
                          }}
                          onOk={this.acceptRegisteredTrainee.bind(this, item._id)}
                          title="Bạn thực sự muốn thêm học viên">
                          <Avatar src={item.avatar}/>
                          <span style={{marginLeft: "20px"}}>{item.name}</span>
                        </Popup>
                        <Popup
                          btnStyle={{
                            type: "primary", danger: true, icon: < MinusOutlined/>, shape: "circle"
                          }}
                          onOk={this.deleteRegisteredTrainee.bind(this, item._id)}
                          title="Bạn thực sự muốn xóa đăng ký của học viên">
                          <Avatar src={item.avatar}/>
                          <span style={{marginLeft: "20px"}}>{item.name}</span>
                        </Popup>
                      </>}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={<a onClick={this.showTraineeDrawer.bind(this, item._id)}>{item.name}</a>}
                        description={`Đăng ký vào ${this.getDateTimeString(item.created)}`}
                      />
                    </List.Item>)
                }}
              />
            </Card>
          </Col>
        </Row>
        <TraineeDrawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.onCloseDrawer}
          visible={this.state.showDrawer}
          userData={this.state.traineeData}
        />
      </MainLayout>
    );
  }
}

function TraineeDrawer({onClose, visible, userData}) {
  let height = userData.height / 100;
  let weight = userData.weight;
  let joiningDate = new Date(userData.joiningTime);
  let [selectedDate, setSelectedDate] = React.useState(moment());
  const getThisWeekExercise = function (date) {
    if (!userData.exerciseHistory) return [];
    let selectedWeek = date.week();
    return userData.exerciseHistory.filter(history => {
      let exerciseWeek = moment(new Date(history.time)).week();
      return exerciseWeek === selectedWeek;
    })
  }

  const getDateExercise = function (date) {
    if (!userData.exerciseHistory) return [];
    let dateNumber = date.dayOfYear();
    return userData.exerciseHistory.filter(history => {
      let exerciseHistoryDayNumber = moment(new Date(history.time)).dayOfYear();
      return exerciseHistoryDayNumber === dateNumber;
    })
  }

  return (<Drawer
    width={700}
    height={"200vh"}
    placement="right"
    closable={false}
    onClose={onClose}
    visible={visible}
  >
    <p><Avatar size={70} src={userData.avatar} style={{marginRight: "10px"}}/> {userData.name}</p>
    <Divider/>
    <p className="site-description-item-profile-p">Thông tin cá nhân</p>
    <Row>
      <Col span={12}>
        <DescriptionItem title="Họ tên" content={userData.name}/>
      </Col>
      <Col span={12}>
        <DescriptionItem title="Cân nặng" content={`${weight} kg`}/>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <DescriptionItem title="Ngày tham gia"
                         content={`${joiningDate.getDate()} /${joiningDate.getMonth() + 1}/${joiningDate.getFullYear()}`}/>
      </Col>
      <Col span={12}>
        <DescriptionItem title="Chiều cao" content={`${height} m`}/>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
      </Col>
      <Col span={12}>
        <DescriptionItem title="BMI" content={(weight / (height * height)).toFixed(2)}/>
      </Col>
    </Row>
    <Divider/>
    <Row>
      <Col span={12}>
        <p className="site-description-item-profile-p">Chương trình tập luyện tham gia:</p>
        <ol style={{paddingInlineStart: "20px"}}>
          {userData.trainingPrograms && userData.trainingPrograms.map((training => (
            <li style={{marginBottom: "5px"}}>
              <Link to={Utils.createUrlWithParams(TrainingProgramCreator.routeName, {
                trainingId: training._id
              })}>{training.title}</Link>
            </li>
          )))}
        </ol>
      </Col>
      <Col span={12}>
        <p className="site-description-item-profile-p">Chương trình dinh dưỡng tham gia:</p>
        <ol style={{paddingInlineStart: "20px"}}>
          {userData.mealPrograms && userData.mealPrograms.map((mealProgram => (
            <li style={{marginBottom: "5px"}}>
              <Link to={Utils.createUrlWithParams(MealProgram.routeName, {
                mealProgramId: mealProgram._id
              })}>{mealProgram.title}</Link>
            </li>
          )))}
        </ol>
      </Col>
    </Row>
    <Divider/>
    <p className="site-description-item-profile-p">Lịch sử tập luyện</p>
    <Row gutter={[10, 10]}>
      <Col span={12}>
        <div style={{
          height: "400px",
          border: "1px solid #f0f0f0",
          borderRadius: "2px",
        }}>
          <Calendar
            fullscreen={false}
            defaultValue={selectedDate}
            onSelect={date => {
              setSelectedDate(date);
            }}
            dateCellRender={(date) => {
              let count = getDateExercise(date).length;
              count = Math.min(count, 4);
              if (count === 0) return <div style={{
                height: "30px",
                visibility: "hidden",
              }}>
                <Badge status="success"/>
              </div>;
              let rowBadge = [];
              for (let i = 0; i < count; i++) {
                rowBadge.push(<Badge style={{width: "7px"}} status="error"/>);
              }
              return (<div style={{height: "30px"}}>
                {rowBadge}
              </div>);
            }}
          />
        </div>
      </Col>
      <Col span={12}>
        <List
          style={{marginLeft: "10px"}}
          itemLayout="horizontal"
          dataSource={getDateExercise(selectedDate)}
          pagination={{
            pageSize: 4,
          }}
          renderItem={item => {
            let time = new Date(item.time);
            let trainingLength = item.duration;
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar size={35} style={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf'
                  }}>{`${time.getDay()} / ${time.getMonth() + 1}`}</Avatar>}
                  title={<span>{item.title}</span>}
                  description={`${Utils.timeToString(trainingLength)}`}
                />
              </List.Item>)
          }}/>
      </Col>
    </Row>

  </Drawer>)
}

const DescriptionItem = ({title, content}) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

export default TraineeOverview;