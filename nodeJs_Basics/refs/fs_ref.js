const fs = require('fs')
const path = require('path')

// File system
// fs.mkdir(path.join(__dirname, 'notes'), err => {
//     if (err) throw err

//     console.log('folder was created')
// })

// fs.writeFile(
//     path.join(__dirname, 'notes', 'mynotes.txt'),
//     'Hello world',
//     (err) => {
//         if (err) throw err
//         console.log('file was created')

//         fs.appendFile(
//             path.join(__dirname, 'notes', 'mynotes.txt'),
//             ' from append file',
//             (err) => {
//                 if (err) throw err
//                 console.log('file was edited')
//                 fs.readFile(
//                     path.join(__dirname, 'notes', 'mynotes.txt'),
//                     'utf-8',
//                     (err, data) => {
//                         if (err) throw err
//                         console.log(data)
//                     }
//                 )
//             }
//         )
//     }
// )

fs.rename(
    path.join(__dirname, 'notes', 'mynotes.txt'),
    path.join(__dirname, 'notes', 'Notes.txt'),
    err => {
        if (err) throw err

        console.log('file was renamed')
    }
)

