import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice.js";
import { persistReducer, persistStore } from "redux-persist";
const rootReducer = combineReducers({ user: userReducer });

const myCustomStorage = {
  // جلب البيانات
  getItem: (key) => {
    return new Promise((resolve) => {
      const data = localStorage.getItem(key);
      resolve(data);
    });
  },
  // حفظ البيانات
  setItem: (key, value) => {
    return new Promise((resolve) => {
      localStorage.setItem(key, value);
      resolve();
    });
  },
  // حذف البيانات
  removeItem: (key) => {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage : myCustomStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
