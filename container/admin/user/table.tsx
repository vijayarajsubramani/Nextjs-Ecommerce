import { showNotification } from "../../../component/Toast"
import request from "../../../service/base.service"


interface Tprops {
    data?: any,
    sno?: any,
    searchtext?: (e: any) => void,
    text?: string,
    reload?:()=>void
}

const Table: React.FC<Tprops> = ({ data,sno ,reload}) => {
    const changeStatus=(item:any)=>{
        try{
            request({url:'/api/user/user',method:'put',data:{userId:item._id,isActive:!item.isActive}}).then((res:any)=>{
                if(reload) reload()
                showNotification(true,res.message)
            }).catch((err:any)=>{
                showNotification(false,err.message)
            })
        }
        catch(err:any){
            showNotification(false, err.data.message)
        }
    }

    return (
        <>
            <table className='styled-table w-100 mx-3'>
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 && data?.map((val: any, key: number) => {
                        return (
                            <tr key={key}>
                                <td>{key + 1+sno}</td>
                                <td>{val.name}</td>
                                <td>{val.email}</td>
                                <td>{val.mobile}</td>
                                <td>{val.role}</td>
                                <td><button className={ val.isActive ? 'btn btn-warning': 'btn btn-danger'} onClick={()=>changeStatus(val)}>{val.isActive ? 'Active' :'In-Active'}</button></td>
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