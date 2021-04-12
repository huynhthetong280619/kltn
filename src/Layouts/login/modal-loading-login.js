import React, { memo } from 'react'
import { Spin } from 'antd'
import Modal from 'antd/lib/modal/Modal';

const ModalLoading = ({ visible, content }) => {

    return <Modal visible={visible} footer={null} wrapClassName="ant-modal-loading" closable={null}>
        <div className='justify-content-start'>
            <Spin /> &ensp;
            <span style={{ color: 'var(--TEXT__1)', fontSize: 'var(--medium)' }}>
                {content}
            </span>
        </div>
    </Modal>
}

export default memo(ModalLoading)