import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../features/user/userSlice.js";
import { useSelector, useDispatch } from "react-redux";
function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // 1. مراقبة تغيير المدخلات النصية
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 2. معالجة اختيار صورة
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 3. دالة رفع الصورة لـ Supabase
  const handleUploadImage = async (file) => {
    setImageUploadLoading(true);
    setUploadProgress(0);
    try {
      const fileExt = file.name.split(".").pop(); // الامتداد (jpg, png...)

      // الحصول على اسم الصورة الأصلي بدون الامتداد
      const originalName = file.name.split(".").slice(0, -1).join(".");

      // دمج (رقم صحيح) + (اسم الصورة) + (الامتداد)
      const fileName = `${Date.now()}_${originalName}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            const roundedPercent = Math.round(percent);
            console.log("Progress:", roundedPercent);
            setUploadProgress(Math.round(roundedPercent));
          },
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // نضع رابط الصورة المرفوعة داخل الـ formData
      setFormData((prev) => ({ ...prev, profilePicture: data.publicUrl }));
      setImageUploadLoading(false);
    } catch (error) {
      setImageUploadLoading(false);
      console.log(error.message);
    }
  };

  // تفعيل الرفع بمجرد اختيار الصورة
  useEffect(() => {
    if (image) {
      handleUploadImage(image);
    }
  }, [image]);

  // 4. دالة تحديث الملف الشخصي بالكامل
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      // ملاحظة: هنا يجب أن ترسل الـ formData إلى الـ Backend (Node.js) الخاص بك
      // سأفترض هنا مثالاً لطلب الـ API:
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      // إذا نجح السيرفر في التحديث، نحدث الـ Redux Store
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <input
          onChange={handleImageChange}
          accept="image/*"
          type="file"
          ref={fileRef}
          hidden
        />

        <div className="self-center relative">
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt="profile"
              className={`cursor-pointer mt-4 rounded-full object-cover h-24 w-24 ${imageUploadLoading ? "opacity-40" : ""}`}
              onClick={() => fileRef.current.click()}
            />

            {imageUploadLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: "58%", // لضبطه في منتصف الصورة تقريباً (مع مراعاة الـ mt-4)
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* الدائرة الخلفية الرمادية (اختياري لجعل الشكل أجمل) */}
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={60}
                  sx={{
                    color: (theme) => theme.palette.grey[300],
                    position: "absolute",
                  }}
                />

                {/* دائرة التحميل الفعلية */}
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={60}
                  thickness={4}
                />

                {/* النسبة المئوية في المنتصف */}
                <Box
                  sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", fontSize: "10px" }}
                  >
                    {`${uploadProgress}%`}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </div>

        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />

        <button
          disabled={loading || imageUploadLoading}
          type="submit"
          className="bg-slate-700 mt-5 text-white p-3 cursor-pointer rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading || imageUploadLoading ? "Loading..." : "Update"}
        </button>

        <div className="flex flex-row justify-between mt-5">
          <span className="text-red-700 cursor-pointer hover:opacity-95 font-medium">
            Delete Account
          </span>
          <span className="cursor-pointer hover:opacity-95 font-medium">
            Sign out
          </span>
        </div>
      </form>

      {updateSuccess && (
        <p className="text-green-700 mt-5 text-center font-semibold">
          User is updated successfully!
        </p>
      )}
    </div>
  );
}

export default Profile;
