import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { UserContext } from '../context/UserContext';
import { Avatar, Button, Col, Form, Input, Layout, List, Row } from 'antd';
import { RightSquareOutlined, CommentOutlined, CaretRightFilled, UserOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Url from '../service/url';
const { Header } = Layout;

const socketConfig = {
  iceServers: [
    {
      "urls": "stun:stun.l.google.com:19302",
    },
    // { 
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ]
};

class Chat extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.state = {
      messages: [],
    }
    let url = new URL(window.location.href);
    this.formRef = React.createRef();
    this.roomId = url.searchParams.get('roomId');
    this.socket.on("receiveMessage", this.receiveMessage.bind(this));
  }

  componentDidMount() {
    this.getAllMessages();
  }

  async getAllMessages() {
    console.log("getAllMessages");
    let response = await this.context.axios({
      url: Url.RoomInfo + "/" + this.roomId
    })
    this.setState({
      messages: response.data.messages
    })
  }

  filterUserData(data) {
    let result = [];
    Object.values(data).forEach(user => {
      result[user.id] = {
        ...user
      }
    })
    console.log("filterUserData", result);
    return result;
  }

  receiveMessage(userId, text) {
    console.log("receiveMessage", userId, text);
    let messages = [...this.state.messages];
    messages.push({ userId: userId, text: text });
    this.setState({ messages: messages });
  }
  sendMessage = ({ text }) => {
    if (text == "") return;
    console.log("sendMessage", text);
    this.socket.emit("sendMessage", text, this.roomId);
    let messages = [...this.state.messages];
    messages.push({
      userId: this.context.userData.id,
      text: text
    });
    this.setState({ messages: messages });
    this.formRef.current.setFieldsValue({ text: null });
  }

  render() {
    let userData = this.filterUserData(this.props.userData)
    if (this.props.openChat) {
      return <Col span={7} style={{
        borderLeft: '1px solid #cccccc',
        backgroundColor: "#ffffff",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: "0px 20px"
      }} >
        <div style={{
          fontSize: '200%',
          color: "#1890ff"
        }}>
          <MenuUnfoldOutlined onClick={this.props.toggleOpenChat} />
        </div>
        <div style={{
          height: "80vh",
          overflow: "auto",
          whiteSpace: "nowrap"
        }}>
          <List
            itemLayout="horizontal"
            dataSource={this.state.messages}
            renderItem={item => {
              let self = this.context.userData;
              let avatarSrc, userName;
              if (self.id == item.userId) {
                avatarSrc = self.avatar;
                return (
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: "center" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }}>
                      <span className="user-chat-name">{self.name}</span>
                      <span>{item.text}</span>
                    </div>
                    {avatarSrc == null &&
                      <Avatar style={{ backgroundColor: "#1890ff", margin: "7px 10px" }}><UserOutlined
                        style={{ fontSize: "100%" }} /></Avatar>}
                    {avatarSrc != null && <Avatar
                      style={{ margin: "7px 10px" }}
                      src={avatarSrc} />}
                  </div>
                );
              } else if (userData[item.userId]) {
                avatarSrc = userData[item.userId].avatar;
                userName = userData[item.userId].name;
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center" }}>
                  {avatarSrc == null &&
                    <Avatar style={{ backgroundColor: "#1890ff", margin: "7px 10px" }}><UserOutlined
                      style={{ fontSize: "100%" }} /></Avatar>}
                  {avatarSrc != null && <Avatar
                    style={{ margin: "7px 10px" }}
                    src={avatarSrc} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start" }}>
                    {userName != null && <span className="user-chat-name">{userName}</span>}
                    {userName == null && <span className="user-chat-name">Member</span>}
                    <span>{item.text}</span>
                  </div>
                </div>
              );
            }}
          />
        </div>
        <div>
          <Form
            ref={this.formRef}
            onFinish={this.sendMessage}
            style={{ marginBottom: "10px" }}
          >
            <Form.Item name="text" style={{
              marginBottom: "10px"
            }} >
              <Input.TextArea autoSize onKeyPress={() => {
                if (event.keyCode == 13) {
                  this.sendMessage({ text: this.formRef.current.getFieldValue("text") });
                }
              }} />
            </Form.Item>
            <Button htmlType="submit" type="primary">Gửi</Button>
          </Form>
        </div>
      </Col >;
    } else {
      return (
        <CommentOutlined onClick={this.props.toggleOpenChat} style={{
          fontSize: "200%",
          position: "fixed",
          bottom: "20px",
          right: "50px",
          color: "#1890ff"
        }} />
      );
    }

  }
}

class StreamExercise extends Component {
  static routeName = "/stream-exercise/in-room";
  static contextType = UserContext;


  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.peerConnections = [];
    this.socket = io(process.env.REACT_APP_HOST);
    this.state = {
      openChat: false,
      rooms: [],
      currentStream: null,
      otherVideo: {
        // 1: React.createRef(),
        // 2: React.createRef(),
        // 3: React.createRef(),
        // 4: React.createRef(),
        // 5: React.createRef(),
        // 6: React.createRef(),
        // 7: React.createRef(),
        // 8: React.createRef(),
      },
      focusVideoId: -1,
      userData: {}
    }
  }

  toggleOpenChat = () => {
    this.setState({ openChat: !this.state.openChat });
  }

  componentDidMount() {
    let url = new URL(window.location.href);
    this.roomId = url.searchParams.get('roomId');
    this.socket.emit('userToken', this.context.state.token);
    this.socket.on("userToken", (status, message) => {
      if (status === 200) {
        this.joinRoom(this.roomId);
      }
    })
    this.socket.on("me", (id) => {
      console.log("My socket id", id);
    })
  }

  joinRoom(roomId) {
    this.userMediaStream = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        this.setState({ currentStream });
        this.video.current.srcObject = currentStream;
        this.socketJoining(roomId);
      });
    // this.socketJoining(roomId);
    this.socket.on("receiveConnectFromOtherClients", this.receiveConnectFromOtherClients.bind(this));
    this.socket.on("receiveSuccessConnect", this.receiveSuccessConnect.bind(this));
    this.socket.on("leave", this.onLeave.bind(this));
    this.socket.on("candidate", (id, candidate) => {
      this.peerConnections[id]
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });
  }

  socketJoining(roomId) {
    this.socket.emit("joining", roomId);
    this.socket.on("joining", (otherSocketIds) => {
      console.log("joining", otherSocketIds);
      if (Array.isArray(otherSocketIds)) {
        otherSocketIds.forEach(socketId => this.socketConnectPeerToOtherClient(socketId));
      }
    });
  }
  // khi muon connect voi clien khac, tao peer, roi gui socketId client do + signal data cho server o cong "connectToOtherClients"
  socketConnectPeerToOtherClient(socketId) {
    let peerConnection = new RTCPeerConnection(socketConfig);
    let stream = this.state.currentStream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    peerConnection
      .createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        let signalData = peerConnection.localDescription
        console.log("socketConnectPeerToOtherClient", signalData, socketId);
        this.socket.emit("connectToOtherClients", socketId, signalData);
      });
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.socket.emit("candidate", socketId, event.candidate);
      }
    };
    let otherVideo = React.createRef();
    peerConnection.ontrack = event => {
      otherVideo.current.srcObject = event.streams[0];
    }
    this.getUserData(socketId);
    this.setState({
      otherVideo: {
        ...this.state.otherVideo,
        [socketId]: otherVideo
      }
    })
    this.peerConnections[socketId] = peerConnection;
  }
  // server khi nhan duoc tin hieu se gui lai socketId, signalData cho client kia
  // client nay tao peer, roi gui socketId, signalData len server o cong "receiveSuccessConnect"
  receiveConnectFromOtherClients(socketId, signalData) {
    let peerConnection = new RTCPeerConnection(socketConfig);
    let stream = this.state.currentStream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    peerConnection
      .setRemoteDescription(signalData)
      .then(() => peerConnection.createAnswer())
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        this.socket.emit("receiveSuccessConnect", socketId, peerConnection.localDescription);
      });
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.socket.emit("candidate", socketId, event.candidate);
      }
    };
    let otherVideo = React.createRef();
    peerConnection.ontrack = event => {
      otherVideo.current.srcObject = event.streams[0];
    }
    this.getUserData(socketId);
    this.setState({
      otherVideo: {
        ...this.state.otherVideo,
        [socketId]: otherVideo
      }
    })
    this.peerConnections[socketId] = peerConnection;
    console.log("receiveConnectFromOtherClients: ", signalData);
  }
  //server sau khi nhan duoc se gui lai signalData cho client thu nhat o cong "receiveSuccessConnect"
  receiveSuccessConnect(socketId, signalData) {
    this.peerConnections[socketId].setRemoteDescription(signalData);
    console.log("receiveSuccessConnect from", socketId, signalData);
  }

  onLeave(socketId) {
    console.log("someone leave", socketId);
    if (this.peerConnections[socketId] != null) {
      this.peerConnections[socketId].close();
      this.peerConnections[socketId] = undefined;
      let otherVideo = { ...this.state.otherVideo };
      delete otherVideo[socketId];
      this.setState({ otherVideo: otherVideo });
      console.log(this.state.otherVideo);
    }
  }

  initSocket() {

  }

  getUserData(socketId) {
    this.context.axios({
      url: Url.UserInfoBySocketId + "/" + socketId
    }).then(function (res) {
      let userData = { ...this.state.userData };
      userData[socketId] = res.data;
      this.setState({ userData });
    }.bind(this));
  }

  // deleteUserData(socketId) {
  //   let userData = { ...this.state.userData };
  //   delete userData[socketId];
  //   this.setState({ userData });
  // }

  componentWillUnmount() {
    this.socket.close();
    this.peerConnections.forEach(peerConnection => peerConnection.close());
    try {
      if (this.state.currentStream != null)
        this.state.currentStream.getTracks().forEach(function (track) {
          track.stop();
        });
    } catch (error) {
      console.error(error);
    }
  }

  setFocusVideo(id) {
    this.setState({ focusVideoId: id })
  }

  render() {
    let allOtherVideos = [];
    let focusVideo;
    let otherSocketIds = Object.keys(this.state.otherVideo)
    otherSocketIds.forEach(socketId => {
      let userData = this.state.userData[socketId];
      let userName = userData == null ? "No name" : userData.name;
      let video = (
        <>
          <video playsInline ref={this.state.otherVideo[socketId]} autoPlay style={{ width: "100%", border: "1px solid #cccccc" }} />
          <br />
          <a onClick={this.setFocusVideo.bind(this, socketId)}>{userName}</a>
        </>
      );
      if (this.state.focusVideoId == socketId) {
        focusVideo = video;
      } else {
        allOtherVideos.push(video);
      }
    });
    let selfVideo = (
      <>
        <video playsInline ref={this.video} autoPlay style={{ width: "100%", border: "1px solid #cccccc" }} />
        <br />
        <a onClick={this.setFocusVideo.bind(this, -1)}>{this.context.userData.name}</a>
      </>
    );
    if (this.state.focusVideoId != -1) {
      allOtherVideos.push(selfVideo);
    } else {
      focusVideo = selfVideo;
    }
    return (
      <Row>
        <Col span={this.state.openChat ? 17 : 24} style={{ minHeight: "100vh" }}>
          {/* <Header className="site-layout-background" style={{ color: "white" }}>Tập luyện trực tiếp</Header> */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", margin: "10px 0 20px 0" }}>
            <div style={{ width: "650px" }}>
              {focusVideo}
            </div>
          </div>
          {allOtherVideos.length > 0 &&
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
              <div className="list-video-horizontal">
                {allOtherVideos.map((video, index) => {
                  return (
                    <div className="video">
                      {video}
                    </div>
                  );
                })}
              </div>
            </div>}

        </Col>
        <Chat
          openChat={this.state.openChat}
          toggleOpenChat={this.toggleOpenChat}
          socket={this.socket}
          roomId={this.roomId}
          userData={this.state.userData}
        />
      </Row>

    );
  }
}

export default StreamExercise;