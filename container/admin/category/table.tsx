
interface Tprops {
    data?: any,
    sno?: any,
    searchtext?: (e: any) => void,
    text?: string,
    editpost?: (val: any) => void,
    editCategory?:(item:any)=>void,
    deleteCategory?:(item:any)=>void
}

const Table: React.FC<Tprops> = ({ data,sno,editCategory,deleteCategory }) => {

    return (
        <>
            <table className='styled-table w-100 mx-3'>
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 && data?.map((val: any, key: number) => {
                        return (
                            <tr key={key}>
                                <td>{key + 1+sno}</td>
                                <td>{val.name}</td>
                                <td>
                                    <button className='btn btn-warning' onClick={()=>{if(editCategory)editCategory(val)}}>Edit</button>
                                    <button className='btn btn-danger mx-1' onClick={()=>{if(deleteCategory)deleteCategory(val._id)}} disabled>Delete</button>
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