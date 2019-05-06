<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Sifrr Server Benchmark</h1>
    <script src="/sifrr.fetch.min.js" charset="utf-8"></script>
    <script type="text/javascript">
      function testFetch(url, requests, options = { cache: 'no-store' }) {
        let k = 0, size = 0;
        return new Promise(res => {
          let startTime = performance.now(), firstResponse;
          for (let j = 0; j < requests; j++) {
            Sifrr.Fetch.file(url, options).then(async (response) => {
              if (options.text) response = await response.text();
              if (k === 0) firstResponse = performance.now() - startTime;
              size += lengthInUtf8Bytes(response);
              k++;
              if (k >= requests) res({ time: performance.now() - startTime, size, total: k, rps: k * 1000 / (performance.now() - startTime), firstResponse });
            });
          }
        });
      }

      function lengthInUtf8Bytes(json) {
        const str = JSON.stringify(json);
        let m = encodeURIComponent(str).match(/%[89ABab]/g);
        return str.length + (m ? m.length : 0);
      }
    </script>
  </body>
</html>