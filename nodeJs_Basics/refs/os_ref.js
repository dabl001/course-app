const os = require('os')

//platform
console.log(os.platform())

//architecture
console.log(os.arch())

// information
// console.log(os.cpus())

// free space in storage
console.log(os.freemem())

// total storage
console.log(os.totalmem())

// main directory
console.log(os.homedir())

// how much time this system(this mac) is working from last shut down/restart
console.log(os.uptime())