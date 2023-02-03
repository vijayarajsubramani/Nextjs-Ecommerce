import Image from "next/image";
import styles from './styles.module.css'
import Logo from '../../assets/plus.svg'
import { useContext, useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CreateAddress from "../../container/address";
import BasicModal from "../Modal";
import request from "../../service/base.service";
import { DataContext } from "../../context/user";
import { showNotification } from "../Toast";
import Loader from "../Loader";
import { useRouter } from "next/router";

const AddressCard = () => {
    const router = useRouter()
    const { state } = useContext(DataContext)
    const [selectiveAddress, setSelectiveAddress] = useState<any>()
    const [address, setAddress] = useState<any>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)

    console.log('router.pathname', router.pathname)


    const getAddress = async () => {
        try {
            const payload = { buyerId: state?.auth?.user?._id }
            if (payload.buyerId) {
                setLoading(true)
                await request({ url: '/api/address/get', method: 'post', data: payload }).then((res: any) => {
                    if (res.status === 'success') {
                        setLoading(false)
                        setAddress(res.data)
                    }
                })
            }
        } catch (error: any) {
            showNotification(false, error)
        }
    }
    const deleteAddress = async (id: string) => {
        try {
            await request({ url: '/api/address/address', method: 'delete', data: { buyerId: state?.auth?.user?._id, addressId: id } }).then((res: any) => {
                if (res.status === 'success') {
                    getAddress()
                }
            })
        } catch (error: any) {
            showNotification(false, error)
        }
    }
    const confirmOrder = (id: string) => {
        if (router.pathname === '/deliveryaddress') {
            router.push(`/confirmorder/${id}`)
        }
    }

    const editAddress = (val: any) => {
        setOpen(true)
        setSelectiveAddress(val)
    }
    useEffect(() => {
        getAddress()
    }, [state.auth])

    return (

        <>
            <div className="d-flex m-5">
                <div className={styles.addBtn}>
                    <span className={styles.addIcon} onClick={() => { setOpen(true); setSelectiveAddress(null) }}>
                        <Image src={Logo} alt="add Address" width='100' height='100' style={{ fill: 'gray' }} />
                    </span>
                </div>
                {loading ? <Loader /> : <div className="row mx-2">
                    {address?.map((item: any, index: number) => (
                        <div className={`${styles.card} m-2`} key={item?._id}>
                            <div className="row" onClick={() => confirmOrder(item?._id)}>
                                <div className="col-6">
                                    <p className='card-title'>{item?.name}</p>
                                    <p className='card-text'>{item?.mobile}</p>
                                </div>
                                <div className="col-6">
                                    <p className='card-text'>{item?.address}</p>
                                    <p className='card-text'>{item?.city}</p>
                                    <p className='card-text'>{item?.district}</p>
                                    <p className='card-text'>{item?.state}</p>
                                    <p className='card-text'>{item?.pincode}</p>
                                </div>
                            </div>

                            <div className={styles.btmCard}>
                                <p><EditIcon onClick={() => editAddress(item)} /></p>
                                <p><DeleteOutlineIcon onClick={() => deleteAddress(item._id)} /></p>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>
            {open && <BasicModal open={open} setOpen={setOpen} component={<CreateAddress value={selectiveAddress} reload={getAddress} close={setOpen} />} />}

        </>
    )
}
export default AddressCard