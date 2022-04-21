import {makeAutoObservable} from "mobx";

interface IUserData {
    access_token: string
    email: string
}

class UserStore {
    constructor() {
        makeAutoObservable(this)
    }

    isLoggedIn = !!sessionStorage.getItem('access_token');

    userData: IUserData = {
        email: sessionStorage.getItem('email') ? sessionStorage.getItem('email') : '',
        access_token: sessionStorage.getItem('access_token') ? sessionStorage.getItem('access_token') : ''
    }

    signIn(data: IUserData){
        this.userData = data;
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('access_token', data.access_token);
        this.isLoggedIn = true;
    }

    signOut(){
        this.userData.email = '';
        this.userData.access_token = '';
        sessionStorage.clear();
        this.isLoggedIn = false;
    }
}

export const userStore = new UserStore();