import Title from "../../component/Ttitle";
import ChangePassword from "../../container/changepassword";
import Profile from "../../container/profile";
import GuestAuth from "../../routes/publicRoutes";

const ProfilePage = () => {
  return (
    <>
        <Title title="Profile"/>
        <div style={{width: '100%'}} className="d-flex justify-content-center">
            <Profile/>
            <ChangePassword/>
        </div>
    </>
  );
};
export default GuestAuth(ProfilePage);
