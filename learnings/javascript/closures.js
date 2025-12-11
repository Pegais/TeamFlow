    const myMainPublicContainer=(
        function(){
            //body of anonymous functions.
            let privateVariable =0;
            function changeValue(value){
                return privateVariable +=value;
            }
            return{
                increment:function(){
                    return changeValue(1);
                },
                decrement:function(){
                    return changeValue(-1);
                },
                value:function(){
                    return privateVariable
                }
            }
        }
    )()

    console.log(myMainPublicContainer);
    console.log(myMainPublicContainer.increment());
    
