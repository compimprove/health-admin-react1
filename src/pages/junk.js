import { io } from 'socket.io-client';
import React, { Component } from 'react';

import { UserContext } from '../context/UserContext';
import { Layout } from 'antd';
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
  static routeName = "/stream-exercise/in-room";
  static contextType = UserContext;

  state = {
    rooms: [],
    currentStream: null,
    otherClients: []
  }

  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.peerConnections = [];
    this.socket = io(process.env.REACT_APP_HOST);
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
  }

  socketJoining(roomId) {
    this.socket.emit("joining", roomId);
    this.socket.on("joining", (otherClients) => {
      console.log("joining", otherClients);
      if (Array.isArray(otherClients)) {
        otherClients.forEach(client => this.socketConnectPeerToOtherClient(client.socketId));
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
    let videoSrc = React.createRef();
    peerConnection.ontrack = event => {
      videoSrc.current.srcObject = event.streams[0];
    }
    this.context.axios({
      method: "GET",
      url: Url.UserInfoBySocketId + "/" + socketId,
    }).then(function (response) {
      this.setState({
        ...this.state, otherClients: {
          ...this.state.otherClients,
          [socketId]: {
            ...this.state.otherClients[socketId],
            ...response.data
          }
        }
      })
    }.bind(this));

    this.setState({
      ...this.state, otherClients: {
        ...this.state.otherClients,
        [socketId]: {
          ...this.state.otherClients[socketId],
          videoSrc: videoSrc
        }
      }
    })
    this.peerConnections[socketId] = peerConnection;
    this.socket.on("candidate", (id, candidate) => {
      this.peerConnections[socketId].addIceCandidate(new RTCIceCandidate(candidate));
    });
  }
  // server khi nhan duoc tin hieu se gui lai socketId, signalData cho client kia
  // client nay tao peer, roi gui socketId, signalData len server o cong "receiveSuccessConnect"
  receiveConnectFromOtherClients(socketId, signalData) {
    console.log("receiveConnectFromOtherClients: ", signalData);
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
    let videoSrc = React.createRef();
    peerConnection.ontrack = event => {
      videoSrc.current.srcObject = event.streams[0];
    }
    this.context.axios({
      method: "GET",
      url: Url.UserInfoBySocketId + "/" + socketId,
    }).then(function (response) {
      this.setState({
        ...this.state, otherClients: {
          ...this.state.otherClients,
          [socketId]: {
            ...this.state.otherClients[socketId],
            ...response.data
          }
        }
      })
    }.bind(this));

    this.setState({
      ...this.state, otherClients: {
        ...this.state.otherClients,
        [socketId]: {
          ...this.state.otherClients[socketId],
          videoSrc: videoSrc
        }
      }
    })
    this.peerConnections[socketId] = peerConnection;
    this.socket.on("candidate", (id, candidate) => {
      this.peerConnections[socketId]
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });
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
      let otherClients = {
        ...this.state.otherClients,
      }
      delete otherClients[socketId];
      this.setState({ otherClients: otherClients });
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
    let otherClients = Object.values(this.state.otherClients)
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ color: "white" }}>Tập luyện trực tiếp</Header>
          <div>
            <video playsInline ref={this.video} autoPlay style={{ width: "300px" }} />
          </div>
          <div>
            {otherClients.map(client =>
              <video playsInline ref={client.videoSrc} autoPlay style={{ width: "300px" }} />)}
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default StreamExercise;