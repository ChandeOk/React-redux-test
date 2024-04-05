import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { IStocksState, fetchStocks, reorder } from './app/reducers/stocksReducer';
import {  RootState } from './app/store/store';
import { useEffect, useState } from 'react';
import Controls from './components/Controls';
import './App.css';

interface IAppProps {
  stocks: IStocksState,
  fetchStocks: Function;
  emitReorder: (start: number, end: number) => any;
}

const perPage = 10;

function App({stocks, fetchStocks, emitReorder}: IAppProps) {
  const [curPage, setCurPage] = useState(1);
  const pages = Math.ceil(stocks.stocks.length / perPage);
  const firstItem = curPage * perPage - perPage;
  const lastItem = curPage * perPage;

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination)
      return;

    emitReorder(result.source.index, result.destination.index);
  }

  const onNextClick = () => setCurPage(prev => prev + 1);
  const onBackClick = () => setCurPage(prev => prev - 1);

  if (stocks.status === 'loading')
    return <div className="App"><h2 className='status'>LOADING...</h2></div>


  if (stocks.status === 'failed') 
    return <div className="App"><h2 className='status'>Failed, please try again later...</h2></div>

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {
            (provided) => 
              (<table ref={provided.innerRef} cellPadding={0} cellSpacing={0} border={0}> 
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Low</th>
                    <th>High</th>
                    <th>% change</th>
                    <th>52 Low</th>
                    <th>52 High</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.stocks.slice(firstItem, lastItem).map((s, i) => (
                    <Draggable key={s.symbol} draggableId={s.symbol} index={firstItem + i}>
                      {
                        (provided) => (
                          <tr ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}
                          style={
                            provided.draggableProps.style
                          }>
                            <td>{s.symbol}</td>
                            <td>{s.companyName}</td>
                            <td>{s.low}</td>
                            <td>{s.high}</td>
                            <td>{s.changePercent}</td>
                            <td>{s.week52Low}</td>
                            <td>{s.week52High}</td>
                          </tr>
                        )
                      }
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>)
          }
        </Droppable>
      </DragDropContext>
      <Controls currentPage={curPage} totalPages={pages} onBack={onBackClick} onNext={onNextClick}/>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  stocks: state.stocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  fetchStocks: () => dispatch(fetchStocks),
  emitReorder: (start: number, end: number) => dispatch({type: 'REORDER', payload: {start, end}})
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
