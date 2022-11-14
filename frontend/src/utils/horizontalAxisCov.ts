export const numberToString=(num:number):string=>{
    num=num-1;
    const division=Math.floor(num/26);
    const remainder=Math.floor(num%26);

    const currSting=String.fromCharCode(remainder+97).toLocaleUpperCase();
    return division>0?numberToString(division)+currSting:currSting;
}