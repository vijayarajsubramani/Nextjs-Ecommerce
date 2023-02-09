import { useEffect, useRef, useState } from "react"
import Select from "../../../component/Dropdown"
import Loader from "../../../component/Loader"
import { showNotification } from "../../../component/Toast"
import request from "../../../service/base.service"
import BulkImportPopup from "./bulkImportpop"

const AdminbulkUploadProduct = () => {
    const [openbulkImport, setOpenbulkimport] = useState(false)
    const [selleList, setSellerList] = useState([])
    const [sellerId, setSellerId] = useState('')
    const [error, setError] = useState('')
    const [loading,setLoading]=useState<boolean>(false)

    let inputElement: any = useRef(null);
    const sellNames = () => {
        setLoading(true)
        request({ url: '/api/user/user', method: 'get', data: {} }).then((res) => {
            if (res.status === 'success') {
                setLoading(false)
                setSellerList(res?.data)
            }
        })
    }
    const handler = async (): Promise<void> => {
        if (inputElement) {
            inputElement?.current.click()
        }
    }
    const fileHandler = async (e: any) => {
        try {
            if (sellerId) {
                const formData = new FormData();
                formData.append('file', e?.target.files[0])
                formData.append('sellerId', sellerId)
                const headers = { 'Content-Type': 'multipart/form-data' }
                request({ url: '/api/product/bulkuploadproduct', method: 'post', headers: headers, data: formData }).then((res) => {
                    showNotification(true, res?.message)
                }).catch((err)=>{
                    showNotification(false, err?.data?.message)
                })
            } else {
                setError('sellerId Id is required')
            }
        } catch (err) {

        }
    }
    const handleChange = (e: any) => {
        setSellerId(e.target.value)
    }

    useEffect(() => {
        sellNames()
    }, [])
    return (
        <>
            <div className="row m-2">
                <div className="col-3 my-4">
                    <button className='btn btn-info mx-1' onClick={() => setOpenbulkimport(true)}>Download Template</button>
                </div>
            </div>
            {loading ? <Loader/> :<div className="row m-2">
                <div className="col-4">
                    <Select data={selleList} label='Seller list' handlechange={handleChange} />
                    {error && sellerId === '' ? <p className='error'> {error}</p> : ''}
                </div>
                <div className="col-3 my-4">
                    <button className='btn btn-warning' disabled={sellerId ? false : true} onClick={handler}>Upload Products</button>
                    <input type="file" className="hideContent" ref={inputElement} accept=".xlsx" onChange={fileHandler} onClick={(e: any) => { e.target.value === null }} />
                </div>
            </div>}
            {openbulkImport && <BulkImportPopup open={openbulkImport} close={() => setOpenbulkimport(false)} />}
        </>
    )
}
export default AdminbulkUploadProduct