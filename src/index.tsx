import React from 'react'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'

import App from './components/App'
import configureStore from './store/configureStore'

const history = createBrowserHistory()

const store = configureStore()
const jsx = (
	<Provider store={store}>
		<Router history={history}>
			<Route path={'/'} component={App} />
		</Router>
	</Provider>
)

ReactDOM.render(jsx, document.getElementById('container'))
