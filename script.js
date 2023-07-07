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

function handleFile() {
  var fileInput = document.getElementById("zipFileInput");
  var file = fileInput.files[0];

  var reader = new FileReader();
  reader.onload = function (event) {
    var arrayBuffer = event.target.result;
    var jszip = new JSZip();

    jszip
      .loadAsync(arrayBuffer)
      .then(function (zip) {
        var filePromises = [];

        Object.keys(zip.files).forEach(function (filename) {
          var file = zip.files[filename];

          filePromises.push(
            file.async("uint8array").then(function (data) {
              var decoder = new TextDecoder("utf-8");
              var content = decoder.decode(data);

              return {
                filename: filename,
                content: content,
              };
            })
          );
        });

        Promise.all(filePromises).then(function (fileObjects) {
          console.log(fileObjects);
        });
      })
      .catch(function (error) {
        console.error("解凍エラー:", error);
      });
  };

  reader.readAsArrayBuffer(file);
}

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
