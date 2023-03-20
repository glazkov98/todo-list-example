/**
 * This class is used to interact with the browser's local storage.
 * @class
 */
class Storage {
    
    /**
     * This method is used to retrieve the value of a given key from the local storage.
     * @param {string} key - The key for which the value needs to be retrieved.
     * @returns {any} Returns the value for the given key from the local storage.
     */
    get(key) {
        return localStorage.getItem(key);
    }

    /**
     * This method is used to set the value of a given key in the local storage.
     * @param {*} key - The key for which the value needs to be set.
     * @param {*} value - The value that needs to be set.
     */
    set(key, value) {
        localStorage.setItem(key, value);
    }
}