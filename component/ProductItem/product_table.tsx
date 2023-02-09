import Table from "../../container/admin/product/table"
import Pagination from "../Pagination"

interface Tprops {
    data?: any,
    sno?: any,
    route?:string,
    sort?:(e:any)=>void,
    setSorttoggle:(e:any)=>void,
    sorttoggle?:boolean,
    pagination?:(e,data)=>void,
    overallPage?:any
}

const ProductTableView: React.FC<Tprops> = ({ data,sno ,route,pagination,overallPage,sort,setSorttoggle,sorttoggle}) => {

    return (
        <>
            <Table data={data} sno={sno} route={route} sort={sort} setSorttoggle={setSorttoggle} sorttoggle={sorttoggle}/>
            {data.length > 0 && <Pagination page={overallPage} variant='outlined' shape='rounded' pagination={(e: any, data: any) => {pagination && pagination(e, data)}} />}

        </>
    )
}
export default ProductTableView