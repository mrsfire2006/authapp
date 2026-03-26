import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function Signup() {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        form,
      );
      if (result.status == 201) {
        console.log(result.statusText);
      }
    } catch (err) {
      setError(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
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
          {isLoading ? <CircularProgress /> : "Sign Up"}
        </button>
      </form>
      <div className="flex flex-row gap-5 mt-5">
        <p>Have an account? </p>
        <Link to="/signin">
          <span className="text-blue-500 hover:opacity-80">Sign in</span>
        </Link>
      </div>
      <div>{error && <p className="text-red-500 mt-5">{error}</p>}</div>
    </div>
  );
}

export default Signup;
