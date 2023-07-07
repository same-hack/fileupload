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

// 与えられた配列
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

// 結果を格納するためのオブジェクト
const result = array.reduce((acc, obj) => {
  // ファイルパスをディレクトリとファイル名に分割
  const [dir, file] = obj.path.split("/");

  // ディレクトリがまだ結果に含まれていない場合、空の配列を作成
  if (!acc[dir]) {
    acc[dir] = [];
  }

  // ファイル名をディレクトリの配列に追加
  acc[dir].push(file);

  return acc;
}, {});

// 要求された形式のオブジェクト配列を作成
const transformedArray = Object.entries(result).map(([dir, files]) => ({
  [dir]: files,
}));

console.log(transformedArray);
