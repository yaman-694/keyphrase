function formatTextToList(inputText: string): string[] | string {
  // Split the input text by newline characters
  const lines = inputText.split("\n");

  // Join the key phrases with newline characters
  if (lines.length === 0) {
    return inputText;
  }
  return lines;
}

export default formatTextToList;
