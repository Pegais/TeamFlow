type stringOrNumberArray = (string | number)[];
type Guitarist = {
    name: string;
    active: boolean;
    albums: stringOrNumberArray;
};
declare let usertype: 'admin' | 'teamMember' | 'teamHead';
declare const add: (a: number, b: number) => number;
declare const logMsg: (msg: any) => void;
type customMathFunc = (a: number, b: number) => number;
declare let subFunc: customMathFunc;
declare const addtion: (a: number, b: number, c?: number) => number;
declare const sumation: (a: number, b: number, c?: number) => number;
declare const total: (...nums: number[]) => number;
declare const creatError: (errMsg: string) => never;
declare const isNumber: (value: any) => boolean;
/**
 * Typescript Type Casting or Type Assertions.
 * Kind of telling the compiler that in some cases , I may know more about
 * the type of data being recieved or manipulated, so compiler needs to
 * listen to you regarding that type , that is what here assertions mean.
 */
type One = string;
type Two = string | number;
type Three = 'hello';
declare let a: One;
declare let b: Two;
declare let c: Three;
declare const addOrConcat: (a: number, b: number, c: "add" | "concat") => string | number;
declare let myValue: string;
declare const img: HTMLImageElement;
//# sourceMappingURL=learnfunction.d.ts.map