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
        var fileObjects = [];

        if (typeof zip.files !== "object" || zip.files === null) {
          throw new Error("解凍エラー: zipファイルにエントリが存在しません");
        }

        processEntries(zip, "", fileObjects).then(function () {
          console.log(fileObjects);

          // 結果を格納するオブジェクト
          const result = {};

          // 配列を順番に処理
          for (const obj of fileObjects) {
            // ファイルパスをディレクトリとファイル名に分割
            const [dir, file] = obj.path.split("/");

            // ディレクトリがまだ結果に含まれていない場合、空の配列を作成して初期化
            if (!result[dir]) {
              result[dir] = [];
            }

            // ファイル名をディレクトリの配列に追加
            result[dir].push(file);
          }

          // 変換された配列を格納するための変数
          const transformedArray = [];

          // 結果オブジェクトを走査
          for (const [dir, files] of Object.entries(result)) {
            // ディレクトリごとにオブジェクトを作成し、ファイル名とファイル数を追加
            const dirObject = {
              [dir]: {
                files,
                count: files.length,
              },
            };

            // 変換された配列にオブジェクトを追加
            transformedArray.push(dirObject);
          }

          console.log(transformedArray);
        });
      })
      .catch(function (error) {
        console.error("解凍エラー:", error);
      });
  };

  reader.readAsArrayBuffer(file);
}

function processEntries(zip, folderPath, fileObjects) {
  var entries = Object.keys(zip.files);

  if (!entries.length) {
    return Promise.resolve(); // エントリが存在しない場合は解決済みのPromiseを返す
  }

  var promises = entries.map(function (entry) {
    var zipEntry = zip.files[entry];

    if (zipEntry.dir) {
      // ディレクトリの場合
      var newFolderPath = folderPath + zipEntry.name + "/";
      fileObjects.push({
        type: "directory",
        path: newFolderPath,
      });

      return processEntries(zipEntry, newFolderPath, fileObjects);
    } else {
      // ファイルの場合
      return zipEntry.async("uint8array").then(function (data) {
        var decoder = new TextDecoder("utf-8");
        var content = decoder.decode(data);

        var filePath = folderPath + zipEntry.name;
        fileObjects.push({
          type: "file",
          path: filePath,
          content: content,
        });
      });
    }
  });

  return Promise.all(promises);
}

const array = [
  { path: "dir1/1.png" },
  { path: "dir1/2.png" },
  { path: "dir1/3.png" },
  { path: "dir1/4.png" },
  { path: "dir1/5.png" },
  { path: "dir2/1.png" },
  { path: "dir2/2.png" },
  { path: "dir2/3.png" },
  { path: "dir1/4.png" },
  { path: "dir2/5.png" },
];
