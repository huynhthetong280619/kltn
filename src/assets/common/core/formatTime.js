import moment from 'moment';

const formatTime = (time) => {
    return moment(time).format('YYYY-MM-DDTHH:mm:ssZ');
}

export default formatTime;