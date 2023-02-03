import { useRouter } from 'next/router'
import { useContext } from 'react'
import { DataContext } from '../../../context/user'


interface Tprops {
    data?: any,
    route?: string,
    sno?: any,
}

const Table: React.FC<Tprops> = ({ data, sno, route }) => {
    const { state, dispatch } = useContext(DataContext)

    const router = useRouter()

    const editProduct = (id: any) => {
        router.push(`${route}/${id._id}`)
    }

    return (
        <>
            <table className='styled-table w-100 mx-3'>
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
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