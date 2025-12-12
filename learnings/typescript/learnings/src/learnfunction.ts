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


/**
 * Typescript Type Casting or Type Assertions.
 * Kind of telling the compiler that in some cases , I may know more about
 * the type of data being recieved or manipulated, so compiler needs to 
 * listen to you regarding that type , that is what here assertions mean.
 */

type One =string
type Two =string | number
type Three ='hello' 

//now converting to more or less specific type using as keyword

let a :One='hello';
let b=a as Two //less specific as Two can either be string or number
let c =a as Three // more specifc as a value is 'hello' which is of type three

//Practical viewPOint of assertions

const addOrConcat =(a:number,b:number,c:'add'|'concat'):string|number=>{
    if(c==='add'){
        return a+b;
    }
    return ''+a+b;
}

// now type asserstions come in handy;
// let myValue:string =addOrConcat(2,2,'concat')
//in this snipped typescript will throw error saying type 'string|number' not
// assignable to type string .
//WHY : here addorConcat function may return either string or number
// whereas myvalue : need string,

// we know that return will be string type ,now 
// we will assert typescript saying we need return as string to fix issue.

let myValue:string =addOrConcat(2,2,'concat') as string


//forced casting or double casting or two assertions
//unknown type 

(10 as unknown) as string // we are asserting 2 time , first changing 10 to 
//unkown type and than as string.


//Practical cases with assertions.DOM
//DOM 

const img =document.querySelector('img') as HTMLImageElement//typescript will try to infer what it maybe ;

img.src // error detected according to typecript; it may be true in case of DOM manipulation
//now to tackle this we have to tell typescript, that we know this element exists as we have created the webpage.


// we can use ! (it is not null assertions)