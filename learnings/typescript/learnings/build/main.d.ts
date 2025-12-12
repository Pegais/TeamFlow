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
declare let myName: string;
declare let meaningOfLife: number;
declare let album: any;
declare let myAlbum: string | number;
declare const sum: (a: number, b: number) => number;
declare let isActive: number | boolean | string;
declare let re: RegExp;
/**
 *
 * Lesson -3
 * Arrays in TypeScript
 */
declare let stringArr: string[];
declare let kitchenItem: (string | number)[];
declare let mixdeData: (string | number | boolean)[];
declare let test: any[];
declare let bands: string[];
declare let myTuple: [string, number, boolean];
declare let myObj: object;
type kitchedObj = {
    name: string;
    inKitchen?: boolean;
    item: (string | number)[];
};
declare let mykitchen: kitchedObj;
declare const greetKitchen: (kitchen: kitchedObj) => void;
interface sports {
    name: string;
    played: boolean;
    sportMenu: (string | number)[];
}
declare enum Grade {
    U = 1,
    D = 2,
    C = 3,
    B = 4,
    A = 5
}
//# sourceMappingURL=main.d.ts.map