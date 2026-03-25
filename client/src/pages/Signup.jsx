import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-centernter font-semibold my-7">Sign Up</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button
          disabled
          className="bg-slate-700 p-3 disabled:opacity-80 disabled:cursor-auto text-white rounded-lg uppercase hover:opacity-95 cursor-pointer"
          type="submit"
        >
          Sign up
        </button>
      </form>
      <div className="flex flex-row gap-5 mt-5">
        <p>Have an account? </p>
        <Link to="/signin">
          <span className="text-blue-500 hover:opacity-80">Sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
