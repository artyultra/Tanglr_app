const setColorMode = (isDarkMode: boolean | undefined, root: HTMLElement) => {
  if (typeof document === "undefined") {
    console.log("No document");
    return;
  }
  root.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  console.log("Set color mode");
  return;
};

export default setColorMode;
