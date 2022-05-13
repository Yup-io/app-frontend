import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'

let composeEnhancers
let middleware


if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger()
  composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 }) || compose
  middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
} else if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose

  middleware = applyMiddleware(
    thunkMiddleware
  )
}

const store = createStore(
  combineReducers({
    ...reducers
  }),
  composeEnhancers(middleware)
)

export default store
