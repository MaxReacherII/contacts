import axios from 'axios';
import {IContacts} from "../components/Contacts/Contacts";

export const getContacts = () => {
    return axios.get<IContacts[]>('http://localhost:4200/contacts')
}