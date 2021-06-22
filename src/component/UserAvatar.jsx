import React, {Component} from 'react';
import {Avatar} from "antd";
import Utils from "../service/utils";

function UserAvatar({imageUrl, name, style, ...props}) {
  if (style == null) style = {};
  return (imageUrl != null && imageUrl != "") ?
    <Avatar {...props} style={style} src={imageUrl}/> :
    <Avatar {...props}
            style={{
              color: '#f56a00',
              backgroundColor: '#fde3cf', ...style
            }}>{Utils.getShortName(name).toUpperCase()}</Avatar>;
}

export default UserAvatar;