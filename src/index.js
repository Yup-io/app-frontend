import React from 'react'
import { createRoot } from 'react-dom/client'
import Index from './pages/Index'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import * as reducers from './redux/reducers'
import { history } from './utils/history'
import { StylesProvider } from '@material-ui/core/styles'
import './styles.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { composeWithDevTools } from 'redux-devtools-extension'
const { NODE_ENV } = process.env

let composeEnhancers
let middleware

if (NODE_ENV === 'development') {
  const loggerMiddleware = createLogger()
  composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 }) || compose
  middleware = applyMiddleware(
    routerMiddleware(history),
    thunkMiddleware,
    loggerMiddleware
  )
} else if (NODE_ENV === 'production') {
  composeEnhancers = compose

  middleware = applyMiddleware(
    routerMiddleware(history),
    thunkMiddleware
  )
}

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    ...reducers
  }),
  composeEnhancers(middleware)
)

const rootContainer = document.getElementById('root')
const root = createRoot(rootContainer)

root.render(
  <Provider store={store}>
    <StylesProvider injectFirst>
      <Index history={history} />
    </StylesProvider>
  </Provider>
)

serviceWorkerRegistration.register()
