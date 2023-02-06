import Title from "../../component/Ttitle"
import Register from "../../container/register"
import GuestAuth from "../../routes/publicRoutes"

const RegisterPage = () => {
    return (
        <>
          <Title title="Register"/>
          <Register/>
        </>
    )
}
export default GuestAuth(RegisterPage)