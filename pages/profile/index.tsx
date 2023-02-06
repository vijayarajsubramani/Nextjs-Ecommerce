import Profile from "../../container/profile";
import GuestAuth from "../../routes/publicRoutes";

const ProfilePage = () => {
  return (
    <>
        <div style={{width: '100%'}} className="d-flex justify-content-center">
            <Profile/>
        </div>
    </>
  );
};
export default GuestAuth(ProfilePage);
