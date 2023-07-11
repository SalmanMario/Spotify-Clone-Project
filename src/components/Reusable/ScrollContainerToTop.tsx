export function ScrollContainerToTop(containerId: string) {
  const element = document.getElementById(containerId);
  if (element) {
    element.scrollTop = 0;
  }
}
