// function consoleToJSON(){
//     const console = []

//     for(i=2; i<process.argv.length; i++){
//         console[i] = process.argv[i]
//     }
//     return console
// }
// console.log(process.argv.length)
// let cons = consoleToJSON()
// console.log(cons)
//
function consoleToJSON(){
    const c = {}

    for(i=2; i<process.argv.length; i++){
        const arg = process.argv[i].split('=')
        c[arg[0]] = arg[1] 
    }
    return c
}
console.log(process.argv)
let cons = consoleToJSON()
console.log(cons)
