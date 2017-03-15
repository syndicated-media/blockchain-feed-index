import React from 'react';
import {render} from 'react-dom';
import Routes from './routes';
import './main.scss';
import store from './store';

render(<Routes store={store} />, document.getElementById('app'));
