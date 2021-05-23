import { Avatar, Button, Col, Divider, Drawer, List, Row } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../component/MainLayout';
import { UserContext } from '../context/UserContext';
import UserData from '../models/User';
import Url from '../service/url';
import Utils from '../service/utils';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined, CheckOutlined, MinusOutlined } from '@ant-design/icons';
import Popup from '../component/Popup';
import RoleManagement from '../component/RoleManagement';


class UserManagement extends Component {
  static routeName = "/user-management";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userData: {},
      trainerData: {},
      showUserDrawer: false,
      showTrainerDrawer: false
    };
  }

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = async () => {
    let res = await this.context.axios({
      url: Url.AdminUser
    })
    let users = res.data;
    let roles = Object.values(UserData.Role);
    users.sort((user1, user2) => {
      return roles.indexOf(user1.role) - roles.indexOf(user2.role);
    })
    this.setState({ users });
  }

  async onOpenUserDrawer(userId) {
    let url = Url.AdminUser + '/' + userId;
    let res = await this.context.axios({ url });
    this.setState({
      userData: res.data,
      showUserDrawer: true
    });
  }

  async onOpenTrainerDrawer(trainerId) {
    let url = Url.AdminTrainer + '/' + trainerId;
    let res = await this.context.axios({ url });
    this.setState({
      trainerData: res.data,
      showTrainerDrawer: true
    });
  }

  onCloseUserDrawer = () => {
    this.setState({ showUserDrawer: false });
  }

  onCloseTrainerDrawer = () => {
    this.setState({ showTrainerDrawer: false });
  }

  async acceptRegister(trainerId, userId) {
    console.log(trainerId, this.state.trainerData._id, userId);
    await this.context.axios({
      method: 'POST',
      url: Url.AdminUserTrainerRegister,
      data: { trainerId, userId }
    });
    let url = Url.AdminTrainer + '/' + trainerId;
    let res = await this.context.axios({ url });
    this.setState({
      trainerData: res.data
    });
  }

  async deleteUserTrainer(trainerId, userId) {
    await this.context.axios({
      method: 'DELETE',
      url: Url.AdminUserTrainer,
      data: { trainerId, userId }
    });
    let url = Url.AdminTrainer + '/' + trainerId;
    let res = await this.context.axios({ url });
    this.setState({
      trainerData: res.data
    });

  }

  async deleteRegister(trainerId, userId) {
    await this.context.axios({
      method: 'DELETE',
      url: Url.AdminUserTrainerRegister,
      data: { trainerId, userId }
    });
    let url = Url.AdminTrainer + '/' + trainerId;
    let res = await this.context.axios({ url });
    this.setState({
      trainerData: res.data
    });
  }

  async deleteUser(userId) {
    await this.context.axios({
      method: 'DELETE',
      url: Url.AdminUser + '/' + userId,
    });
    this.getUsersData();
  }

  render() {
    return (
      <MainLayout title="Quản lý người dùng">
        <Row gutter={[70, 50]} style={{ marginLeft: "10px", marginRight: "10px", paddingTop: "30px" }}>
          <Col span={12}>
            <List
              itemLayout="horizontal"
              dataSource={this.state.users}
              pagination={{
                pageSize: 7,
              }}
              renderItem={item => {
                let title;
                if (item.role == UserData.Role.User) {
                  title = <a onClick={this.onOpenUserDrawer.bind(this, item._id)}>{item.name}</a>
                } else if (item.role == UserData.Role.Trainer) {
                  title = <a onClick={this.onOpenTrainerDrawer.bind(this, item._id)}>{item.name}</a>
                }
                return (<List.Item
                  extra={<Popup
                    title="Xóa User"
                    btnStyle={{
                      type: "primary", danger: true, icon: < MinusOutlined />, shape: "circle"
                    }}
                    onOk={this.deleteUser.bind(this, item._id)}
                  >
                    <div>{`Bạn chắc chắn muốn xóa user ${item.name}`}</div>
                  </Popup>} >

                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={title}
                    description={`Tham gia vào ${Utils.getDateTimeString(item.created)}`}
                  />
                </List.Item>)
              }}
            />
          </Col>
        </Row>
        <UserDrawer
          getUsersData={this.getUsersData}
          onClose={this.onCloseUserDrawer}
          visible={this.state.showUserDrawer}
          userData={this.state.userData}
        >
        </UserDrawer>
        <TrainerDrawer
          getUsersData={this.getUsersData}
          onClose={this.onCloseTrainerDrawer}
          visible={this.state.showTrainerDrawer}
          trainerData={this.state.trainerData}
          deleteRegister={this.deleteRegister.bind(this)}
          acceptRegister={this.acceptRegister.bind(this)}
          deleteUserTrainer={this.deleteUserTrainer.bind(this)}>
        </TrainerDrawer>
      </MainLayout>
    );
  }
}


function UserDrawer({ getUsersData, onClose, visible, userData }) {
  let height, weight, joiningDate;
  if (userData != null) {
    height = userData.height / 100;
    weight = userData.weight;
    joiningDate = new Date(userData.created);
  }
  return (<Drawer
    width={640}
    placement="right"
    closable={false}
    onClose={onClose}
    visible={visible}
  >
    {userData != null &&
      <>
        <Row>
          <Col span={12}>
            <p><Avatar size={70} src={userData.avatar} style={{ marginRight: "10px" }} /> {userData.name}</p>
          </Col>
          <Col span={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <RoleManagement getUsersData={getUsersData} userData={userData} />
          </Col>
        </Row>
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
            <DescriptionItem title="Email" content={`${userData.email}`} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Chiều cao" content={`${height} m`} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Ngày tham gia" content={`${joiningDate.getDate()} /${joiningDate.getMonth() + 1}/${joiningDate.getFullYear()}`} />
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
                  {training.title}
                </li>
              )))}
            </ol>
          </Col>
          <Col span={12}>
            <p className="site-description-item-profile-p">Chương trình dinh dưỡng tham gia:</p>
            <ol style={{ paddingInlineStart: "20px" }}>
              {userData.mealPrograms && userData.mealPrograms.map((mealProgram => (
                <li key={mealProgram._id} style={{ marginBottom: "5px" }}>
                  {mealProgram.title}
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
              <List.Item key={item._id} >
                <List.Item.Meta
                  avatar={<Avatar size={35} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{`${time.getDay()} / ${time.getMonth() + 1}`}</Avatar>}
                  title={<span>{item.title}</span>}
                  description={`${Utils.timeToString(trainingLength)}`}
                />
              </List.Item>)
          }} />
      </>
    }
  </Drawer >)
}

function TrainerDrawer({ getUsersData, onClose, visible, trainerData, deleteRegister, acceptRegister, deleteUserTrainer }) {
  let joiningDate
  if (trainerData != null) {
    joiningDate = new Date(trainerData.created);
  }
  return (<Drawer
    width={640}
    height={"200vh"}
    placement="right"
    closable={false}
    onClose={onClose}
    visible={visible}
  >
    {trainerData != null &&
      <>
        <Row gutter={[20, 20]} >
          <Col span={12}>
            <p><Avatar size={70} src={trainerData.avatar} style={{ marginRight: "10px" }} /> {trainerData.name}</p>
          </Col>
          <Col span={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <RoleManagement getUsersData={getUsersData} userData={trainerData} />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Thông tin cá nhân</p>
        <Row gutter={[20, 20]} >
          <Col span={12}>
            <DescriptionItem title="Họ tên" content={trainerData.name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Ngày tham gia" content={`${joiningDate.getDate()} /${joiningDate.getMonth() + 1}/${joiningDate.getFullYear()}`} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content={`${trainerData.email}`} />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[20, 30]} >
          <Col span={12}>
            <p className="site-description-item-profile-p">Chương trình tập luyện của {trainerData.name}:</p>
            <List
              style={{ marginRight: "20px" }}
              itemLayout="horizontal"
              dataSource={trainerData.trainingPrograms}
              renderItem={item => {
                return (
                  <List.Item key={item._id} >
                    <List.Item.Meta
                      avatar={<Avatar size={35} src={item.imageUrl}></Avatar>}
                      title={<span>{item.title}</span>}
                    />
                  </List.Item>)
              }} />
          </Col>
          <Col span={12}>
            <p className="site-description-item-profile-p">Chương trình dinh dưỡng của {trainerData.name}:</p>
            <List
              style={{ marginRight: "20px" }}
              itemLayout="horizontal"
              dataSource={trainerData.mealPrograms}
              renderItem={item => {
                return (
                  <List.Item key={item._id} >
                    <List.Item.Meta
                      avatar={<Avatar size={35} src={item.imageUrl}></Avatar>}
                      title={<span>{item.title}</span>}
                    />
                  </List.Item>)
              }} />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[20, 30]} >
          <Col span={12}>
            <p className="site-description-item-profile-p">Học viên:</p>
            <List
              style={{ marginRight: "20px" }}
              itemLayout="horizontal"
              dataSource={trainerData.trainees}
              renderItem={item => {
                return (
                  <List.Item
                    key={item._id}
                    extra={<Popup
                      title="Xóa học viên"
                      btnStyle={{
                        type: "primary", danger: true, icon: < MinusOutlined />, shape: "circle"
                      }}
                      onOk={() => deleteUserTrainer(trainerData._id, item._id)}
                    >
                      <div>{`Bạn chắc chắn muốn xóa  ${item.name} trong danh sách học viên của huấn luyện viên ${trainerData.name}`}</div>
                    </Popup>} >
                    <List.Item.Meta
                      avatar={<Avatar size={35} src={item.avatar}></Avatar>}
                      title={<span>{item.name}</span>}
                    />
                  </List.Item>)
              }} />
          </Col>
          <Col span={12}>
            <p className="site-description-item-profile-p">Học viên đăng ký:</p>
            <List
              style={{ marginRight: "20px" }}
              itemLayout="horizontal"
              dataSource={trainerData.userRegisters}
              renderItem={item => {
                let trainerId = trainerData._id;
                let userId = item._id;
                return (
                  <List.Item
                    key={item._id}
                    extra={<Row>
                      <Popup
                        title={`Chấp nhận đăng ký`}
                        btnStyle={{
                          style: {
                            marginRight: "8px"
                          },
                          type: "primary", icon: < CheckOutlined />, shape: "circle"
                        }}
                        onOk={() => acceptRegister(trainerId, userId)}
                      >
                        <div>{`Bạn chắc chắn muốn thêm học viên ${item.name} vào huấn luyện viên ${trainerData.name}`}</div>
                      </Popup>
                      <Popup
                        title={`Xoá đăng ký`}
                        btnStyle={{
                          type: "primary", danger: true, icon: < MinusOutlined />, shape: "circle"
                        }}
                        onOk={() => deleteRegister(trainerId, userId)}
                      >
                        <div>{`Bạn chắc chắn muốn xóa đăng ký học viên ${item.name} vào huấn luyện viên ${trainerData.name}`}</div>
                      </Popup>
                    </Row>} >
                    <List.Item.Meta
                      avatar={<Avatar size={35} src={item.avatar}></Avatar>}
                      title={<span>{item.name}</span>}

                    />
                  </List.Item>)
              }} />
          </Col>
        </Row>

      </>
    }
  </Drawer >)
}

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

export default UserManagement;