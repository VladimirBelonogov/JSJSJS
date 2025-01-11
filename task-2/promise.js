function promiseAll(arrayOfAsyncActions) {

    return new Promise((resolve, reject) => {
        
        if (!Array.isArray(arrayOfAsyncActions)) {
            throw new Error("Принимает на вход, только массив")
        } else if (arrayOfAsyncActions.length === 0) {
            return resolve([])
        }

        let results = new Array(arrayOfAsyncActions.length);
        let temp = 0;

        for(let i = 0; i < arrayOfAsyncActions.length; i++) {
            
            Promise.resolve(arrayOfAsyncActions[i]).then((result) => {
                results[i] = result;
                temp++;
                
                if (temp === results.length) {
                    resolve(results)
                }
            }).catch((error) => {
                reject(error)
            })
        }
    })
}

let testCase1 = new Promise((resolve) => setTimeout(() => resolve("1s") || console.log("1s"), 1000));
let testCase2 = new Promise((resolve) => setTimeout(() => resolve("2s") || console.log("2s"), 2000)); 
let testCase3 = new Promise((resolve) => setTimeout(() => resolve("3s") || console.log("3s"), 3000)); 
let testCase4 = new Promise((resolve) => setTimeout(() => resolve("4s") || console.log("4s"), 4000));

let test = [testCase1, testCase2, testCase3, testCase4];

promiseAll(test).then((result) => {
    console.log(result);
    console.log('Получается работает 😋');
});