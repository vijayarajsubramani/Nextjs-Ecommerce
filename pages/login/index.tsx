import Title from "../../component/Ttitle"
import Login from "../../container/login"
import GuestAuth from "../../routes/publicRoutes"

const LoginPage = () => {
    return (
        <>
          <Title title="login"/>
          <Login/>
        </>
    )
}
export default GuestAuth(LoginPage)