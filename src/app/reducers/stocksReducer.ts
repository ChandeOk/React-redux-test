import { AnyAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store/store';
import { token } from '../..';

export interface IStocksState {
  stocks: IStock[];
  status: 'idle' | 'loading' | 'failed';
}

export interface IStock {
  symbol: string;
  companyName: string;
  low: number;
  high: number;
  week52High: number;
  week52Low: number;
  changePercent: number;
}

const initialState: IStocksState = {
  stocks: [],
  status: 'idle',
};


export const fetchStocks = async (dispatch: AppDispatch, getState: RootState) => {
  dispatch({type: 'FETCH'});
  try {
    const response = await fetch('https://cloud.iexapis.com/stable/stock/market/collection/sector?collectionName=Technology&token=' + token);
    const data: IStock[] = await response.json();
    dispatch({type: 'DONE', payload: data.slice(0, 24)});
  } catch (e) {
    dispatch({type: 'ERROR'});
  }

};

export const reorder = (list: IStock[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};  

export const stockReducer = (state = initialState, action: AnyAction): IStocksState => {
  switch (action.type) {
    case 'FETCH':
      return {...state, status: 'loading'};
    case 'DONE':
      return {...state, status: 'idle', stocks: action.payload};
    case 'REORDER':
      return {...state, stocks: reorder(state.stocks, action.payload.start, action.payload.end)}
    case 'ERROR':
      return {...state, status: 'failed', stocks: []}
    default:
      return state;
  }
}