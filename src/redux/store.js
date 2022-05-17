import { createLogger } from 'redux-logger'
import { configureStore } from '@reduxjs/toolkit';
import * as reducers from './reducers'

export const store = configureStore({
  reducer: { ...reducers },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createLogger())
});
