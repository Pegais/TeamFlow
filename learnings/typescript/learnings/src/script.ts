//writing sample DOM using typescript

const headerElement =document.querySelector('.header') as HTMLElement

const stringInsert=(msg:string)=>{
    headerElement.innerText=msg;
}
console.log(headerElement);




headerElement.addEventListener('click',()=>{
    let msg ="Modyfying DOM using typescript";
    stringInsert(msg);
})