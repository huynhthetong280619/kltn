import fileDownload from 'js-file-download';
import { notifyError } from './notify';

const downloadFile = async (file) => {

    console.log('Download file', file.path);
    await fetch(file.path, {
            method: 'GET'
        })
        .then(res => {
            return res.blob();
        })
        .then((blob) => {
            fileDownload(blob, `${file.name}.${file.type}`);
        })
        .catch(err => {
            notifyError('Error', err.message);
        })
}

export default downloadFile;