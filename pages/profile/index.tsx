import Sidebar from "../../component/Sidebar";
import Profile from "../../container/profile";
import GuestAuth from "../../routes/publicRoutes";

const ProfilePage = () => {
  return (
    <>
      <div className="sideeMenu">
        <Sidebar />
        <div style={{width: '100%'}} className="d-flex justify-content-center">
            <Profile/>
        </div>
      </div>
    </>
  );
};
export default GuestAuth(ProfilePage);
