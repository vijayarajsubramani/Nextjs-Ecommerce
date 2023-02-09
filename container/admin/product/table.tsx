import { useRouter } from 'next/router'
import { useContext } from 'react'
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

    const editProduct = (id: any) => {
        router.push(`${route}/${id._id}`)
    }
    const sorting = (e: string) => {
        sorttoggle ? sort({ [e]: 1 }) : sort({ [e]: -1 })
    }

    return (
        <>
            <table className='styled-table w-100 mx-3'>
                <thead>
                    <tr style={{cursor:'pointer'}}>
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