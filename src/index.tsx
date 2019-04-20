import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'

import App from './components/App'
import configureStore from './store/configureStore'

const store = configureStore()
const jsx = (
	<Provider store={store}>
		<Router>
			<Route path={'/'} component={App} />
		</Router>
	</Provider>
)

ReactDOM.render(jsx, document.getElementById('container'))
