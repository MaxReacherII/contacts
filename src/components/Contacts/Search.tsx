import {Box, IconButton, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React from "react";

interface IQuickSearchProps {
    requestSearch: (searchValue: string) => void;
    value: string;
}

export default function QuickSearch({requestSearch, value}: IQuickSearchProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        requestSearch(event.target.value)
    }
    const handleClick = () => {
        requestSearch('')
    }
    return (
        <Box
            sx={{
                maxHeight: '70px',
                p: 0.5,
                pb: 0,
            }}
        >
            <TextField
                variant="outlined"
                value={value}
                autoFocus={!!value}
                onChange={handleChange}
                placeholder="Search…"
                size='small'
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            style={{ visibility: value ? 'visible' : 'hidden' }}
                            onClick={handleClick}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    ),
                }}
                sx={{
                    maxHeight: '70px',
                    width: {
                        xs: 1,
                        sm: 'auto',
                    },
                    m: (theme) => theme.spacing(1, 0.5, 1.5),
                    '& .MuiSvgIcon-root': {
                        mr: 0.5,
                    },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            border: '1px solid',
                            borderColor: 'info.main',
                        },
                    }
                }}
            />
        </Box>
    );
}