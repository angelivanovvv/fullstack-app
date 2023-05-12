// proccess.browser - depricated. Use window.
export const isSSR = () => typeof process.browser === "undefined";
