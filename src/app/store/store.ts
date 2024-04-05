import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { stockReducer } from '../reducers/stocksReducer';

export const store = configureStore({
  reducer: {
    stocks: stockReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
