import React from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
type Tprops = {
    page: number,
    pagination: (e: any, data: any) => void
    pageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
    hideNextButton?: boolean;
    hidePrevButton?: boolean;
    defaultp?:number;
    variant?: "outlined" | "text"
    shape?: "circular" | "rounded"
  }

const Paginate:React.FC<Tprops> = ({ page, variant ,shape,pagination,hideNextButton,hidePrevButton}) => {
    return (
        <>
            <Stack spacing={2} style={{ marginTop: "15px" }}>
                <Pagination count={page} variant={variant} shape={shape} onChange={(e:any,value:any)=>pagination(e,value)}/>
            </Stack>
        </>
    )
}
export default Paginate