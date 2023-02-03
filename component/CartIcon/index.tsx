import { styled } from '@mui/material/styles';
import { DataContext } from "../../context/user";
import Badge, { BadgeProps } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { useContext } from 'react';
import { useRouter } from 'next/router';


const CartIcon = () => {
    const router = useRouter()
    const { state } = useContext(DataContext)

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    })); 2
    return (
        <IconButton aria-label="cart" onClick={()=>router.push('/cart')}>
            <StyledBadge badgeContent={state?.cart?.count || 0} color="secondary">
                <ShoppingCartIcon />
            </StyledBadge>
        </IconButton>
    )
}
export default CartIcon