const ProfileImage=({error,avatar})=>{
    return(
        <>
                 <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                  <div className="rounded-circle mt-5">
                
                    </div>  
                    <img className="rounded-circle mt-5" width="150px" src={avatar ?? "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}/>
                    <p className="error">{error}</p>
                    </div>
        </>
    )
}
export default ProfileImage