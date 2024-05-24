let pop = document.querySelector('.pop-up')
let popbtn = document.querySelector('.pop-up button')
popbtn.addEventListener('click', (event) => {
    event.target.parentNode.remove()
})

setInterval(() => {
    pop.remove()
}, 3000)