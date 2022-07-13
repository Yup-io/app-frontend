import { configureStore } from '@reduxjs/toolkit';
import * as reducers from './reducers';

export const store = configureStore({
  reducer: { ...reducers },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
