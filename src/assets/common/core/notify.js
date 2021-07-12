import { notification } from 'antd';


export function notifySuccess(message, description) {
    notification.success({
        message,
        description,
        placement: 'bottomRight'
    });
};

export function notifyWarning(message, description) {
    notification.warning({
        message,
        description,
        placement: 'bottomRight'
    });
};


export function notifyError(message, description) {
    notification.error({
        message,
        description,
        placement: 'bottomRight'
    });
};

export function notifyMessage(userName, message) {
    notification.info({
        message: userName,
        description: message,
        placement: 'bottomRight'
    });
};