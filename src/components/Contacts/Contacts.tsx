import React, {useState, useEffect} from 'react';
import useAxios from "axios-hooks";
import {DataGrid, GridColDef, GridRowModel, GridSelectionModel, GridToolbarContainer} from "@mui/x-data-grid";
import {userStore} from "../../store/userStore";
import {observer} from "mobx-react-lite";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {useNavigate} from "react-router-dom";
import CustomModal from "../Modal/Modal";

export interface IContacts {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    creationDate: Date;
}

export interface IFormData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    editingValues?: GridRowModel;
    deleteItems?: GridSelectionModel;
}

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        width: 30
    },
    {
        field: 'firstName',
        headerName: 'First Name',
        editable: true,
        type: 'string',
        width: 150
    },
    {
        field: 'lastName',
        headerName: 'Last Name',
        editable: true,
        type: 'string',
        width: 150

    },
    {
        field: 'phoneNumber',
        headerName: 'Phone number',
        editable: true,
        type: 'string',
        width: 150
    },
    {
        field: 'creationDate',
        headerName: 'Creation Date',
        type: 'date',
        width: 150
    }
]

const Contacts = observer(() => {
    const navigate = useNavigate();
    useEffect(() => {
         userStore.userData.access_token === '' && navigate('/')
    });
    const [contacts, setContacts] = useState<IContacts[]>();
    const [editingValues, setEditingValues] = useState<GridRowModel>();
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [operationType, setOperationType] = useState('add')
    const [{ data: getContactsData, loading: getContactsLoading}, getContacts] = useAxios({
        url: 'http://localhost:4000/contacts',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${userStore.userData.access_token}`
        }
    }, {useCache:false});
    const [{ data: addContactData}, addContact] = useAxios({
        url: 'http://localhost:4000/contacts',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${userStore.userData.access_token}`
        }
    }, {manual: true});
    const [{ data: editContactData}, editContact] = useAxios({
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${userStore.userData.access_token}`
        }
    }, {manual: true});
    const [{ data: deleteContactData}, deleteContact] = useAxios({
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${userStore.userData.access_token}`
        }
    }, {manual: true});

    const handleClose = () => {
        setModalOpen(false)
    };

    const handleSubmit = ({firstName, lastName, phoneNumber, editingValues, deleteItems}: IFormData) => {
        const getDate = () => {
            return new Date().toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})
        };
        if (operationType === 'add') {
            addContact({data: {firstName, lastName, phoneNumber, creationDate: getDate()}})
                .catch((e) => {
                    console.log(e)
                    e.message.split(' ').pop() === '401' && navigate('/login')
                })
        }

        if (operationType === 'edit' ) {
            editContact({url: `http://localhost:4000/contacts/${editingValues.id}`, data: {...editingValues}})
                .catch((e) => {
                    console.log(e)
                    e.message.split(' ').pop() === '401' && navigate('/login')
                })
        }

        if (operationType === 'delete') {
            deleteItems.forEach((value, index, array) => {
                deleteContact({url: `http://localhost:4000/contacts/${value}`})
                    .then(() => {
                        array[array.length - 1] === value && getContacts()
                    })
                    .catch((e) => {
                        console.log(e)
                        e.message.split(' ').pop() === '401' && navigate('/login')
                    })
            })
        }
        setSelectionModel([]);
        getContacts();
        handleClose();
    }

    const addContactHandler = () => {
        setOperationType('add')
        setModalOpen(true)
    };

    const deleteContactHandler = () => {
        if(selectionModel.length >= 1) {
            setOperationType('delete')
            setModalOpen(true)
        }
    };

    const editContactHandler = async (newRow: GridRowModel, oldRow: GridRowModel) => {
        setEditingValues(newRow)
        setOperationType('edit')
        setModalOpen(true)
        return {...oldRow}
    };

    useEffect(() => {
        if(getContactsData && getContactsLoading===false){
            setContacts(getContactsData)
        }
    }, [getContactsLoading, contacts]);

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Button
                    onClick={addContactHandler}
                    sx={{
                        color: 'info.main',
                        marginRight: 2
                    }}
                >
                    <AddIcon />
                    Add
                </Button>
                <Button
                    onClick={deleteContactHandler}
                    sx={{
                        color: 'info.main'
                    }}
                >
                    <DeleteIcon />
                    Delete
                </Button>
            </GridToolbarContainer>
        );
    };

    return(
        <div style={{height: '85vh', width: '85vh'}}>
            <CustomModal
                open={modalOpen}
                deleteItems={selectionModel}
                editingValues={editingValues}
                type={operationType}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
            />
            {contacts &&
                <DataGrid
                rows={contacts}
                columns={columns}
                editMode='row'
                pageSize={20}
                rowsPerPageOptions={[20]}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                disableColumnSelector
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={editContactHandler}
                onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel)
                }}
                selectionModel={selectionModel}
                components={{
                    Toolbar: CustomToolbar
                }}
                sx={{
                    "& .MuiCheckbox-root svg": {
                        width: 16,
                        height: 16,
                        backgroundColor: "transparent",
                        border: `1px solid`,
                        borderColor: 'text.disabled',
                        borderRadius: 2
                    },
                    "& .MuiCheckbox-root svg path": {
                        display: "none"
                    },
                    "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
                        backgroundColor: "info.main",
                        borderColor: "info.main"
                    },
                    "& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
                        position: "absolute",
                        display: "table",
                        border: "2px solid #fff",
                        borderTop: 0,
                        borderLeft: 0,
                        transform: "rotate(45deg) translate(-50%,-50%)",
                        opacity: 1,
                        transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
                        content: '""',
                        top: "50%",
                        left: "39%",
                        width: 5.71428571,
                        height: 9.14285714
                    },
                    "& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after": {
                        width: 8,
                        height: 8,
                        backgroundColor: "info.main",
                        transform: "none",
                        top: "39%",
                        border: 0
                    },
                    '& .MuiDataGrid-cell:hover': {
                        color: 'info.main',
                        borderColor: 'info.main'
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "divider"
                    },
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'solid #29b6f6 1px'
                    }
                }}
                />
            }
        </div>
    )
})

export default Contacts