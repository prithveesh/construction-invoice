import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import invoiceReducer from '../features/invoice/slice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    invoice: invoiceReducer,
  },
});
