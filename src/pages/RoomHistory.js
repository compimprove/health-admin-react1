import React, {Component} from 'react';
import MainLayout from "../component/MainLayout";
import {UserContext} from "../context/UserContext";
import Url from "../service/url";
import {Avatar, Button, Card, Col, Divider, Drawer, List, Row, Tooltip} from "antd";
import Title from "antd/es/typography/Title";
import {LoadingOutlined, UserOutlined, AntDesignOutlined} from "@ant-design/icons";
import Popup from "../component/Popup";
import moment from "moment";

class RoomHistory extends Component {
  static routeName = "/room-history";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      roomHistories: [],
      userData: [],
      showDrawer: false,
      roomDrawer: null,
      loading: true,
    }
  }

  async componentDidMount() {
    this.setState({loading: true});
    await this.getRoomHistory();
    let userIds = this.filterUserIds(this.state.roomHistories);
    await this.getUserData(userIds);
    this.setState({loading: false});
  }

  async getUserData(userIds) {
    let userData = new Map();
    await Promise.all(userIds.map(async userId => {
      let res = await this.context.axios({
        url: Url.UserData + "/" + userId
      })
      userData[res.data.id] = res.data;
    }))

    this.setState({userData: userData})
  }

  filterUserIds(roomHistories) {
    let userIds = new Set();
    roomHistories.forEach(room => {
      room.participants.forEach(userId => userIds.add(userId));
      room.messages.forEach(message => {
        userIds.add(message.userId);
      })
    })
    return Array.from(userIds);
  }

  async getRoomHistory() {
    let url = Url.UserRoomHistory;
    let response = await this.context.axios({
      url: url
    });
    let roomHistories = response.data;
    roomHistories.sort((a, b) => (new Date(b.created) - new Date(a.created)));
    this.setState({roomHistories: roomHistories});
  }

  getDateTimeString(milliseconds) {
    return moment(milliseconds).format("h:mm a, DD/M")
  }

  onCloseDrawer = () => {
    this.setState({showDrawer: false});
  }

  openDrawer = (roomHistoryId) => {
    let roomDrawer = this.state.roomHistories.find(room => room._id === roomHistoryId);
    if (roomDrawer) {
      this.setState({
        roomDrawer: roomDrawer,
        showDrawer: true
      });
    }
  }

  async deleteRoomHistory(roomHistoryId) {
    let url = Url.UserRoomHistory;
    let response = await this.context.axios({
      method: 'DELETE',
      url: url + "/" + roomHistoryId
    });
    await this.getRoomHistory();
  }

  render() {
    if (this.state.loading) return (<MainLayout title="Trang chủ">
      <LoadingOutlined/>
    </MainLayout>);
    return (
      <MainLayout title="Lịch sử phòng tập">
        <div style={{margin: "20px 50px"}}>
          {/*{this.context.userData.isTrainer() && <div>*/}
          {/*  <Title level={4}>Tổng số phòng từng tham gia: {}</Title>*/}
          {/*</div>}*/}
          <Row gutter={[20, 20]}>
            <Col span={13}>
              <Card title={`Danh sách lịch sử phòng: ${this.state.roomHistories.length}`}>
                <List
                  itemLayout="horizontal"
                  dataSource={this.state.roomHistories}
                  pagination={{
                    pageSize: 7,
                  }}
                  renderItem={item => {
                    let avatar = <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <Avatar size="large"
                              style={{
                                backgroundColor: '#5bac07',
                                marginBottom: "5px"
                              }}>{moment(item.started).format("DD/M")}</Avatar>
                      {this.context.userData.isTrainer() && <span>{item.participants.length} <UserOutlined/></span>}
                    </div>
                    return (
                      <List.Item
                        extra={<Popup
                          btnStyle={{type: "primary", danger: true}}
                          btnContent="Xóa"
                          onOk={this.deleteRoomHistory.bind(this, item._id)}
                          title="Bạn thực sự muốn xóa"
                        ><p>{item.name}</p></Popup>}
                      >
                        <List.Item.Meta
                          avatar={avatar}
                          title={<a onClick={() => {
                            this.openDrawer(item._id)
                          }}>{item.name}</a>}
                          description={<div style={{display: 'flex', flexDirection: 'column'}}>
                            <span>Bắt đầu vào {`${this.getDateTimeString(item.started)}`}</span>
                            <span>Kết thúc vào {`${this.getDateTimeString(item.created)}`}</span>
                          </div>}
                        />
                      </List.Item>)
                  }}
                />
              </Card>
            </Col>
          </Row>


        </div>
        <RoomHistoryDrawer
          onClose={this.onCloseDrawer}
          visible={this.state.showDrawer}
          userData={this.state.userData}
          roomDrawerData={this.state.roomDrawer}
        />
      </MainLayout>
    );
  }
}

class RoomHistoryDrawer extends Component {
  render() {
    let {onClose, visible, userData, roomDrawerData} = this.props;
    if (roomDrawerData == null) return (<></>);

    return (
      <Drawer
        width={700}
        height={"200vh"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Title level={4}>Lịch sử {roomDrawerData.name}</Title>
        <p style={{color: "grey"}}><UserOutlined/>- {userData[roomDrawerData.trainerId].name}</p>
        <p>{roomDrawerData.description}</p>
        <p style={{display: "flex", alignItems: "center"}}>
          <span>Tham gia</span>
          <Avatar.Group
            style={{marginLeft: "15px"}}
            maxCount={3}
            size="large"
            maxStyle={{color: '#f56a00', backgroundColor: '#fde3cf'}}
          >
            {roomDrawerData.participants.map(userId => {
              if (userData[userId])
                return (<Tooltip title={userData[userId].name} placement="top">
                  <Avatar src={userData[userId].avatar}/>
                </Tooltip>)
            })}
          </Avatar.Group>
        </p>
        <List
          style={{width: "500px", marginTop: "20px"}}
          itemLayout="horizontal"
          dataSource={roomDrawerData.messages}
          pagination={{
            pageSize: 9,
          }}
          renderItem={item => {
            let avatarSrc = userData[item.userId].avatar;
            let userName = userData[item.userId].name;
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "flex-start",
                alignItems: "center",
                margin: "10px 0"
              }}>
                {avatarSrc == null &&
                <Avatar style={{backgroundColor: "#1890ff", margin: "7px 10px"}}><UserOutlined
                  style={{fontSize: "100%"}}/></Avatar>}
                {avatarSrc != null && <Avatar
                  style={{margin: "7px 10px"}}
                  src={avatarSrc}/>}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: "flex-start"}}>
                  {userName != null && <span className="user-chat-name">{userName}</span>}
                  {userName == null && <span className="user-chat-name">Member</span>}
                  <span>{item.text}</span>
                </div>
              </div>)
          }}
        />
      </Drawer>
    );
  }
}

export default RoomHistory;