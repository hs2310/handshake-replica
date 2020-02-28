import { createStore } from "redux";
import rootReducer from "../reducers/index";
// import { login } from "../middleware/index";
// import throttle from 'lodash.throttle';
// import {loadState,saveState} from "../store/localStorage";
// const persistedState = loadState();
// const store = createStore(
//   rootReducer,
//   persistedState
// );
// store.subscribe(throttle(() => {
//   saveState({
//     id: store.getState().id,
//     type: store.getState().type
//   });
// },1000));

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    
    // const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    // const store = createStore(
    //   rootReducer,
    //   storeEnhancers()
    // );
    
    
    window.store = store

    export default store;