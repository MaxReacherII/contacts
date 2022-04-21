import axios from 'axios';
import {IContacts, IFormData} from "../components/Contacts/Contacts";
import {userStore} from "../store/userStore";
import {GridRowId} from "@mui/x-data-grid";

const header = () => {
    return {
        Authorization: `Bearer ${userStore.userData.access_token}`
    }
}

export const getContacts = async() => {
    return await axios.get<IContacts[]>('http://localhost:4000/contacts', {
        headers: header()
    })
}

export const deleteContacts = async(id: GridRowId) => {
    return await axios.delete(`http://localhost:4000/contacts/${id}`, {
        headers: header()
    })
}

export const editContact = async(id: string, data: {}) => {
    return await axios.put(`http://localhost:4000/contacts/${id}`, {
        ...data
    } ,{
        headers: header()
    })
}

export const addContact = async({firstName, lastName, phoneNumber}: IFormData, creationDate: string) => {
    return await axios.post('http://localhost:4000/contacts', {
        firstName,
        lastName,
        phoneNumber,
        creationDate
    }, {
        headers: header()
    })
}