import GoogleIcon from "@mui/icons-material/Google";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        }),
        credentials: "include",
      });
      const data = await res.json();
      const state = dispatch(signInSuccess(data));
      if (signInSuccess.match(state)) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      onClick={handleOAuth}
      type="button"
      className="bg-red-700 self-center p-5 text-white rounded-xl cursor-pointer hover:opacity-80"
    >
      <GoogleIcon />
    </button>
  );
}

export default OAuth;
