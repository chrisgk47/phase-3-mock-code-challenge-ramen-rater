// write your code here
const ramenMenu = document.querySelector("#ramen-menu")
const ramenCard = document.querySelector("#ramen-detail")

const detImg = document.querySelector("#ramen-detail > img")
const detName = document.querySelector("#ramen-detail > h2")
const detRest = document.querySelector("#ramen-detail > h3")

const rateForm = document.querySelector("#ramen-rating")
const submitBttn = document.querySelector("#ramen-rating > input[type=submit]:nth-child(5)")

const newMenuForm = document.querySelector("#new-ramen")

const deleteBttn = document.querySelector("#ramen-rating > button")


fetch('http://localhost:3000/ramens')
.then(res => res.json())
.then(ramenArr => {
    firstImgDet(ramenArr)
    ramenArr.forEach(ramenObj => {
        menuListImg(ramenObj)
    })
})

function firstImgDet(ramenArr){
    detImg.src = ramenArr[0].image
    detName.textContent = ramenArr[0].name
    detRest.textContent = ramenArr[0].restaurant
    rateForm.rating.value = ramenArr[0].rating
    rateForm.comment.value = ramenArr[0].comment
    rateForm.dataset.id = ramenArr[0].id
}

function menuListImg(ramenObj){
    let img = document.createElement('img')
    img.classList.add('menu-img')
    img.dataset.id = ramenObj.id
    img.src = ramenObj.image
    
    ramenMenu.append(img)
}

ramenMenu.addEventListener('click', evt => {

    fetch(`http://localhost:3000/ramens/${evt.target.dataset.id}`)
        .then(res => res.json())
        .then(menuObj => {detailCard(menuObj)})
})

function detailCard(menuObj){
    detImg.src = menuObj.image
    detName.textContent = menuObj.name
    detRest.textContent = menuObj.restaurant
    rateForm.rating.value = menuObj.rating
    rateForm.comment.value = menuObj.comment
    rateForm.dataset.id = menuObj.id
    deleteBttn.dataset.id = menuObj.id
}

rateForm.addEventListener('submit', ev => {
    ev.preventDefault()
    
    const rating = ev.target.rating.value
    const comment = ev.target.comment.value
   
    fetch(`http://localhost:3000/ramens/${ev.target.dataset.id}`, {
        
        method: 'PATCH',
        headers:
        {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({rating, comment})
    })
    .then(res => res.json())
    .then(rateObj => {
        // let upObj = document.querySelector(`img.menu-img[data-id="${ev.target.dataset.id}"]`)
        detailCard(rateObj)
    })
})

newMenuForm.addEventListener('submit', event => {
    event.preventDefault()

    let newMenuObj = {
        name: event.target.name.value,
        restaurant: event.target.restaurant.value,
        image: event.target.image.value,
        rating: event.target.rating.value,
        comment: event.target['new-comment'].value
    }
    
    fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers:
        {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newMenuObj)
    })
    .then(res => res.json())
    .then(newObj => {
        detailCard(newObj)
        menuListImg(newObj)
    })
})

deleteBttn.addEventListener('click', e => {
    let deleteImg = document.querySelector(`img.menu-img[data-id="${e.target.dataset.id}"]`)
    detImg.textContent = ''
    detImg.src = ''
    detName.textContent = ''
    detRest.textContent = ''
    deleteImg.remove()

    fetch(`http://localhost:3000/ramens/${e.target.dataset.id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(console.log)
    
    location.reload()
})



