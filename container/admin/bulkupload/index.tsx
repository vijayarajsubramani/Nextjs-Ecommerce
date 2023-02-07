import { useEffect, useRef, useState } from "react"
import Select from "../../../component/Dropdown"
import request from "../../../service/base.service"
import BulkImportPopup from "./bulkImportpop"

const AdminbulkUploadProduct = () => {
    const [openbulkImport, setOpenbulkimport] = useState(false)
    const [selleList, setSellerList] = useState([])
    let inputElement: any = useRef(null);
    const sellNames = () => {
        request({ url: '/api/user/user', method: 'get' }).then((res) => {
            if (res.status === 'success') {
                setSellerList(res?.data)
            }
        })
    }
    const handler=async():Promise<void>=>{
        if(inputElement){
            inputElement?.current.click()
        }
    }
    const fileHandler = async(e:any) => {
        console.log('e.target.files',e.target.files)
        try{
            const formData=new FormData();
            formData.append('file',e?.target.files[0])
            // const headers ={'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            request({url:'/api/product/bulkuploadproduct',method:'patch',data:formData}).then((res)=>{
                console.log('res')
            })
        }catch(err){

        }
    }

    useEffect(() => {
        // sellNames()
    }, [])
    return (
        <>
            <div className="row m-2">
                <div className="col-3 my-4">
                    <button className='btn btn-info mx-1' onClick={() => setOpenbulkimport(true)}>Download Template</button>
                </div>
            </div>
            <div className="row m-2">
                <div className="col-4">
                    <Select data={selleList} label='Seller list' />
                </div>
                <div className="col-3 my-4">
                    <button className='btn btn-warning' onClick={handler}>Upload Products</button>
                    <input type="file" className="hideContent" ref={inputElement}  accept=".xlsx" onChange={fileHandler} onClick={(e: any) => { e.target.value === null }}/>
                </div>
            </div>
            {openbulkImport && <BulkImportPopup open={openbulkImport} close={() => setOpenbulkimport(false)} />}
        </>
    )
}
export default AdminbulkUploadProduct