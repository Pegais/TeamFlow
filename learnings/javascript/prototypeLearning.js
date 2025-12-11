/**
 * So in this we are learning javascript's protopype.
 * What happens when we create object using object literal that is {};
 * So when we create object like let obj ={} , so what is happening in background.
 * 
 * 
 * 
 */

let myobj ={};
//now what happens here is that, to create this object , there is need for a constuctor function.
// this constuctor function is what enables us to create this object.
//REMEMBER : Every constuctor functions will have a OBJECT PROTOTYPE and that prototype points to null in the 
// protype chain .
//so what happens in this example.
log=console.log;
log(myobj.constructor,"HERE WE ARE TRYING TO FIND OUT THE CONSTRUCTOR FUNCTION OF THIS object")

//ouput will be [function:Object];
//now lets find out what is the prototype of my constructor function.
let myConstructorFunc=myobj.constructor;
log(myConstructorFunc.prototype,"it will show the prototype")

//so it will show [object:null prototype] i.e {};

// now the create myobj using {} at the start , can access the prototype of its constructor using __proto__ method.
//now lets check myobj object's proto;
log(myobj.__proto__ ,"using proto to link to the constructor's protoype");
//so output will be same like this : [object:null prototype] i.e {};

//Now to verify if created object can use to link to its constructor's prototype using proto, then ;
log(myobj.__proto__===myobj.constructor.prototype)  //should return true;


//creating new constucotr and function

function mahindra(){};
let bolero=new mahindra();

log(bolero.__proto__,"link to prototype of constructor function ")//gives object
log(mahindra.prototype,"gives prototype of this function")//gives object
log(mahindra.prototype.__proto__)//points object :null prototype of js in prototype chain.

//NOTE : Each constructor function will have an object prototype of its own which points--->(as __proto__)-->
// to [object:null prototype ] of javascript object chain --> which in turn points to null;