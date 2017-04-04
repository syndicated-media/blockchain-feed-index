import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';
import thunk from 'redux-thunk';
import reducers from '../ducks';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(
    applyMiddleware(thunk),
    autoRehydrate()
  )
);

persistStore(store, undefined, (something) => {
  debugger;
});

export default store;
