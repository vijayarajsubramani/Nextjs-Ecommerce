import AddressCard from "../../../component/Addresscard";
import Sidebar from "../../../component/Sidebar";
import Title from "../../../component/Ttitle";
import SellerAuth from "../../../routes/privateRoutes/seller";

const Address = () => {
  return (
    <>
        <Title title="address"/>
      <div className="sideeMenu">
        <Sidebar />
        <div>
          <AddressCard />
        </div>
      </div>
    </>
  );
};
export default SellerAuth(Address);
