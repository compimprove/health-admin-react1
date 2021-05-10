import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { UserContext } from '../context/UserContext';
import { Button, Col, Layout, Row } from 'antd';
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
  constructor(props) {
    super(props);
  }


  render() {
    if (this.props.openChat) {
      return <Col span={6} style={{ borderLeft: '1px solid' }} >
        <Header className="site-layout-background" style={{ color: "white" }}>
          <Button onClick={this.props.toggleOpenChat}>Close</Button>
        </Header>

      </Col>;
    } else {
      return (
        <Button onClick={this.props.toggleOpenChat} style={{
          position: "fixed",
          bottom: "20px",
          right: "30px",
        }}>Chat</Button>
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
        1: React.createRef(),
        2: React.createRef(),
        3: React.createRef(),
        4: React.createRef(),
        5: React.createRef()
      }
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

  render() {
    let otherVideo = Object.values(this.state.otherVideo)
    return (
      <Row>
        <Col span={this.state.openChat ? 18 : 24} style={{ minHeight: "100vh" }}>
          <Header className="site-layout-background" style={{ color: "white" }}>Tập luyện trực tiếp</Header>
          <div>
            <video playsInline ref={this.video} autoPlay style={{ width: "300px", border: "1px solid" }} />
          </div>
          <div>
            {otherVideo.map(value =>
              <video playsInline ref={value} autoPlay style={{ width: "300px", border: "1px solid" }} />)}
          </div>
        </Col>
        <Chat
          openChat={this.state.openChat}
          toggleOpenChat={this.toggleOpenChat}
        />
      </Row>

    );
  }
}

export default StreamExercise;