import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import weatherSlice from './weatherSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, weatherSlice);

const store = configureStore({
  reducer: {
    weather: persistedReducer,
  },
});

export const persistor = persistStore(store);
export default store;
