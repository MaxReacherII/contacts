import React, {useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";

interface IProps {
    authStatus: {
        type: string,
        message: string
    }
}

export default function LoginMessage(props: IProps) {
    const [color, setColor] = useState('')

    useEffect(() => {
        switch (props.authStatus.type){
            case 'error':
                setColor('red')
                break;
            case 'text':
                setColor('black')
                break;
            case 'warning':
                setColor('orange')
                break;
            case 'success':
                setColor('green')
                break;
        }
    }, [props.authStatus])

    return(
        <Typography
            sx={{fontWeight: 'bold', mt:1, color: `${color}`}}
        >
            {props.authStatus.message}
        </Typography>
    )
}