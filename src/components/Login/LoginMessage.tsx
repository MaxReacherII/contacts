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
                setColor('error.main')
                break;
            case 'text':
                setColor('text.main')
                break;
            case 'warning':
                setColor('warning.main')
                break;
            case 'success':
                setColor('success.main')
                break;
        }
    }, [props.authStatus])

    return(
        <Typography
            sx={{color: color}}
            mt={1}
        >
            {props.authStatus.message}
        </Typography>
    )
}