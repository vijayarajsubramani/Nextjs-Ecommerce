import Table from "../../container/admin/product/table"
import Pagination from "../Pagination"

interface Tprops {
    data?: any,
    sno?: any,
    route?:string,
    pagination?:(e,data)=>void,
    overallPage?:any
}

const ProductTableView: React.FC<Tprops> = ({ data,sno ,route,pagination,overallPage}) => {

    return (
        <>
            <Table data={data} sno={sno} route={route}/>
            {data.length > 0 && <Pagination page={overallPage} variant='outlined' shape='rounded' pagination={(e: any, data: any) => {pagination && pagination(e, data)}} />}

        </>
    )
}
export default ProductTableView