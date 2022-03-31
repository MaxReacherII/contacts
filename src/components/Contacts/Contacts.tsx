import React, {useState, useEffect} from 'react';
import useAxios from "axios-hooks";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

export interface IContacts {
    id: number;
    name: string;
    number: string;
    creationDate: Date;
}

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 30
    },
    {
        field: 'firstName',
        headerName: 'First Name',
        editable: true,
        width: 150
    },
    {
        field: 'lastName',
        headerName: 'Last Name',
        editable: true,
        width: 150

    },
    {
        field: 'number',
        headerName: 'Phone number',
        editable: true,
        width: 150
    },
    {
        field: 'creationDate',
        headerName: 'Creation Date',
        width: 150
    }
]

export default function App() {
    const [contacts, setContacts] = useState<IContacts[]>();
    const [{ data: getContactsData, loading: getContactsLoading, error: getContactsError }, getContacts] = useAxios({
        url: 'http://localhost:4000/contacts',
        method: 'GET'
    });

    useEffect(() => {
        if(getContactsData && getContactsLoading===false){
            setContacts(getContactsData)
            console.log(contacts)
        }
        if(getContactsError !== null){
            console.log(getContactsError)
        }
    }, [getContactsLoading, contacts])

    return(
        <div style={{height: '85vh', width: '85vh'}}>
            {contacts &&
                <DataGrid
                rows={contacts}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[20]}
                checkboxSelection
                disableSelectionOnClick
                />
            }
        </div>
    )
}