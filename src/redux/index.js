import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

import authSlice from './slice/authSlice'; // Import your auth slice reducer
import organizationSlice from './slice/organizationSlice';
import departmentSlice from './slice/departmentSlice';
import employeeSlice from './slice/employeeSlice';
import locationSlice from './slice/locationSlice';
import locatorSlice from './slice/locatorSlice';
import uomSlice from './slice/uomSlice';
import userSlice from './slice/userSlice';
import vendorSlice from './slice/vendorSlice';
import itemSlice from './slice/itemSlice';
import ohqSlice from './slice/ohqSlice';
// import orgMasterSlice from './slice/orgMasterSlice'



const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // Persist only the 'auth' slice
};
const rootReducer = combineReducers({
  auth: authSlice,
  organizations: organizationSlice,
  departments: departmentSlice,
  employees: employeeSlice,
  locations: locationSlice,
  locators: locatorSlice,
  uoms: uomSlice,
  users: userSlice,
  vendors: vendorSlice,
  item: itemSlice,
  ohq: ohqSlice,
  // orgMaster: orgMasterSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })

});

export const persistor = persistStore(store);
export default store;