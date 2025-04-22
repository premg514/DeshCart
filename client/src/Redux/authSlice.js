import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        userID: localStorage.getItem("userID") || null,
        userRole: localStorage.getItem("userRole") || null
    },
    reducers: {
        setAuthData: (state, action) => {
            const { token, userID, userRole } = action.payload;
            state.token = token;
            state.userID = userID;
            state.userRole = userRole;

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userID", userID);
            localStorage.setItem("userRole", userRole);
        },
        removeAuthData: (state) => {
            state.token = null;
            state.userID = null;
            state.userRole = null;

            // Remove from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            localStorage.removeItem("userRole");
        }
    }
});

export const { setAuthData, removeAuthData } = authSlice.actions;
export default authSlice.reducer;
