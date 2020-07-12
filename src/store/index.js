import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import reducers from '../reducers';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['settings']
};

export function configureStore(initialState) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        persistReducer(persistConfig, reducers),
        initialState,
        composeEnhancers(applyMiddleware(Thunk))
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/index', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }
    const persistor = persistStore(store);
    return { store, persistor };
}
