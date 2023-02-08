import styles from './styles.module.css'
import Select from '../../../component/Dropdown';
import { useEffect, useState } from 'react';
import request from '../../../service/base.service';
import { showNotification } from '../../../component/Toast';


type Tprops = {
    open: boolean
    close: (open: boolean) => void
} & React.DOMAttributes<HTMLDivElement>


const BulkImportPopup: React.FC<Tprops> = ({ open, close }) => {
    const [categoryList, setCategoryList] = useState([])
    const [cateId, setCatId] = useState('')
    const [error,setError]=useState('')
    const categoryNames = async() => {
        await request({ url: '/api/category/category', method: 'get' }).then((res) => {
            if (res.status === 'success') {
                setCategoryList(res?.data)
            }
        })
    }
    const handleChange = (e: any) => {
        setCatId(e.target.value)
    }
    const download = (arrayBuffer) => {
        let arrayBufferNew = new Uint8Array(arrayBuffer);
        let file = URL.createObjectURL(new Blob([arrayBufferNew.buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement("a");
        link.href = file;
        link.setAttribute("download", `${new Date()}.xlsx`);
        document.body.appendChild(link);
        link.click();

    }
    const getTemplate = async () => {
        if(cateId){
            request({ url: '/api/product/getTemplateProduct', method: 'post', data: { categoryId: cateId } }).then(async (res) => {
                if(res?.status==='success'){
                    download(res?.productTemplate?.data)
                    close(false)
                    showNotification(true,res?.message)
                }
            })
        }else{
            setError('Category Id is required')
        }
    }
    useEffect(() => {
        categoryNames()
    }, [])
    return (
        <>
            <div className={styles.modal} style={open ? { display: "block" } : { display: "none" }}>
                <div className={styles.modalContainer}>
                    <div className='row d-flex'>
                        <div className='col-4'>
                            <Select data={categoryList} label='Category Name' handlechange={handleChange}/>
                            {error && cateId===''  ? <p className='error'> {error}</p> : ''}
                        </div>
                        <div className={styles.btnContainer}>
                            <button className="btn btn-primary" type='button' disabled={cateId ? false : true} onClick={() => getTemplate()}>Submit</button>
                        </div>
                        <div className={styles.btnContainer}>
                            <button type='button' className="btn btn-dark" onClick={() => close(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BulkImportPopup