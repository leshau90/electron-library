  const LI = require("lorem-ipsum").LoremIpsum;

  const loremGenerator = new LI({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });

  module.exports = { loremGenerator}