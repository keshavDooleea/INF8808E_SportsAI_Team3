// retrieve DOM HTML elements
const mainContainer = document.querySelector('main')
const dotsContainer = document.querySelector('.dots-container')
const chartNb = document.querySelector('#chart-nb')
const sections = Array.from(document.querySelectorAll('main > section'))

// variables
const dotActiveClass = 'active'
const scrollOffset = 1

main()

function main() {
  createDots()
  const dots = document.querySelectorAll('.dots-container .dot')

  activateDot(0)

  // get the rectangle attributes (x, y, width, height, top, bottom) of each sections
  const sectionsBoundingBoxes = sections.map((section, index) => {
    return {
      section,
      dot: dots[index],
      boundingBox: section.getBoundingClientRect()
    }
  })

  // add listener to main container to update window's hash and sidebar dots
  mainContainer.addEventListener('scroll', () => {
    sectionsBoundingBoxes.forEach((box, index) => {
      if (!box.dot) return

      const rect = box.boundingBox
      const offsetTop = mainContainer.scrollTop

      if (
        offsetTop > rect.top - scrollOffset &&
        offsetTop < rect.bottom - scrollOffset
      ) {
        box.dot.classList.add(dotActiveClass)
        setChartNb(index + 1)
      } else {
        box.dot.classList.remove(dotActiveClass)
      }
    })
  })

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activateDot(index)
    })
  })

  function createDots() {
    sections.forEach(() => {
      const dot = document.createElement('div')
      dot.className = 'dot'
      dotsContainer.appendChild(dot)
    })
  }

  function activateDot(index) {
    dots.forEach((dot, dotIndex) => {
      if (index === dotIndex) {
        dots[index].classList.add(dotActiveClass)
        setChartNb(index + 1)
        sections[index].scrollIntoView()
      } else {
        dot.classList.remove(dotActiveClass)
      }
    })
  }

  function setChartNb(number) {
    chartNb.textContent = number
  }
}
