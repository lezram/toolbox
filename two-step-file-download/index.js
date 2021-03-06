const fetch = require('node-fetch');
const fs = require('fs');

const fileSourcePages = {
  "filename XY": "site url"
};

function getFileDownloadUrl(page) {
  const regex = /(https:\/\/cdn-blabla\.anydomain\.com\/video\/[^\"]+)/g;
  const found = page.match(regex);
  return found[0];
}

async function downloadFile(url, path) {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

async function run() {
  for (const filename in fileSourcePages) {
    const pageUrl = fileSourcePages[filename];
    const response = await fetch(pageUrl);
    const page = await response.text();

    const fileDownloadUrl = getFileDownloadUrl(page);

    console.log(filename, " - ", fileDownloadUrl);
    await downloadFile(fileDownloadUrl, filename + ".mp4");
    console.log(filename + ".mp4 - Downloaded");
  }
}

run().catch((err) => {
  console.log(err);
});