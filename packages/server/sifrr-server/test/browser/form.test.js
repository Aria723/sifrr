const fs = require('fs');
const path = require('path');

describe('form test', function() {
  before(async () => {
    await page.goto(`${PATH}/multipart.html`);
  });

  it('handles input form data', async () => {
    const resp = await page.evaluate(async path => {
      return await submitForm2(`${path}/stream`);
    }, PATH);

    expect(resp).to.deep.equal({
      firstname: 'Aaditya',
      lastname: 'Taparia',
      address: ['address1', 'address2', 'address3'],
      some: ['some1', 'some2', 'some3'],
      name: ['Aaditya']
    });
  });

  it('gives uploaded files as stream', async () => {
    const fileInput = await page.$('#onefile');
    fileInput.uploadFile(path.join(__dirname, '../public/nocl.json'));

    const filesInput = await page.$('#mulfile');
    filesInput.uploadFile(
      path.join(__dirname, '../public/static.html'),
      path.join(__dirname, '../public/all.js')
    );

    const resp = await page.evaluate(async path => {
      return await submitForm(`${path}/stream`);
    }, PATH);

    // Response doesn't have filePath
    expect(resp).to.deep.equal({
      name: 'Aaditya',
      file: {
        filename: 'nocl.json',
        encoding: '7bit',
        mimetype: 'application/json'
      },
      file2: [
        {
          filename: 'static.html',
          encoding: '7bit',
          mimetype: 'text/html'
        },
        {
          filename: 'all.js',
          encoding: '7bit',
          mimetype: 'text/javascript'
        }
      ]
    });
  });

  it('gives uploaded file and saves in tmpDir', async () => {
    const { resp2, time } = await page.evaluate(async path => {
      const start = performance.now();
      let resp;
      for (let i = 0; i < 100; i++) {
        resp = await submitForm(`${path}/tmpdir`);
      }
      return { resp2: resp, time: performance.now() - start };
    }, PATH);

    global.console.log(`100 file uploads took: ${time}ms`);

    // Response has filePath
    expect(resp2).to.deep.equal({
      name: 'Aaditya',
      file: {
        filename: 'nocl.json',
        encoding: '7bit',
        mimetype: 'application/json',
        filePath: path.join(__dirname, '../public/benchmarks/public/tmp/nocl.json')
      },
      file2: [
        {
          filename: 'static.html',
          encoding: '7bit',
          mimetype: 'text/html',
          filePath: path.join(__dirname, '../public/benchmarks/public/tmp/static.html')
        },
        {
          filename: 'all.js',
          encoding: '7bit',
          mimetype: 'text/javascript',
          filePath: path.join(__dirname, '../public/benchmarks/public/tmp/some.js')
        }
      ]
    });

    // Same file content
    expect(fs.readFileSync(resp2.file.filePath)).to.deep.equal(
      fs.readFileSync(path.join(__dirname, '../public/nocl.json'))
    );

    // delete files
    fs.unlinkSync(resp2.file2[0].filePath);
    fs.unlinkSync(resp2.file2[1].filePath);
  });
});
