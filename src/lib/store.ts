import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./RootReducer";

// Cấu hình redux-persist
const persistConfig = {
  key: "root", // Key để lưu trong storage
  storage,
};

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ qua kiểm tra serializable nếu có warning
    }),
});

// Tạo persistor để điều khiển lưu trữ
export const persistor = persistStore(store);

// Infer RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
