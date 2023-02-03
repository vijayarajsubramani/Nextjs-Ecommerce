import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import { DataContext } from '../../context/user';

export default function BasicMenu() {
    const router = useRouter()
    const {state}=React.useContext(DataContext)
    const { dispatch } = React.useContext(DataContext)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handlelogout = () => {
        dispatch({ type: 'AUTH', payload: {} })
        localStorage.removeItem('firstlogin')
        localStorage.removeItem('token')
        router.push('/')
    }
    const loginMenu=()=>{
        if(state?.auth?.user?.role.includes('ADMIN')) router.push('/admin/user')
        if(state?.auth?.user?.role.includes('SELLER')) router.push('/seller/productlist')
    }

    return (
        <div>
            <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                <AccountCircleIcon />
            </Button>
            <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
                <MenuItem onClick={loginMenu}>Menu</MenuItem>
                <MenuItem onClick={()=>router.push('/profile')}>Profile</MenuItem>
                <MenuItem onClick={handlelogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
