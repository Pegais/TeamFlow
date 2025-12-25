Jest is throwing error with handling uuid() package.
Thus had to mock the uuid package using mock folder and uuid.js file.
module.exports = {
  v4: () => 'test-uuid-' + Math.random().toString(36).substring(2, 11),
};



