import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../Redux/authSlice'
const store = configureStore({
  reducer: {
    auth:authSlice
  },
});

export default store;
