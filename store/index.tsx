import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import sourceSlice from './Slices/sourceSlice';
import contactSlice from './Slices/contactSlice';
import branchSlice from './Slices/branchSlice';
import userSlice from './Slices/userSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    contacts: contactSlice,
    source: sourceSlice,
    branch: branchSlice,
    user: userSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof rootReducer>;
