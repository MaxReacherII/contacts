import {useNavigate} from "react-router-dom";
import {userStore} from "../../store/userStore";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";

const AuthProvider = observer(({children}) => {
    const navigate = useNavigate();
    useEffect(() => {
        if(!userStore.isLoggedIn){
            navigate('/');
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
})

export default AuthProvider;