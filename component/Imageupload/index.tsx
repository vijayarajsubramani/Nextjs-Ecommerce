import { Badge } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import PhotoView from "../Photoview";
import styles from './styles.module.css'

type Tprops = {
    limit: number,
    error?: any,
    tagValue?: any,
    patchValue?: any,
    onSuccess?: (fileName: string, remotepath: any) => void,
    description?: string
}

const Imageuploader: React.FC<Tprops> = ({ description, patchValue, tagValue, error }) => {
    const [totalImage, setToatalimage] = useState<any>(patchValue ? patchValue : [])
    const inputElement: any = useRef(null);
    const uploadHandler = () => {
        if (inputElement) inputElement?.current.click()
    }
    const onDelete = (id: any) => {
        const updateImage = totalImage.filter((element: string, index: any) => index !== id);
        setToatalimage(updateImage)
        tagValue(totalImage)
    }
    const handleImage = async (e: any) => {
        for (const file of e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => { setToatalimage((imgs: any) => [...imgs, reader.result]) };
            reader.onerror = () => { console.log(reader.error); };
        }
    }
    useEffect(() => {
        tagValue(totalImage)
    }, [totalImage])

    useEffect(() => {
        setToatalimage(patchValue)
    }, [patchValue])
    return (
        <>
            <div onClick={uploadHandler} className={styles.image}>
                <input type='file' ref={inputElement} multiple className="hideContent" accept="image/jpg,imgae/png,image/jpeg,image/webp" onChange={handleImage} onClick={(e: any) => { e.target.value = null }} />
                <p>{description}</p>
            </div>
            {patchValue?.length === 0 ? <p className='error'> {error}</p> : ''}
            <div className='d-flex'>
                {totalImage?.map((link: string, index: number) => (
                    <div key={index}>
                        <Badge badgeContent={'X'} color="error" onClick={() => onDelete(index)}>
                        <PhotoView thumbnail={link} />
                        </Badge>
                    </div>
                ))}
            </div>
        </>
    )
}
export default Imageuploader