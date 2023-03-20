/**
 * This function creates a new store object based on a given reducer and initial state.
 * @param {function} reducer - A function that accepts two arguments, state and action, and returns a new state.
 * @param {Array} initialState - The initial state of the store.
 * @returns {Object} - An object containing two methods: 'dispatch' - a function that accepts an 'action' object and invokes the 'reducer' with the current state and the `action`, returning a new state, 'getState' - a function that returns the current state of the store.
 */
function createStore(reducer, initialState) {
    let state = initialState;
    return {
        dispatch: action => { state = reducer(state, action); },
        getState: () => state,
    }
}