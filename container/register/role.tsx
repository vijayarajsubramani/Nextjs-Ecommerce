const RegisterRole = ({register,errors}) => {
    return (
        <>
            <input {...register('role')} type="radio" value="SELLER" />Seller
            <input {...register('role')} type="radio" value="ADMIN" />Admin
            <input {...register('role')} type="radio" value="OTHER" />Other
            {errors && <p className="error">{errors}</p>}

        </>
    )
}
export default RegisterRole