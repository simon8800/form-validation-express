// storages/usersStorage.js
// This class lets us simulate interacting with a database.
class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName, email, age = null, bio = null }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  getUserByName(firstName) {
    for (let id in this.storage) {
      let currentUser = this.storage[id];
      if (firstName === currentUser.firstName.toLowerCase()) {
        return currentUser;
      }
    }
    return -1;
  }

  updateUser(id, { firstName, lastName, email, age = null, bio = null}) {
    this.storage[id] = { id, firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
