import { useState } from "react"
import Sorting from "../../../component/Sorting"
import { showNotification } from "../../../component/Toast"
import request from "../../../service/base.service"


interface Tprops {
    data?: any,
    sno?: any,
    searchtext?: (e: any) => void,
    text?: string,
    sort?: any,
    setSorttoggle?:(e:boolean)=>void,
    sorttoggle?:boolean,
    reload?: () => void
}

const Table: React.FC<Tprops> = ({ data, sno, sort, reload ,sorttoggle,setSorttoggle}) => {

    const changeStatus = (item: any) => {
        try {
            request({ url: '/api/user/user', method: 'put', data: { userId: item._id, isActive: !item.isActive } }).then((res: any) => {
                if (reload) reload()
                showNotification(true, res.message)
            }).catch((err: any) => {
                showNotification(false, err.message)
            })
        }
        catch (err: any) {
            showNotification(false, err.data.message)
        }
    }

    
    const sorting = (e: string) => {
        sorttoggle ? sort({ [e]: 1 }) : sort({ [e]: -1 })
    }

    return (
        <>
            <table className='styled-table w-100 mx-3'>
                <thead>
                    <tr style={{ cursor: 'pointer' }}>
                        <th>S.NO</th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('name') }}>Name <Sorting /></th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('email') }}>Email <Sorting /></th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('mobile') }}>Mobile <Sorting /></th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 && data?.map((val: any, key: number) => {
                        return (
                            <tr key={key}>
                                <td>{key + 1 + sno}</td>
                                <td>{val.name}</td>
                                <td>{val.email}</td>
                                <td>{val.mobile}</td>
                                <td>{val.role}</td>
                                <td><button className={val.isActive ? 'btn btn-warning' : 'btn btn-danger'} onClick={() => changeStatus(val)}>{val.isActive ? 'Active' : 'In-Active'}</button></td>
                            </tr>
                        )
                    })}
                    {data?.length < 0 && <h5>No Reacord Found</h5>}
                </tbody>
            </table>
        </>
    )
}
export default Table