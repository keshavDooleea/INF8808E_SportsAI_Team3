// retrieve DOM HTML elements
const mainContainer = document.querySelector("#viz-container");
const dots = document.querySelectorAll(".dots-container .dot");
const chartNb = document.querySelector("#chart-nb");

// ids of 4 sections each holding a svg
const sectionIds = ["#radar-chart", "#stacked-chart", "#bar-chart", "#line-chart"];

// variables
const dotActiveClass = "active";
const scrollOffset = 1;

main();

function main() {
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
    sectionsBoundingBoxes.forEach((box, index) => {
      const rect = box.boundingBox;
      const offsetTop = mainContainer.scrollTop;

      if (offsetTop > rect.top - scrollOffset && offsetTop < rect.bottom - scrollOffset) {
        box.dot.classList.add(dotActiveClass);
        setChartNb(index + 2);
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
        setChartNb(index + 1);
        document.querySelector(sectionIds[index]).scrollIntoView();
      } else {
        dot.classList.remove(dotActiveClass);
      }
    });
  }

  function setChartNb(number) {
    chartNb.textContent = number;
  }
}
