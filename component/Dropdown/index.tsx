import styles from './styles.module.css'
type select = {
    handlechange?: (e: any) => void,
    label?:string,
    error?:any,
    className?:string,
    data: any,
    Id?:string
}

const Select: React.FC<select> = ({ handlechange, data,Id,label,error }) => {
    return (
        <div>
            {label && <label className='dropdown'>{label}</label>}<br/>
            <select className={styles.select} onChange={handlechange} value={Id} >
                <option value=''>Choose {label}</option>
                {data.map((i: any, index: any) => {
                    return (
                        <option key={index} value={i._id} >{i.name}</option>
                    )
                })}
            </select>
            {error ? <p className='error'> {error}</p> : ''}
        </div>
    )
}
export default Select;