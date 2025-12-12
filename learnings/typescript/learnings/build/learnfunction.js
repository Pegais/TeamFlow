"use strict";
// type Guitarist={
//     name:string,
//     active:boolean,
//     albums:(string |number)[]
// }
Object.defineProperty(exports, "__esModule", { value: true });
//Literal types;
let usertype;
//Functions
const add = (a, b) => {
    return a + b;
}; //basically explicitly deciding types of functions return and parameter.
//void type :any function dealing with sideeffects, which does not 
// necessarily return anything can have VOID type.
//example :
const logMsg = (msg) => {
    console.log(msg);
}; //its void type.
//now using this for any function type which deals with number operations.
let subFunc = function (a, b) {
    return a - b;
};
//Optional  parameter
const addtion = (a, b, c) => {
    //now c is optional so its type will be union number|undefined;
    //to work around we need type gurad.
    if (typeof c !== "undefined") {
        return a + b + c;
    }
    return a + b;
};
//always remember our optional parameter can only come last in the list,
// our required parameter should come first.
//default parameters;
const sumation = (a, b, c = 3) => {
    //if no c value is provided it takes the default value
    return a + b + c;
};
//REMEMBER :DEFULT PARAMETER WILL NOT WORK WHILE DEFINING TYPE ALIASES
// (like our customMathFunc )OR INTERFACE
//rest paramteres;
// it should be also used for however rest of the parameter are
// all the required parameter should come first.
// other can come in rest parameters
const total = (...nums) => {
    return nums.reduce((prev, current) => prev + current);
};
//never type
//never types needs to throw error
//remember typscript looks for type guards, checks for return statements
//it never allows undefined return, it should be catched as an error.
const creatError = (errMsg) => {
    throw new Error(errMsg);
};
//MAKING OF CUSTOM TYPE GUARD
//useful : as we will be using a lot for type checking and undefined guard.
const isNumber = (value) => {
    return typeof value === 'number' ? true : false;
};
//now we can use isNumber(value) to check any number of given type and handle
// logical statements.
//# sourceMappingURL=learnfunction.js.map