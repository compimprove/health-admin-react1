import React, { Component } from 'react';
import { UserContext } from '../context/UserContext';
import Url from '../service/url';
import { Button, Card, Col, Form, Input, Layout, Row, Typography } from 'antd';
import UserData from '../models/User';
import StreamExercise from './StreamExercise';
import { Link } from 'react-router-dom';
const { Header } = Layout;
const { Title } = Typography;

class Rooms extends Component {
  static routeName = "/stream-exercise/room";
  static contextType = UserContext;

  state = {
    rooms: []
  }

  async componentDidMount() {
    await this.getRooms();
  }

  getRooms = async () => {
    let url;
    if (this.context.userData.isTrainer()) {
      url = Url.TrainerRoom
    } else if (this.context.userData.isNormalUser()) {
      url = Url.Room
    }
    let res = await this.context.axios({
      method: 'get',
      url: url
    })
    if (res.status == 200) {
      this.setState({ rooms: res.data });
      console.log("Rooms", "list room", this.state.rooms);
    }
  }

  createRoom = async ({ name, description }) => {
    console.log("createRoom", name, description);
    let res = await this.context.axios({
      method: 'post',
      url: Url.Room,
      data: { name, description }
    })
    if (res.status == 200) {
      await this.getRooms();
    }
  }

  deleteRoom = async (roomId) => {
    console.log("deleteRoom", roomId);
    let res = await this.context.axios({
      method: 'delete',
      url: Url.Room,
      data: { roomId }
    })
    if (res.status == 200) {
      await this.getRooms();
    }
  }

  render() {
    let isTrainer = this.context.userData.isTrainer();
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ color: "white" }}>Phòng tập
            <Button onClick={this.getRooms}>Refresh</Button>
          </Header>
          <Row gutter={[24, 24]} style={{ marginLeft: 10, marginRight: 10, paddingTop: 20 }}>
            {isTrainer && <CreateRoom createRoom={this.createRoom} />}
            {this.state.rooms && this.state.rooms.map(room => {
              if (isTrainer) {
                return <RoomCell key={room._id} room={room} deleteRoom={this.deleteRoom} />
              } else {
                return <RoomCell key={room._id} room={room} />
              }
            })}
          </Row>
        </Layout>
      </Layout>
    );
  }
}

const roomCellHeight = 250;

const CreateRoom = function ({ createRoom }) {
  return (<Col span={8}>
    <Card size="default" style={{ height: roomCellHeight }}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={createRoom}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
          <Title level={4}>Create Room</Title>
          <Form.Item  >
            <Button type="primary" htmlType="submit">
              Create
        </Button>
          </Form.Item>
        </div>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>

      </Form>
    </Card>
  </Col >)
}

const RoomCell = function ({ room, deleteRoom }) {
  let { name, description } = room;
  return (<Col span={8}>
    <Card size="default" style={{ height: roomCellHeight }} >
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
        <Title level={4}>{name}</Title>
        {deleteRoom && <Button type="primary" danger onClick={function () { deleteRoom(room._id) }}>
          Delete
        </Button>}
      </div>
      <p>{description}</p>
      <Button type="primary"><Link to={StreamExercise.routeName + `?roomId=${room._id}`} >Tham gia</Link></Button>
    </Card>
  </Col>)
}

export default Rooms;