import Table from "./table"
import styles from './styles.module.css'
import request from "../../../service/base.service"
import { useContext, useEffect, useState } from "react"
import { showNotification } from "../../../component/Toast"
import Pagination from "../../../component/Pagination"
import { DataContext } from "../../../context/user"
import Loader from "../../../component/Loader"


const AllUser = () => {
    const [data, setData] = useState<string[]>([])
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(5)
    const [sno, setSno] = useState<number>(0)
    const [overallPage, setOverallpage] = useState<number>(1)
    const [filterObj, setFilterObj] = useState({ field: 'all', value: '', role: 'SELLER' })
    const [sortObj, setSortObj] = useState({ createdAt: 1 })
    const [isLoader, setisLoader] = useState(false)

    const getUsers = async () => {
        const payload = { page: page, limit: limit, filterObj: filterObj, sortObj: sortObj }
        setisLoader(true)
        await request({ url: '/api/user/user', method: 'post', data: payload }).then((res: any) => {
            if (res.status === 'success') {
                setisLoader(false)
                setData(res?.data)
                setOverallpage(Math.ceil((res.totalcount / limit)))
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }
    const pagination = (e: any, data: any) => {
        e.preventDefault();
        let pag: number = 0
        setPage(data)
        if (data !== 0) {
            pag = limit * (data - 1)
            setSno(pag)
        }
    }
    useEffect(() => {
        getUsers()
    }, [page, limit, filterObj.value])
    return (
        <>
            <div className={styles.registerForm}>
                {isLoader ? <Loader/> :
                    <div className="w-100">
                        <div className="row">
                            <div className="col-6">
                            <input type='text' placeholder="search" value={filterObj.value} onChange={(e: any) => setFilterObj({ ...filterObj, value: e.target.value })}  className={styles.input}/>
                            </div>
                        </div>
                        <div className="w-100 mx-3">
                            <Table data={data} sno={sno} reload={getUsers}/>
                            {data.length > 0 && <Pagination page={overallPage} variant='outlined' shape='rounded' pagination={(e: any, data: any) => pagination(e, data)} />}
                        </div>
                    </div>}
            </div>
        </>
    )
}
export default AllUser