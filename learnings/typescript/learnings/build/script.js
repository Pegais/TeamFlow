"use strict";
//writing sample DOM using typescript
const headerElement = document.querySelector('.header');
const stringInsert = (msg) => {
    headerElement.innerText = msg;
};
console.log(headerElement);
headerElement.addEventListener('click', () => {
    let msg = "Modyfying DOM using typescript";
    stringInsert(msg);
});
//# sourceMappingURL=script.js.map