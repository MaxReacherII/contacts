import React, {useState} from 'react';
import {GridRowModel, GridSelectionModel} from "@mui/x-data-grid";
import {Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, TextField, Box} from "@mui/material";
import MuiPhoneNumber from 'material-ui-phone-number';
import {IFormData} from "../Contacts/Contacts";

interface IModalProps {
    open: boolean;
    deleteItems: GridSelectionModel;
    type: string;
    handleSubmit: ({firstName, lastName, phoneNumber, editingValues, deleteItems}: IFormData) => void;
    editingValues: GridRowModel;
    handleClose: () => void;
}

const CustomModal = ({open, deleteItems, type, handleSubmit, editingValues, handleClose}: IModalProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const preHandleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        handleSubmit({firstName, lastName, phoneNumber, editingValues, deleteItems})
    };

    const deleteText = () => {
        const text = () => {
            return {__html: `<b style="font-size: large; color: #ff9800">Confirm deleting</b> <br/><br/>  ${deleteItems.length} ${deleteItems.length === 1 ? 'contact' : 'contacts'}`}
        }
        return (
            <p dangerouslySetInnerHTML={text()}/>
        )
    };

    const editText = () => {
        const text = () => {
            return {__html: `<b style="font-size: large; color: #ff9800">Confirm editing</b> <br/><br/>
            First Name: ${editingValues.firstName} <br/>
            Last Name: ${editingValues?.lastName} <br/>
            Phone Number: ${editingValues?.phoneNumber}`}
        }
        return (
            <p dangerouslySetInnerHTML={text()}/>
        )
    };

    const addText = 'Please, fill in the form and press the "Submit" button.';

    return(
        <Dialog open={open}
            fullWidth
        >
            <Box component="form" onSubmit={preHandleSubmit}>
                <DialogTitle>
                    {type === 'add' && 'Adding contact'}
                    {type === 'delete' && 'Deleting contact'}
                    {type === 'edit' && 'Editing contact'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="span">
                        {type === 'add' && addText}
                        {type === 'delete' && deleteText()}
                        {type === 'edit' && editText()}
                    </DialogContentText>
                    {type === 'add' &&
                        <>
                            <TextField
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                margin="dense"
                                name="firstName"
                                label="First Name"
                                type="text"
                                fullWidth
                                required
                                variant="outlined"
                            />
                            <TextField
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                margin="dense"
                                name="lastName"
                                label="Last Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                            />
                            <MuiPhoneNumber
                                defaultCountry={'ua'}
                                name="phone"
                                value={phoneNumber}
                                fullWidth
                                sx={{
                                    marginTop: '8px'
                                }}
                                variant="outlined"
                                onChange={value => value && setPhoneNumber(value)}
                                regions={'europe'}
                            />
                        </>
                    }
                </DialogContent>
                <DialogActions>
                    <Button sx={{color: 'text.secondary'}} onClick={handleClose} >Cancel</Button>
                    <Button sx={{color: 'text.primary', backgroundColor: 'divider'}} type="submit" >Submit</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default CustomModal;