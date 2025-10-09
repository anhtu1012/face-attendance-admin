import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./RootReducer";

// Minimal typed interface for storage used by redux-persist
interface PersistStorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Use real localStorage in browser, otherwise provide a noop implementation for SSR
const storageImpl: PersistStorageLike =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    ? {
        getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key: string, value: string) => {
          localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : {
        getItem: (key: string) => {
          void key;
          return Promise.resolve(null);
        },
        setItem: (key: string, value: string) => {
          void key;
          void value;
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          void key;
          return Promise.resolve();
        },
      };

// Cấu hình redux-persist
const persistConfig = {
  key: "root", // Key để lưu trong storage
  // redux-persist accepts a storage-like object; cast through unknown to satisfy types without using `any`
  storage: storageImpl as unknown as PersistStorageLike,
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
