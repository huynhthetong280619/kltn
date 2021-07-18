import { get, isEmpty, omit } from 'lodash';
import urljoin from 'url-join';


const parseResponse = async response => {
    try {
        return await response.json();
    } catch (ex) {
        console.log('Could not parse as json');
    }

    try {
        return await response.text();
    } catch (ex) {
        console.log('Could not parse as text');
    }
    return null;
};

const URL_DEFAULT = 'https://lms-api-server.herokuapp.com/'
//const URL_DEFAULT = `http://localhost:8000/`

class RestClient {
    constructor(props) {
        if (!props.token) {
            const localStorageToken = localStorage.getItem('API_TOKEN')
            if (localStorageToken) {
                this.token = localStorageToken
            }
            return;
        }
        this.token = props.token;
    }

    setExceptionHandler(exceptionHandler) {
        this.exceptionHandler = exceptionHandler;
    }

    createHeaders() {
        let headers = {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Accept',
            mode: 'no-cors'
        };
        return headers;
    }

    getUrl(path) {
        const url = urljoin(URL_DEFAULT, path);
        return url;
    }

    async asyncGet(path) {
        try {
            const response = await fetch(this.getUrl(path), {
                headers: this.createHeaders(),
            });

            const data = await parseResponse(response);
            if (response.status === 401 || get(data, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }

            const hasError = !response.ok || !isEmpty(get(data, 'error'));
            return {
                hasError,
                data,
            };
        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncPost(path, data) {
        try {
            const response = await fetch(this.getUrl(path), {
                method: 'POST',
                headers: this.createHeaders(),
                body: JSON.stringify(data),
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }


    async asyncPut(path, data) {
        try {
            const response = await fetch(this.getUrl(path), {
                method: 'PUT',
                headers: this.createHeaders(),
                body: JSON.stringify(data),
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncDelete(path, data) {
        try {
            const response = await fetch(this.getUrl(path), {
                headers: this.createHeaders(),
                body: JSON.stringify(data),
                method: 'DELETE',
            });

            const res = await parseResponse(response);
            if (response.status === 401 || get(res, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }

            return {
                hasError: !response.ok,
                data: res,
            };
        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncPatch(path, data, isFormData) {
        try {
            const response = await fetch(this.getUrl(path), {
                method: 'PATCH',
                headers: isFormData ? { ...omit(this.createHeaders(), 'Content-Type') } : this.createHeaders(),
                body: isFormData ? data : JSON.stringify(data),
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }


    async asyncUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file)
        // replace this with your upload preset name
        formData.append('upload_preset', 'gmttm4bo');
        const options = {
            method: 'POST',
            body: formData,
            header: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Accept',
                mode: 'no-cors'
            }
        };

        // replace cloudname with your Cloudinary cloud_name
        return await fetch('https://api.Cloudinary.com/v1_1/dkepvw2rz/upload', options)
            .then(res => res.json())
            .then(res => {

                console.log('Response secure_url', res.secure_url);

                console.log('Response url', res.url);
                return {
                    name: res.original_filename,
                    path: res.secure_url,
                    type: res.format || res.public_id.split('.')[1]
                }
            })
            .catch(err => {
                return null;
            });
    }
}

export default RestClient;