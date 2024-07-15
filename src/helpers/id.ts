// calling this function in another module will increment this local counter.
// the counter is therefore shared across all instances and guarantees to give a unique number on every function call
let id = 0;
export const useId = () => id++;
