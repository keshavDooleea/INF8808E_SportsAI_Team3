// retrieve DOM HTML elements
const mainContainer = document.querySelector("main");
const dots = document.querySelectorAll(".dots-container .dot");
const dotActiveClass = "active";
const scrollOffset = 1;

// ids of 4 sections each holding a svg
const sectionIds = ["#radar-chart", "#stacked-chart", "#bar-chart", "#line-chart"];

main();

function main() {
  activateDot(0);

  // get the rectangle attributes (x, y, width, height, top, bottom) of each sections
  const sectionsBoundingBoxes = sectionIds.map((sectionId, index) => {
    return {
      sectionId,
      dot: dots[index],
      boundingBox: document.querySelector(sectionId).getBoundingClientRect(),
    };
  });

  // add listener to main container to update window's hash and sidebar dots
  mainContainer.addEventListener("scroll", () => {
    sectionsBoundingBoxes.forEach((box) => {
      const rect = box.boundingBox;
      const offsetTop = mainContainer.scrollTop;

      if (offsetTop > rect.top - scrollOffset && offsetTop < rect.bottom - scrollOffset) {
        box.dot.classList.add(dotActiveClass);
      } else {
        box.dot.classList.remove(dotActiveClass);
      }
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      activateDot(index);
    });
  });

  function activateDot(index) {
    dots.forEach((dot, dotIndex) => {
      if (index === dotIndex) {
        dots[index].classList.add(dotActiveClass);
        document.querySelector(sectionIds[index]).scrollIntoView();
      } else {
        dot.classList.remove(dotActiveClass);
      }
    });
  }
}
