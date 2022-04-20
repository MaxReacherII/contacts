import {makeAutoObservable} from "mobx";

interface IUserData {
    access_token: string
    email: string
}

class UserStore {
    constructor() {
        makeAutoObservable(this)
    }

    userData: IUserData = {
        email: sessionStorage.getItem('email') ? sessionStorage.getItem('email') : '',
        access_token: sessionStorage.getItem('access_token') ? sessionStorage.getItem('access_token') : ''
    }
}

export const userStore = new UserStore()