import Login from "../../container/login"
import GuestAuth from "../../routes/publicRoutes"

const LoginPage = () => {
    return (
        <>
          <Login/>
        </>
    )
}
export default GuestAuth(LoginPage)