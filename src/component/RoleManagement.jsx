import { Button, Dropdown, Menu, message, Row } from 'antd';
import React, { Component } from 'react';
import { UserContext } from '../context/UserContext';
import UserData from '../models/User';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined, CheckOutlined, MinusOutlined, DownOutlined } from '@ant-design/icons';
import Popup from './Popup';
import Url from '../service/url';


class RoleManagement extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      changeRoleStatus: false
    }
  }

  async changeRole(role) {
    let userData = this.props.userData;
    let res = await this.context.axios({
      method: 'POST',
      url: Url.AdminChangeRole + '/' + userData["_id"],
      data: { role }
    });
    if (res.status != 200) {
      message.error("Lỗi khi thay đổi quyền");
      return;
    }
    message.success("Thay đổi quyền thành công");
    this.props.getUsersData();
    this.setState({ changeRoleStatus: true });
    setTimeout(function () {
      this.setState({ changeRoleStatus: false })
    }.bind(this), 1000);
  }

  getMenu() {
    let roles = Object.keys(UserData.RoleName);
    return (
      <Menu>
        {roles.map(function (role, index) {
          if (role == this.props.userData.role) return <></>;
          let roleName = UserData.RoleName[role];
          return (
            <div key={index}>
              <Menu.Item key={index} onItemHover={() => { }} onClick={() => { }}>
                <Popup
                  btnContent={roleName}
                  onOk={this.changeRole.bind(this, role)}
                  title="Thay đổi quyền"
                >
                  <p>Bạn thực sự muốn thay đổi <strong>{this.props.userData.name}</strong> thành <strong>{roleName}</strong></p>
                </Popup>
              </Menu.Item>
              <Menu.Divider />
            </div>);
        }.bind(this))}
      </Menu>
    );
  }


  render() {
    return (
      <Row>
        <Dropdown overlay={this.getMenu()} trigger={['click']} >
          <Button>{UserData.RoleName[this.props.userData.role]}</Button>
        </Dropdown>
        {this.state.changeRoleStatus && <CheckOutlined style={{
          fontSize: "150%",
          color: "#33cc33",
          marginLeft: "15px"
        }} />}
      </Row>
    );
  }
}

export default RoleManagement;