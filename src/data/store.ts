import { configureStore } from '@reduxjs/toolkit'
import reducer from "./reducer";

export type RootState = ReturnType<typeof reducer>;

export const createApplicationStore = (preloadedState: RootState | undefined) => {
    const store = configureStore({
        reducer,
        devTools: true,
        preloadedState,
        // middleware: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    });


    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && module.hot) {
        // @ts-ignore
        module.hot.accept('./reducer', () => store.replaceReducer(reducer));
    }

    return store;
};