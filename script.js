// let group = {
//   groupName: "グループ1",
//   members: [
//     { name: "サメハック", age: 30, id: 0 },
//     { name: "ねこハック", age: 31, id: 1 },
//     { name: "いぬハック", age: 40, id: 2 },
//     { name: "ぶたハック", age: 23, id: 3 },
//   ],
// };

// JSZipライブラリを読み込む
var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js";
document.head.appendChild(script);

// function handleFile() {
//   var fileInput = document.getElementById("zipFileInput");
//   var file = fileInput.files[0];

//   var reader = new FileReader();
//   reader.onload = function (event) {
//     var arrayBuffer = event.target.result;

//     // zipファイルを解凍するためのライブラリを使用する
//     JSZip.loadAsync(arrayBuffer)
//       .then(function (zip) {
//         // zipファイル内のファイルを表示する
//         var files = Object.keys(zip.files);
//         var output = document.getElementById("output");
//         output.innerHTML = "";

//         for (var i = 0; i < files.length; i++) {
//           var file = files[i];
//           var fileInfo = document.createElement("p");
//           fileInfo.innerHTML = file;
//           output.appendChild(fileInfo);
//         }
//       })
//       .catch(function (error) {
//         console.error("解凍エラー:", error);
//       });
//   };

//   reader.readAsArrayBuffer(file);
// }

// function handleFile() {
//   var fileInput = document.getElementById("zipFileInput");
//   var file = fileInput.files[0];

//   var reader = new FileReader();
//   reader.onload = function (event) {
//     var arrayBuffer = event.target.result;
//     var jszip = new JSZip();

//     jszip
//       .loadAsync(arrayBuffer)
//       .then(function (zip) {
//         var filePromises = [];

//         Object.keys(zip.files).forEach(function (filename) {
//           var file = zip.files[filename];

//           filePromises.push(
//             file.async("uint8array").then(function (data) {
//               var decoder = new TextDecoder("utf-8");
//               var content = decoder.decode(data);

//               return {
//                 filename: filename,
//                 content: content,
//               };
//             })
//           );
//         });

//         Promise.all(filePromises).then(function (fileObjects) {
//           console.log(fileObjects);
//         });
//       })
//       .catch(function (error) {
//         console.error("解凍エラー:", error);
//       });
//   };

//   reader.readAsArrayBuffer(file);
// }

// function handleFile() {
//   var fileInput = document.getElementById("zipFileInput");
//   var file = fileInput.files[0];

//   var reader = new FileReader();
//   reader.onload = function (event) {
//     var arrayBuffer = event.target.result;
//     var jszip = new JSZip();

//     jszip
//       .loadAsync(arrayBuffer)
//       .then(function (zip) {
//         var filePromises = [];

//         Object.keys(zip.files).forEach(function (filename) {
//           var file = zip.files[filename];

//           filePromises.push(
//             file.async("uint8array").then(function (data) {
//               var decoder = new TextDecoder("utf-8");
//               return decoder.decode(data);
//             })
//           );
//         });

//         Promise.all(filePromises).then(function (contents) {
//           var output = document.getElementById("output");
//           output.innerHTML = "";

//           contents.forEach(function (content) {
//             var fileInfo = document.createElement("p");
//             fileInfo.innerHTML = content;
//             output.appendChild(fileInfo);
//           });
//         });
//       })
//       .catch(function (error) {
//         console.error("解凍エラー:", error);
//       });
//   };

//   reader.readAsArrayBuffer(file);
// }

filesByDirectory: {
  path: string;
}
[] = [];

function handleFileInput(event) {
  const file = event.target.files[0];

  if (file) {
    this.unzipFile(file);
  }
}

function unzipFile(file) {
  const zip = new JSZip();

  // ファイルを読み込む
  zip.loadAsync(file).then((zipContent) => {
    // 解凍されたファイルを処理する
    zipContent.forEach((relativePath, file) => {
      if (!file.dir) {
        const fileEntry = { path: relativePath };

        // ディレクトリごとにファイルを追加する
        this.filesByDirectory.push(fileEntry);
      }
    });

    // ディレクトリごとにまとめられたファイルの集計結果を表示する
    console.log(this.groupFilesByDirectory());
  });
}

function groupFilesByDirectory() {
  const groupedFiles: { [directory]: [] } = {};

  // ファイルをディレクトリごとにグループ化する
  for (const fileEntry of this.filesByDirectory) {
    const pathSegments = fileEntry.path.split("/");
    const directory = pathSegments[0];
    const filename = pathSegments[1];

    if (!groupedFiles[directory]) {
      groupedFiles[directory] = [];
    }
    groupedFiles[directory].push(filename);
  }

  // ディレクトリごとの配列を生成する
  const result: { path: string }[] = [];
  for (const directory of Object.keys(groupedFiles)) {
    const directoryFiles = groupedFiles[directory];

    for (const filename of directoryFiles) {
      const fileEntry = { path: `${directory}/${filename}` };
      result.push(fileEntry);
    }
  }

  return result;
}
