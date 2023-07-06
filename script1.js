function handleFile() {
  // JSZipを使ってファイルを解凍する例
  var zip = new JSZip();

  zip.loadAsync(zipFileData).then(function (zip) {
    zip.forEach(function (relativePath, zipEntry) {
      if (!zipEntry.dir) {
        // ファイル名の文字エンコーディングを指定して解凍する
        var decodedFileName = zipEntry.name; // デフォルトのUTF-8エンコーディング

        if (isJapaneseEncoding(zipEntry.name)) {
          // 日本語のエンコーディングがShift_JISの場合
          decodedFileName = sjisToUTF8(zipEntry.name);
        }

        // 解凍されたファイル名を使用してファイルを保存する
        // ここではファイル名を出力していますが、ファイルの保存先や方法は環境によって異なります
        console.log(decodedFileName);
      }
    });
  });

  // Shift_JISエンコーディングをUTF-8に変換する関数の例
  function sjisToUTF8(str) {
    var iconv = require("iconv-lite");
    var buffer = iconv.decode(Buffer.from(str, "binary"), "Shift_JIS");
    return iconv.encode(buffer.toString("utf-8"), "utf-8").toString();
  }

  // 文字列がShift_JISエンコーディングであるかどうかを判定する関数の例
  function isJapaneseEncoding(str) {
    // 実装によって判定方法は異なるため、必要に応じて変更してください
    return /[一-龠々〆ヵヶ亜-熙]+/.test(str);
  }
}
