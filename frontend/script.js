let sign_in = document.querySelector('.form__submit-button')

sign_in.addEventListener("click", (e) => {
    e.preventDefault()
    console.log("Clicked sign in")
    console.log(window.location.href)
    window.location.href = "http://127.0.0.1:5500/product-listing-page.html"
})