import React, {useState} from 'react';
import {Modal, Button} from 'antd';

const Popup = ({title, onOk, onCancel, btnStyle, btnContent, children}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (onOk) onOk();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    if (onCancel)
      onCancel();
    setIsModalVisible(false);
  };
  let okButtonProps = {};
  if (btnStyle && btnStyle.danger) {
    okButtonProps = {danger: true};
  }

  return (
    <>
      <Button {...btnStyle} onClick={showModal}>
        {btnContent}
      </Button>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        okButtonProps={okButtonProps}
        onCancel={handleCancel}>
        {children}
      </Modal>
    </>
  );
};

export default Popup;