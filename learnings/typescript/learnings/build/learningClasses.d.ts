interface valoGamePlay {
    typeofMap: 'ascent' | 'lotus' | 'icebox';
    totalplayerTeam: number;
    totalplayerOppositeTeam: number;
    gameMode: 'competitive' | 'unrated' | 'deathmatch' | 'swiftplay';
    teamChat: any[];
    allChat: any[];
    getinfo(): string;
}
declare class compiPlay implements valoGamePlay {
    typeofMap: 'ascent' | 'lotus' | 'icebox';
    totalplayerTeam: number;
    totalplayerOppositeTeam: number;
    gameMode: 'competitive' | 'unrated' | 'deathmatch' | 'swiftplay';
    teamChat: any[];
    allChat: any[];
    constructor(typeofMap: "ascent" | "lotus" | "icebox", totalplayerTeam: number, totalplayerOppositeTeam: number, gameMode: "competitive" | "unrated" | "deathmatch" | "swiftplay", teamChat?: any[], allChat?: any[]);
    getinfo(): string;
}
declare let snehalTeam: compiPlay;
//# sourceMappingURL=learningClasses.d.ts.map