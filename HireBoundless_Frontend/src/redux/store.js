import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import slices
import { loginUserSlice } from "./slices/loginUserSlice";
import { signupUserSlice } from "./slices/signupUserSlice";
import { verifyOtpSlice } from "./slices/verifyOtpSlice";
import { forgotPasswordSlice } from "./slices/forgotPasswordSlice";
import { resetPasswordSlice } from "./slices/resetPasswordSlice";
import { companyCreateSlice } from "./slices/companyCreateSlice";
import { getUserSlice } from "./slices/getUserSlice";
import { jobPostSlice } from "./slices/postJobSlice";
import { getCompanySlice } from "./slices/getCompanySlice";
import { updateCompanySlice } from "./slices/updateCompanySlice";
import { getJobsSlice } from "./slices/getJobsSlice";
import { postApplicationSlice } from "./slices/postApplicationSlice";

// Configure persist
const persistConfig = {
  key: "root",
  storage,

};

// Combine all reducers
const combinedReducer = combineReducers({
  loginUser: loginUserSlice.reducer,
  signupUser: signupUserSlice.reducer,
  verifyOtp: verifyOtpSlice.reducer,
  forgotPassword: forgotPasswordSlice.reducer,
  resetPassword: resetPasswordSlice.reducer,
  companyCreate: companyCreateSlice.reducer,
  getUser: getUserSlice.reducer,
  jobPost: jobPostSlice.reducer,
  getCompany: getCompanySlice.reducer,
  updateCompany: updateCompanySlice.reducer,
  getJobs: getJobsSlice.reducer,
  postApplication: postApplicationSlice.reducer
});

// Handle reset state on logout
const rootReducer = (state, action) => {
  if (action.type === 'logout') {
    // Clear out state completely on logout
    storage.removeItem('persist:root'); // Clear persisted storage
    state = undefined;
  }
  return combinedReducer(state, action);
};

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Export persistor to clear persisted state
export const persistor = persistStore(store);
export default store;
