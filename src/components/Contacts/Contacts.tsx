import React, {useState, useEffect} from 'react';
import {DataGrid, GridColDef, GridRowModel, GridSelectionModel} from "@mui/x-data-grid";
import {userStore} from "../../store/userStore";
import {observer} from "mobx-react-lite";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {useNavigate} from "react-router-dom";
import CustomModal from "../Modal/Modal";
import QuickSearch from "./Search";
import {Box, Button} from "@mui/material";
import {addContact, editContact, getContacts, deleteContacts} from "../../api/contacts";

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

function escapeRegExp(value: string): string {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const Contacts = observer(() => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<IContacts[]>();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<IContacts[]>();
    const [pageSize, setPageSize] = useState(10);
    const [editingValues, setEditingValues] = useState<GridRowModel>();
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [operationType, setOperationType] = useState('add');

    const expiredToken = (e) => {
        if(e.response.status === 401) {
            userStore.signOut();
            return navigate('/');
        }
    };

    const getC = () => {
        getContacts()
            .then((res) => {
                setContacts(res.data)
            })
            .catch((e) => {
                expiredToken(e)
            })
    };

    useEffect(() => {
        getC()
    }, []);

    const handleClose = () => {
        setModalOpen(false)
    };

    const requestSearch = (searchValue: string) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = contacts.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
            });
        });
        setSearchResults(filteredRows);
    };

    const handleSubmit = ({firstName, lastName, phoneNumber, editingValues, deleteItems}: IFormData) => {
        const getDate = () => {
            return new Date().toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})
        };
        if (operationType === 'add') {
            addContact({firstName, lastName, phoneNumber}, getDate())
                .catch((e) => {
                    expiredToken(e)
                })
        }

        if (operationType === 'edit' ) {
            editContact(editingValues.id, {...editingValues})
                .catch((e) => {
                    expiredToken(e)
                })
        }

        if (operationType === 'delete') {
            deleteItems.forEach((value, index, array) => {
                deleteContacts(value)
                    .then(() => {
                        array[array.length-1] === value && getC()
                    })
                    .catch((e) => {
                        expiredToken(e)
                    })
            })
        }
        setSelectionModel([]);
        getC();
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

    /*useEffect(() => {
        if (getContactsData && getContactsLoading===false){
            setContacts(getContactsData)
        }
        if (getContactsError?.response.status === 401) {
            userStore.signOut();
            navigate('/');
        }

    }, [getContactsLoading, contacts]);*/

    const CustomToolbar = () => {
        return (
            <Box sx={{display: 'flex'}}>
                <Button
                    onClick={addContactHandler}
                    sx={{
                        color: 'info.main',
                        mr: '10px',
                        p: '0 20px'
                    }}
                >
                    <AddIcon />
                    Add
                </Button>
                <Button
                    onClick={deleteContactHandler}
                    sx={{
                        color: 'info.main',
                        p: '0 15px'
                    }}
                >
                    <DeleteIcon />
                    Delete
                </Button>
                <QuickSearch requestSearch={requestSearch} value={searchText}/>
            </Box>
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
                rows={searchText ? searchResults : contacts}
                columns={columns}
                editMode='row'
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 15, 100]}
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