export const countWords = (content: string | null | undefined) => {
    return content ? content.replace(/ +(?= )/g, " ").split(" ").length : 0;
};

export const roundNumber = (number: number, decimalPlaces: number): number => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
};

export const padZeroes = (num: number, size: number): string => {
    let str = num.toString();
    while (str.length < size) str = "0" + str;
    return str;
};
