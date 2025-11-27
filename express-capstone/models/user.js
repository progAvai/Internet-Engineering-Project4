// ... (دیتابیس موقت مثل قبل) ...
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 }
];
let nextId = 3;

// توابع را به async تبدیل می‌کنیم که Promise برگردانند
module.exports = {
    getAll: async () => {
        return Promise.resolve(users);
    },

    getById: async (id) => {
        const user = users.find(u => u.id === id);
        return Promise.resolve(user);
    },

    create: async (data) => {
        const newUser = { id: nextId++, ...data };
        users.push(newUser);
        return Promise.resolve(newUser);
    },

    update: async (id, data) => {
        const user = users.find(u => u.id === id);
        if (!user) return Promise.resolve(null);
        
        user.name = data.name || user.name;
        user.email = data.email || user.email;
        user.age = data.age || user.age;
        return Promise.resolve(user);
    },

    remove: async (id) => {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return Promise.resolve(false);
        
        users.splice(userIndex, 1);
        return Promise.resolve(true);
    }
};