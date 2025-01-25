const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/blog/:id', (req, res) => {
  const { id } = req.params;
  const content = localStorage.getItem(id); // Simulate fetching from localStorage
  if (!content) {
    return res.status(404).send('Blog not found');
  }

  const title = content.split('\n')[0];
  const description = content.split('\n').slice(1, 3).join(' ');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F1534%2F1534082.png&f=1&nofb=1&ipt=032dc16b3f4e3baddde78e0ab3f6fa3ae0134662de51b3d74a7406a3efb58e71&ipo=images" />
        <meta property="og:url" content="http://localhost:3000/blog/${id}" />
        <meta property="og:type" content="article" />
        <title>${title}</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="/static/js/bundle.js"></script>
      </body>
    </html>
  `;

  res.send(html);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});