const RegisterRole = ({ register, errors }) => {
    return (
        <>
            <div >
                <input {...register('role')} type="radio" value="SELLER" className="m-2"/>Seller
                <input {...register('role')} type="radio" value="OTHER" className="m-2" />Buyer
                <input {...register('role')} type="radio" value="ADMIN" disabled className="m-2"/>Admin
            </div>
            {errors && <p className="error">{errors}</p>}

        </>
    )
}
export default RegisterRole