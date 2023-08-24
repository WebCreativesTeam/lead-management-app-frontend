import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import contactSlice from './Slices/contactSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    contacts: contactSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof rootReducer>;
