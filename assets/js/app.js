/**
 * A class that manages a todo list application.
 * @class
 */
class TodoListApp {
    
    /**
     * Constructs a new instance of the TodoListApp class.
     * @param {Object} config - Object with options.
     */
    constructor(config) {
        this.storage = config.storage;
        this.todos = JSON.parse(this.storage.get('todos')) || [];

        this.store = config.createStore(this.todosReducer, this.todos);

        this.rootAppElem = document.querySelector(config.selector);
        this.todoListElem = this.rootAppElem.querySelector('.todo-list-items');
        this.todoForm = this.rootAppElem.querySelector('.todo-form');
        this.todoForm.addEventListener('submit', e => {
            e.preventDefault();
            this.submit(e);
        });

        const state = this.store.getState();
        const lastItem = state[state.length - 1];
        this.lastId = lastItem ? lastItem.id : 0;

        this.checkEmpty();

        this.render();
    }

    /**
     * Checks if there are todos in the store and if not, displays a message.
     */
    checkEmpty() {
        const state = this.store.getState();
        if (state.length == 0) {
            this.todoListElem.insertAdjacentHTML('beforeend', '<h2 class="todos-not-found">Todos not found</h2>');
        } else {
            const textNotFound = this.todoListElem.querySelector('.todos-not-found');
            if (textNotFound != null) textNotFound.remove();
        }
    }

    /**
     * Adds a new todo to the store.
     * @param {Object} item - The todo item.
     */
    add(item) {
        const {id, title, completed, date} = item;
        this.store.dispatch({
            type: 'ADD_TODO',
            id,
            title,
            completed,
            date
        });
        this.storage.set('todos', JSON.stringify(this.store.getState()));
        this.checkEmpty();
        this.renderItem(item, 'actionAddItem');
    }

    /**
     * Toggles the completed property of the todo with the given id.
     * @param {number} id - The id of the todo.
     */
    toggle(id) {
        this.store.dispatch({
            type: 'TOGGLE_TODO',
            id
        });
        this.storage.set('todos', JSON.stringify(this.store.getState()));
        this.renderItem({id}, 'actionUpdateItem');
    }

    /**
     * Removes the todo with the given id from the store.
     * @param {number} id - The id of the todo.
     */
    remove(id) {
        this.store.dispatch({
            type: 'REMOVE_TODO',
            id
        });
        this.storage.set('todos', JSON.stringify(this.store.getState()));
        this.renderItem({id}, 'actionRemoveItem');
        this.checkEmpty();
    }

    /**
     * Submits the form to add a new todo.
     * @param {Object} e - The submit event.
     */
    submit(e) {
        const inputElem = e.target.querySelector('.todo-form-input');
        const item = {};
        const {lastId} = this;
        let inputText = inputElem.value;
        inputText = inputText.trim();
        inputText = inputText.replace(/\s+/i, ' ');
        
        if (inputText) {
            item.id = lastId + 1;
            item.title = inputText;
            item.completed = false;
            item.date = Date.now();
            
            this.add(item);
            this.lastId = item.id;
            
            inputElem.value = '';
        }
    }

    /** Renders the todos in the store. */
    render() {
        const todos = this.store.getState();
        todos.forEach(item => {
            this.renderItem(item, 'actionAddItem');
        });
    }

    /**
     * Renders a todo item based on the given action.
     * @param {Object} item - The todo item.
     * @param {string} action - The action to perform on the todo item.
     */
    renderItem(item, action) {
        this[action](item);
    }

    /**
     * Adds a new todo item to the todoListElem.
     * @param {Object} item - The todo item.
     */
    actionAddItem(item) {
        const todoListElem = document.createElement('li');
        const todoListTextElem = document.createElement('span');
        const todoListToggleBtnElem = document.createElement('button');
        const todoListDeleteBtnElem = document.createElement('button');
            
        todoListElem.classList.add('list-group-item');
        todoListElem.classList.add('todo-list-item');
            
        if (item.completed) todoListElem.classList.add('completed');
            
        todoListElem.dataset.id = item.id;
            
        todoListTextElem.classList.add('todo-list-item-text');
        todoListTextElem.innerText = item.title;
            
        todoListToggleBtnElem.classList.add('todo-list-item-btn-complete');
        todoListToggleBtnElem.classList.add('btn');
        todoListToggleBtnElem.classList.add('btn-success');
        todoListToggleBtnElem.innerText = 'Complete';
        todoListToggleBtnElem.addEventListener('click', () => {
            this.toggle(item.id);
        });

        todoListDeleteBtnElem.classList.add('todo-list-item-btn-remove');
        todoListDeleteBtnElem.classList.add('btn');
        todoListDeleteBtnElem.classList.add('btn-danger');
        todoListDeleteBtnElem.innerText = 'Delete';
        todoListDeleteBtnElem.addEventListener('click', () => {
            this.remove(item.id);
        });
            
        todoListElem.insertAdjacentElement('beforeend', todoListTextElem);
        todoListElem.insertAdjacentElement('beforeend', todoListToggleBtnElem);
        todoListElem.insertAdjacentElement('beforeend', todoListDeleteBtnElem);

        this.todoListElem.insertAdjacentElement('beforeend', todoListElem);
    }

    /**
     * Updates the completed status of the todo item in the todoListElem.
     * @param {Object} item - The todo item.
     */
    actionUpdateItem(item) {
        const todosElements = this.todoListElem.querySelectorAll('.todo-list-item');
        todosElements.forEach(todoEl => {
            if (todoEl.dataset.id == item.id) {
                todoEl.classList.toggle('completed');
            }
        });
    }

    /**
     * Removes the todo item from the todoListElem.
     * @param {Object} item - The todo item.
     */
    actionRemoveItem(item) {
        const todosElements = this.todoListElem.querySelectorAll('.todo-list-item');
        todosElements.forEach(todoEl => {
            if (todoEl.dataset.id == item.id) {
                todoEl.remove();
            }
        });
    }

    /**
     * A reducer function for the store.
     * @param {Array} state - The current state of the store.
     * @param {Object} action - The action to apply to the store.
     * @returns {Array} - The new state of the store.
     */
    todosReducer(state, action) {
        switch (action.type) {
            case 'ADD_TODO':
                return [
                    ...state,
                    {
                        id: action.id,
                        title: action.title,
                        completed: action.completed,
                        date: action.date
                    }
                ];
            case 'TOGGLE_TODO':
                return state.map(todo => {
                    if (todo.id === action.id) {
                        return { ...todo, completed: !todo.completed };
                    }
                    return todo;
                });
            case 'REMOVE_TODO':
                state.map(todo => {
                    if (todo.id === action.id) {
                        const index = state.indexOf(todo);
                        state.splice(index, 1);
                    }
                });
                return state;
            default:
                return state;
        }
    }
}

const todoApp = new TodoListApp({
    selector: '#app',
    createStore,
    storage: new Storage()
});