// type Guitarist={
//     name:string,
//     active:boolean,
//     albums:(string |number)[]
// }

//now the above mentioned object type,is done through
//Type Aliases.
//now we can use type aliases in different way, like

type stringOrNumberArray =(string |number)[];

//now we can replacwe the Guitarist albums with this type.

type Guitarist={
    name:string,
    active:boolean,
    albums:stringOrNumberArray
}


//Literal types;
let usertype : 'admin' |'teamMember' |'teamHead'

//Functions

const add =(a:number,b:number):number=>{
    return a+b;
}//basically explicitly deciding types of functions return and parameter.

//void type :any function dealing with sideeffects, which does not 
// necessarily return anything can have VOID type.

//example :
const logMsg=(msg:any)=>{
    console.log(msg);
    
}//its void type.


//lets create function aliases.

type customMathFunc =(a:number,b:number)=>number

//now using this for any function type which deals with number operations.

let subFunc:customMathFunc=function(a,b){
    return a-b;
}

//Optional  parameter
const addtion =(a:number,b:number,c?:number):number=>{
    //now c is optional so its type will be union number|undefined;
    //to work around we need type gurad.
    if(typeof c!=="undefined"){
        return a+b+c;
    }
    return a+b;
}
//always remember our optional parameter can only come last in the list,
// our required parameter should come first.

//default parameters;
const sumation =(a:number,b:number,c:number=3):number=>{
    //if no c value is provided it takes the default value
    return a+b+c;
}


//REMEMBER :DEFULT PARAMETER WILL NOT WORK WHILE DEFINING TYPE ALIASES
// (like our customMathFunc )OR INTERFACE


//rest paramteres;
// it should be also used for however rest of the parameter are
// all the required parameter should come first.
// other can come in rest parameters
const total =(...nums:number[])=>{
    return nums.reduce((prev,current)=>prev+current)
}


//never type
//never types needs to throw error
//remember typscript looks for type guards, checks for return statements
//it never allows undefined return, it should be catched as an error.

const creatError=(errMsg:string)=>{
    throw new Error(errMsg);
}

//MAKING OF CUSTOM TYPE GUARD
//useful : as we will be using a lot for type checking and undefined guard.

const isNumber=(value:any):boolean=>{
    return typeof value === 'number' ? true : false
}

//now we can use isNumber(value) to check any number of given type and handle
// logical statements.