
//I play valorant
//let desgin map condition with classes.

//first map needs : typeofMap, totalPlayer,gameMode,teamChat,allChat

//for this lets design an interface which all classes related to map and 
// its subclasses should follow.


interface valoGamePlay {
    typeofMap: 'ascent' | 'lotus' | 'icebox'
    totalplayerTeam: number
    totalplayerOppositeTeam: number
    gameMode: 'competitive' | 'unrated' | 'deathmatch' | 'swiftplay'
    teamChat: any[]
    allChat: any[]
    getinfo(): string

}

class compiPlay implements valoGamePlay {
    typeofMap: 'ascent' | 'lotus' | 'icebox'
    totalplayerTeam: number
    totalplayerOppositeTeam: number
    gameMode: 'competitive' | 'unrated' | 'deathmatch' | 'swiftplay'
    teamChat: any[]
    allChat: any[]
   
    constructor(
        typeofMap: "ascent" | "lotus" | "icebox",
        totalplayerTeam: number,
        totalplayerOppositeTeam: number,
        gameMode: "competitive" | "unrated" | "deathmatch" | "swiftplay",
        teamChat: any[] = [{}],
        allChat: any[] = [{}]
    ) { 
        this.typeofMap=typeofMap
        this.totalplayerTeam=totalplayerTeam
        this.totalplayerOppositeTeam=totalplayerOppositeTeam
        this.gameMode=gameMode
        this.teamChat=teamChat
        this.allChat=allChat
    }
    getinfo() {
        return `${this.typeofMap} with player ${this.totalplayerTeam}`
    }
}

let snehalTeam = new compiPlay("lotus", 5, 5,"competitive", [{ "msg": "some message" }])
console.log(snehalTeam.getinfo());


//looking at this CODE BASE is such a pain in ass.Lots of redundancy.
//so if use interface : it is always public snippet for every class made on this.
//to make private and public variables or function must be inside the class.

//          Do I need behavior (methods)?
//                      /             \
//                     yes             no
//                    /                 \
//            Use class               Use interface/type
//            | (store data in this.data)
//            |
//   Do I need multiple implementations?
//         /             \
//       yes             no
//      /                 \
// class implements I   class alone

// Do I need shared default methods?
//         |
//  abstract class

// Do I want simple helper object creation?
//         |
//  Factory function