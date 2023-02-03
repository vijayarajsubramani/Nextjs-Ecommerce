import Sidebar from "../../component/Sidebar";
import Profile from "../../container/profile";
import GuestAuth from "../../routes/publicRoutes";

const ProfilePage = () => {
  return (
    <>
      <div className="sideeMenu">
        <Sidebar />
        <div>
            <Profile/>
        </div>
      </div>
    </>
  );
};
export default GuestAuth(ProfilePage);
