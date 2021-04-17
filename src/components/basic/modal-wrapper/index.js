import React from 'react'
import './modal-wrapper.scss'

const ModalWrapper = ({ children, keys, className,  ...props }) => {
    return (
        <div className={`alt-modal-wrapper ${className}`} key={keys} {...props}>
            {children}
        </div>
    )
}

export default ModalWrapper