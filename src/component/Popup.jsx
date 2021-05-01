import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const Popup = ({ title, onOk, onCancel, btnStyle, btnContent, children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onOk();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    if (onCancel)
      onCancel();
    setIsModalVisible(false);
  };

  return (
    <>
      <Button {...btnStyle} onClick={showModal}>
        {btnContent}
      </Button>
      <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {children}
      </Modal>
    </>
  );
};

export default Popup;