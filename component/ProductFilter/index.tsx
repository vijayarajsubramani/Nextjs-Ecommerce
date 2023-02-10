import { useEffect, useState } from "react"
import request from "../../service/base.service"

interface Tprops {
    setsearchvalue?: (e: string) => void,
    setSortObj?: (e: any) => void
    setFilterObj?: any
}
const ProductFilter: React.FC<Tprops> = ({ setsearchvalue, setSortObj, setFilterObj }) => {
    const [categoryList, setCategoryList] = useState([])

    const categoryNames = async () => {
        await request({ url: '/api/category/category', method: 'get' }).then((res) => {
            if (res.status === 'success') {
                setCategoryList(res?.data)
            }
        })
    }
    const searchProduct = (value: any) => {
        if (setsearchvalue) {
            setsearchvalue(value)
        }
    }
    const sortProduct = (value: any) => {
        if (setSortObj) {
            setSortObj(value)
        }
    }
    const categoryFilter = (value: any) => {
        if (setFilterObj) {
            setFilterObj({ categoryName: value })
        }
    }
    useEffect(() => {
        categoryNames()
    }, [])
    return (
        <>
            <div style={{ width: '99%', cursor: 'pointer' }} className='d-flex m-2 row border shadow p-2 rounded'>
                <div className='col d-flex justify-content-end'>
                    <select className="w-25 mx-1" onChange={(e: any) => categoryFilter(e.target.value)}>
                        <option value=''>Choose Category</option>
                        {categoryList?.length ? categoryList?.map((item: any, index) => {
                            return (
                                <option key={index} value={item.name}>{item.name}</option>
                            )
                        }) : <option></option>}
                    </select>
                        <input className="border-radius-2 w-50 " placeholder="Search Product" type='text' onChange={(e: any) => { searchProduct(e.target.value) }} />
                </div>
                <div className='col-5 d-flex justify-content-end' >
                    <select className="rounded-pill w-25" onChange={(e: any) => sortProduct(e.target.value)}>
                        <option value='price-ASC'>Sort</option>
                        <option value='createdAt-DESC'>ASC</option>
                        <option value='createdAt-DESC'>DESC</option>
                        <option value='price-ASC'>PRICE</option>
                    </select>
                </div>
            </div>
        </>
    )
}
export default ProductFilter