import Register from "../../container/register"
import GuestAuth from "../../routes/publicRoutes"

const RegisterPage = () => {
    return (
        <>
          <Register/>
        </>
    )
}
export default GuestAuth(RegisterPage)