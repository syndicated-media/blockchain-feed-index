import React from 'react';
import {render} from 'react-dom';
import routes from './routes';
import './main.scss';

console.log(routes);
render(<routes />, document.getElementById('app'));
