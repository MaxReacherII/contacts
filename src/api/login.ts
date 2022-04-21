import axios from 'axios';

export const registerUser = async(data: {email: string, password: string}) => {
    await axios.post('http://localhost:4000/auth/register', {
        ...data
    })
}

export const loginUser = async(data: {email: string, password: string}) => {
    return await axios.post('http://localhost:4000/auth/login', {
        ...data
    })
}