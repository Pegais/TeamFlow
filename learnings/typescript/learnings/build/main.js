"use strict";
/**
 * Learning TypeScript Terminologies :
 * TypeScript is a strongly type language
 * A superSet of Javascript
 * A strongly typed language can either be statically or dynamically typed.
 * NOTE : TYPESCRIPT IS A STATICALLY TYPES LANGUAGE.
 * WHY : BECAUSE TYPES ARE CHECKED AT COMPILE TIME.
 * JAVASCRIPT IS A DYNAMICALLY TYPED LANGUAGE AND IT MEANS THAT THE TYPES
 * ARE CHECKED AT RUN TIME.
 *
 *
 * Benefits of Typescript:
 *  Self -documenting, catching errors, and great for teams
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Typscript has implicit and explicit type decalaration.
 */
//Examples :
let myName = "snehal";
let meaningOfLife = 11;
// meaningOfLife="sample" //gives error on compiler,
let album; // can be used for any datatype assignment.
let myAlbum; //this is union type declaration of variable.
//creating function
const sum = (a, b) => {
    return a + b;
};
let isActive; //union type can have many datatype option.
let re = /\w+/g; //regExp ,regular expression
// intelli Sense of IDE very useful for typescipt.
/**
 *
 * Lesson -3
 * Arrays in TypeScript
 */
let stringArr = ['adesh', 'snehal']; //implicitly it is string [];
let kitchenItem = ['gas', 'stove', 123]; //implicitly it is union 
let mixdeData = ['sample', 123, true]; // implicitly it is union;
// stringArr[0]=12 throws error as we try to enter number in string arr.
// stringArr.push(12)error again.
//but in union we can enter any datatype mentioned in Union .
//as ktichenItem is union of String | number;
//so we insert boolean it thows error.
// kitchenItem.push(true)
// error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
let test = []; //it is any type assigned implicitly.
let bands = [];
bands.push("sample"); //it works.
// to be more specific with array, we can create tuples in Typescript;
//Tuple;
let myTuple = ["dave", 42, true];
// myTuple=mixdeData //gives error ,as the length of tuple is decided.
// myTuple[4]=1//gives error, to position undefined.
//Objects
let myObj;
myObj = [];
console.log(typeof myObj); //we get object, as array in js is type object.
let mykitchen = {
    name: "stove",
    inKitchen: true,
    item: ["gas", 40]
};
//Rememeber: We there is variable defined, with optional , it can have
// undefined value, so be carful performing operations on those field.
//Preferred way may be using ? and the operation.
//passing the object to functions
const greetKitchen = (kitchen) => {
    console.log(`this kitchen is ${kitchen.name}`);
};
greetKitchen(mykitchen);
//SO when do we se type and interface.
// we can use interface when dealing with class(just a usecase)
//ENUMS
//"unlike mose typescript features, Enums are not a type -level addtion 
// to Javascript but something added to the language and runtime."
var Grade;
(function (Grade) {
    Grade[Grade["U"] = 1] = "U";
    Grade[Grade["D"] = 2] = "D";
    Grade[Grade["C"] = 3] = "C";
    Grade[Grade["B"] = 4] = "B";
    Grade[Grade["A"] = 5] = "A";
})(Grade || (Grade = {}));
console.log(Grade.U);
//# sourceMappingURL=main.js.map