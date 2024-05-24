let form_list = document.querySelector('.store')
let form = document.querySelectorAll('.store__form')

let add_button = document.querySelector('#add')
let remove_button = document.querySelectorAll('#remove')

let save = document.querySelectorAll('#save')
let save_to = document.querySelector('.order__summary-list')

let file = document.querySelectorAll('.image-file')
// save.forEach((button, index) => {
//     button.addEventListener('click', (event) => {
//         let form = event.target.parentNode;
//         console.log(form)
//         let data = new FormData(form)
//         console.log("Form entry", data.keys())
//     })
// })

add_button.addEventListener('click', () => {
    console.log('Clicked')
    const clone_form = form[0].cloneNode(true)
    form_list.appendChild(clone_form)
    remove_button = document.querySelectorAll('#remove');
    updateDomForm()
    remove_button.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            console.log('remove')
            // event.preventDefault()
            //  event.stopImmediatePropagation()
            event.stopPropagation()
            let parent_element = event.target.parentNode;
            console.log(parent_element)
            parent_element.remove()
        })
    })
})

remove_button.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        console.log('remove')
        // event.preventDefault()
        //  event.stopImmediatePropagation()
        event.stopPropagation()
        let parent_element = event.target.parentNode;
        console.log(parent_element)
        parent_element.remove()
    })
})

function updateDomForm() {
    form = document.querySelectorAll('.store__form');
     file = document.querySelectorAll('.image-file')

    form.forEach((form, index) => {
        form.addEventListener('submit', (event) => {
            console.log('Submit')
            event.preventDefault()
            event.target.removeEventListener
            console.log("This is the index", index)
            console.log(file)
            const files = file[index].files[0]
            let image = document.createElement('img')
            const reader = new FileReader()
            reader.onload = () => {
                image.src = reader.result;
            }
            reader.readAsDataURL(files)
            let data = new FormData(event.target)
            save_to.appendChild(addListElement(data.get('type'), image))
            console.log("file", files)
            console.log(event.target)
            console.log(data.get('use'))
            console.log("Form entry", data.keys())
        })
    })
}

form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        console.log('Submit')
        event.preventDefault()
        event.target.removeEventListener
        console.log("This is the index", index)
        const files = file[index].files[0]
        let image = document.createElement('img')
        const reader = new FileReader()
        reader.onload = () => {
            image.src = reader.result;
        }
        reader.readAsDataURL(files)
        let data = new FormData(event.target)
        save_to.appendChild(addListElement(data.get('type'), image))
        console.log("file", files)
        console.log(event.target)
        console.log(data.get('use'))
        console.log("Form entry", data.keys())
    })
})

function addListElement(content, image) {
    let li = document.createElement('li');
    li.classList.add('order__summary-list-item');
    let par = document.createElement('p')
    par.textContent = content;
    li.appendChild(image)
    li.appendChild(par)
    return li
}