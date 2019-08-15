const replaceAll = function(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
};

const getFileContentString = (content, targetString, replaceText) => {
  if (!content) {
    return '';
  }
  if (Array.isArray(content)) {
    return replaceAll(content.join('\n'), targetString, replaceText);
  }
  return replaceAll(content, targetString, replaceText);
};

module.exports = {
  getFileContentString,
};
