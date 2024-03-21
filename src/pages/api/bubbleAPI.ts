import axios from 'axios';


const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Function to make a GET request
export async function searchData(endpoint: string, payload: any) {
    try {
        const url = `${process.env.REACT_APP_BUBBLE_URL}${endpoint}`
        const header = {
            Authorization: `Bearer ${process.env.REACT_APP_BUBBLE_TOKEN}`
        }
        const params = {
            constraints: payload
        };
        const response = await axios.get(url, { params, headers: header });
        return response.data.response.results
        // Process the response data here
    } catch (error) {
        console.error(error);
        // Handle the error here
    }
}

export async function getData(endpoint: string, uid: string) {
    try {
        const url = `${process.env.REACT_APP_BUBBLE_URL}${endpoint}/${uid}`
        const header = {
            Authorization: `Bearer ${process.env.REACT_APP_BUBBLE_TOKEN}`
        }
        const response = await axios.get(url, { headers: header });
        return response.data.response
        // Process the response data here
    } catch (error) {
        console.error(error);
        // Handle the error here
    }
}

export async function updateData(endpoint: string, uid: string, data: any) {
    try {
        const url = `${process.env.REACT_APP_BUBBLE_URL}${endpoint}/${uid}`
        const header = {
            Authorization: `Bearer ${process.env.REACT_APP_BUBBLE_TOKEN}`
        }
        const response = await axios.patch(url, data, { headers: header });
        return response.data.response
        // Process the response data here
    } catch (error) {
        console.error(error);
        // Handle the error here
    }
}

export async function uploadFile(file: any) {
    const url = process.env.REACT_APP_UPLOAD_ENDPOINT
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_BUBBLE_TOKEN}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    const data = {
        name: file.name,
        contents: await convertToBase64(file),
        private: false,
    };

    return fetch(url!, { method: 'POST', headers: headers, body: JSON.stringify(data) })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

export async function postData(endpoint: string, data: any) {
    const url = `${process.env.REACT_APP_BUBBLE_URL}${endpoint}`;
    const header = {
        "Accept": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_BUBBLE_TOKEN}`,
        "Content-Type": 'application/json',
    };

    return fetch(url, { method: 'POST', headers: header, body: JSON.stringify(data) })
        .then(response => {
            return response.arrayBuffer().then(buffer => {
                const byteArray = new Uint8Array(buffer);
                let result = '';
                for (let i = 0; i < byteArray.byteLength; i++) {
                    result += String.fromCharCode(byteArray[i]);
                }
                const data = JSON.parse(result);
                return data;
            });
        })
        .catch(error => {
            console.log('Error:', error);
            throw error;
        });
}
