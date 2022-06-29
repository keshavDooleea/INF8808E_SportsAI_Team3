import { Subject } from 'rxjs'
// import { scrollSubject } from './scripts/utils/scroll-subject'
/**
 * @file This file handles the logic when scrolling to handle the dots and page number on the right sidebar
 * @author Team 3
 * @version v1.0.0
 */

// retrieve DOM HTML elements
const mainContainer = document.querySelector('main')
const dotsContainer = document.querySelector('.dots-container')
const chartNb = document.querySelector('#chart-nb')
const sections = Array.from(document.querySelectorAll('main > section'))

// variables
const dotActiveClass = 'active'
const scrollOffset = 1

let scrollSubject = new Subject()

main()

function main() {
  // create the dots based on the number of sections
  // createDots()
  const dots = document.querySelectorAll('.dots-container .dot')

  // set first page as default
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

      // add active css class to the dot that matches the current page position
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

  // handle click event when clicking on a dot to navigate to a specific sectiono
  dots.forEach(
    (dot, index) => {
      dot.addEventListener('click', () => {
        activateDot(index)
      })
    },
    { once: true }
  )

  // dynamically create small dots based on the number/length of sections
  function createDots() {
    sections.forEach(() => {
      const dot = document.createElement('div')
      dot.className = 'dot'
      dotsContainer.appendChild(dot)
    })
  }

  // add active css class to current dot and navigate to current/specific section based on section index
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

  // update page number on the bottom of right sidebar
  function setChartNb(number) {
    scrollSubject.next(number)
    chartNb.textContent = number
  }
}

module.exports = {
  scrollSubject
}
