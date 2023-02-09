import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import Sorting from '../../../component/Sorting'
import { DataContext } from '../../../context/user'


interface Tprops {
    data?: any,
    route?: string,
    sno?: any,
    sort?: any,
    setSorttoggle?:(e:boolean)=>void,
    sorttoggle?:boolean,
}

const Table: React.FC<Tprops> = ({ data, sno, route,sort ,sorttoggle,setSorttoggle }) => {

    const router = useRouter()
    const [checkedItem, setCheckedItem] = useState<string[]>([])


    const editProduct = (id: any) => {
        router.push(`${route}/${id._id}`)
    }
    const sorting = (e: string) => {
        sorttoggle ? sort({ [e]: 1 }) : sort({ [e]: -1 })
    }
    const handleCheckbox=(e:any)=>{
        e.persist();
        if(e.target.checked){
            setCheckedItem([...checkedItem,e.target.value])
        }else{
            setCheckedItem(checkedItem.filter((chec:any)=>chec !== e.target.value))
        }
    }
    const selectAll=(e:any)=>{
        e.persist();
        if(e.target.checked){
            setCheckedItem(checkedItem.map((id:any)=>id._id))
        }else{
            setCheckedItem([])
        }
    }

    return (
        <>
            <table className='styled-table w-100 mx-3'>
                <thead>
                    <tr style={{cursor:'pointer'}}>
                        <th><input type='checkbox' checked={data?.map((e:any)=>{if(checkedItem.includes(e._id)){return true}else{return false}} ).includes(false) ? false:true} onClick={selectAll}/></th>
                        <th>S.NO</th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('productname') }}>Name <Sorting/></th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('categoryname') }}>Category <Sorting/></th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('price') }}>Price <Sorting/></th>
                        <th onClick={() => { if(setSorttoggle)setSorttoggle(!sorttoggle); sorting('quantity') }}>Quantity <Sorting/></th>
                        <th>Status</th>
                        <th>Seller</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 && data?.map((val: any, key: number) => {
                        return (
                            <tr key={key}>
                                <td><input type='checkbox' checked={checkedItem.includes(val._id)} onChange={handleCheckbox} value={val._id}/></td>
                                <td>{key + 1 + sno}</td>
                                <td>{val?.productname}</td>
                                <td>{val?.categoryname}</td>
                                <td>{val?.price || '-'}</td>
                                <td>{val?.quantity || '-'}</td>
                                <td>{val.productStatus || '-'}</td>
                                <td>{val.sellerDetails?.name}</td>

                                <td>
                                    <button className='btn btn-warning' onClick={() => editProduct(val)}>Edit</button>
                                    <button className='btn btn-danger mx-1' disabled>Delete</button>
                                </td>
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