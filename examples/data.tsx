/* @jsx data */

import { data } from "../src";

enum FileType {
    File = "file",
    Directory = "directory",
    SymbolicLink = "symlink"
}

interface Directory {
    type: FileType.Directory;
    name: string;
    children: Array<File | Directory | SymbolicLink>
}
const Directory = (props: Omit<Directory, "type">) => ({ type: FileType.Directory, ...props })

interface File {
    type: FileType.File;
    name: string;
    data: Buffer | string;
}
const File = (props: Omit<File, "type">) => ({ type: FileType.File, ...props })

interface SymbolicLink {
    type: FileType.SymbolicLink;
    name: string;
    target: string;
}
const SymbolicLink = (props: Omit<SymbolicLink, "type">) => ({ type: FileType.SymbolicLink, ...props })

const files = (
    <Directory name="root">
        <Directory name="sub">
            <File name="file1" data="..." />
        </Directory>
        <Directory name="sub2">
            <File name="file2" data="..." />
            <SymbolicLink name="file3" target="../sub/file1" />
        </Directory>
    </Directory>
)

console.log(JSON.stringify(files, undefined, 2))
// Will print:
// 
// {
//   "type": "directory",
//   "name": "root",
//   "children": [
//     {
//       "type": "directory",
//       "name": "sub",
//       "children": [
//         {
//           "type": "file",
//           "name": "file1",
//           "data": "..."
//         }
//       ]
//     },
//     {
//       "type": "directory",
//       "name": "sub2",
//       "children": [
//         {
//           "type": "file",
//           "name": "file2",
//           "data": "..."
//         },
//         {
//           "type": "symlink",
//           "name": "file3",
//           "target": "../sub/file1"
//         }
//       ]
//     }
//   ]
// }
