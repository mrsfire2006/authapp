import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
function Signin() {
  const [form, setForm] = useState({});
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => {
    return state.user.loading;
  });
  const error = useSelector((state) => {
    return state.user.error;
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="bg-slate-700 p-3 disabled:opacity-80 disabled:cursor-auto text-white rounded-lg uppercase hover:opacity-95 cursor-pointer"
          type="submit"
        >
          {isLoading ? <CircularProgress /> : "Sign In"}
        </button>
      </form>
      <div className="flex flex-row gap-5 mt-5">
        <p>Don&rsquo;t have an account? </p>
        <Link to="/signup">
          <span className="text-blue-500 hover:opacity-80">Sign up</span>
        </Link>
      </div>
      <div>
        {error && (
          <p className="text-red-500 mt-5">
            {error.email || error.password || error.invalid}
          </p>
        )}
      </div>
    </div>
  );
}

export default Signin;
