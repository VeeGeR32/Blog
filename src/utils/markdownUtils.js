export const cleanMarkdownTitle = (title) => {
    return title.replace(/[#_*`~>]/g, '').trim();
  };