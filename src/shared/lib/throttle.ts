export const throttle = (func: Function, delay: number) => {
    let lastCall = 0;
    
    return (...args: any[]) => {
        const now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}