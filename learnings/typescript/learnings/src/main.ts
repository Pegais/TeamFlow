
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


/**
 * Typscript has implicit and explicit type decalaration.
 */
//Examples :
let myName:string="snehal"
let meaningOfLife:number=11;
meaningOfLife="sample" //gives error on compiler,

let album :any; // can be used for any datatype assignment.

let myAlbum :string | number //this is union type declaration of variable.
//creating function

const sum=(a:number,b:number)=>{
    return a+b
}

let isActive :number |boolean |string //union type can have many datatype option.


let re:RegExp = /\w+/g //regExp ,regular expression

// intelli Sense of IDE very useful for typescipt.
