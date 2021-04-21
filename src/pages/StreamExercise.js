import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { Layout } from 'antd';
import { UserContext } from '../context/UserContext';
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

class StreamExercise extends Component {
  static routeName = "/stream-exercise";
  static contextType = UserContext;

  state = {
    rooms: [],
    currentStream: null,
    otherVideo: []
  }

  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.peerConnections = [];
    this.socket = io(process.env.REACT_APP_HOST);
  }

  componentDidMount() {
    this.context.state.axios({
      method: "get",
      url: Url.UserData
    })
    this.socket.emit('userToken', this.context.state.token);
    this.socket.on("userToken", (status, message) => {
      if (status === 200) {

      }
    })
  }

  joinRoom(roomId) {
    this.userMediaStream = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        this.setState({ currentStream });
        this.video.current.srcObject = currentStream;
        this.socketJoining(roomId);
      });
    this.socket.on("me", (id) => {
      console.log("My socket id", id);
    })
  }

  socketJoining(roomId) {
    this.socket.emit("joining", roomId);
    this.socket.on("joining", (otherSocketIds) => {
      console.log("joining", otherSocketIds);
      if (Array.isArray(otherSocketIds)) {
        otherSocketIds.forEach(socketId => this.socketConnectPeerToOtherClient(socketId));
      }
    });
    this.socket.on("receiveConnectFromOtherClients", this.receiveConnectFromOtherClients.bind(this));
    this.socket.on("receiveSuccessConnect", this.receiveSuccessConnect.bind(this));
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
      ...this.state, otherVideo: [
        ...this.state.otherVideo,
        otherVideo
      ]
    })
    this.peerConnections[socketId] = peerConnection;
    this.socket.on("candidate", (id, candidate) => {
      this.peerConnections[socketId].addIceCandidate(new RTCIceCandidate(candidate));
    });
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
      ...this.state, otherVideo: [
        ...this.state.otherVideo,
        otherVideo
      ]
    })
    this.peerConnections[socketId] = peerConnection;
    this.socket.on("candidate", (id, candidate) => {
      this.peerConnections[socketId]
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });

    console.log("receiveConnectFromOtherClients: ", signalData);
  }
  //server sau khi nhan duoc se gui lai signalData cho client thu nhat o cong "receiveSuccessConnect"
  receiveSuccessConnect(socketId, signalData) {
    this.peerConnections[socketId].setRemoteDescription(signalData);
    console.log("receiveSuccessConnect from", socketId, signalData);
  }

  initSocket() {

  }

  componentWillUnmount() {
    this.socket.close();
    this.state.currentStream.getTracks().forEach(function (track) {
      track.stop();
    });
  }



  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ color: "white" }}>Tập luyện trực tiếp</Header>

          <div>
            <video playsInline ref={this.video} autoPlay style={{ width: "300px" }} />
          </div>
          <div>
            {this.state.otherVideo.map(value =>
              <video playsInline ref={value} autoPlay style={{ width: "300px" }} />)}
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default StreamExercise;