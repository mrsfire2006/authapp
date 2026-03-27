import React from "react";
import { useSelector } from "react-redux";
function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const handleUpdate = (e) =>{
e.preventDefault();
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <img
          src={currentUser.profilePicture}
          alt="profile"
          className="cursor-pointer mt-4 rounded-full object-cover h-24 w-24 self-center"
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
        />
        <button
        
          type="submit"
          className="bg-slate-700 mt-5 text-white p-3 cursor-pointer rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          UPdate
        </button>
        <div className="flex flex-row justify-between mt-5">
          <span className="text-red-700 cursor-pointer hover:opacity-95">Delete Account</span>
          <span className="cursor-pointer hover:opacity-95">Sign out</span>
        </div>
      </form>
    </div>
  );
}

export default Profile;
