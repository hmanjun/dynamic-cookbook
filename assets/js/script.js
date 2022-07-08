var pantryModal = $('#pantryModal')
var ingredientList = []
var ingredientCounts = {}
if(localStorage.getItem("pantryIngredients")){ //Check if there is any stored history to grab
    ingredientList = JSON.parse(localStorage.getItem("pantryIngredients"))
}
if(localStorage.getItem("pantryIngredientsCount")){ //Check if there is any stored history to grab
    ingredientCounts = JSON.parse(localStorage.getItem("pantryIngredientsCounts"))
}

console.log(queryStringifyIngredients())

/* Open and close pantry modal*/
$(document).on("click", "#pantry", function (event) {
    pantryModal.css("display", "block")
    displayPantryIngredietns()
});

$(document).on("click", ".close", function () {
    pantryModal.css("display", "none")
});

/*Get List of ingredients*/

$(document).on("click", "#addItemBtn", function(event){ //Add ingredient listener
    var itemVal = $(this).siblings("input").val()
    if(itemVal != ""){ //Simple validation for if any input at all
        var itemCheckUrl = "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=" + itemVal
        $.ajax({ //Fetch validation. Call api to see if an ingredient exsists with the name of the input
            url: itemCheckUrl,
            method: "GET"
        })
            .then(function(response){
                if(response.length > 0){ //Real items will return an array with at least 1 element
                    //console.log("real ingredient")
                    addPantryIngredient(response[0].name.charAt(0).toUpperCase() + response[0].name.slice(1))
                } else { //Fake items will return an empty array
                    fakeItemAlert() //Notify user that it is a fake ingredient
                }
            })
    }
})

function addPantryIngredient(item){ //Add input into pantry list
    if(ingredientList.includes(item)){
        return
    } else {
        ingredientList.push(item)
        ingredientCounts[item] = 1
        localStorage.setItem("pantryIngredientsCount", JSON.stringify(ingredientCounts))
        localStorage.setItem("pantryIngredients", JSON.stringify(ingredientList))
        displayPantryIngredietns()
        console.log(item)
    }
}

function displayPantryIngredietns(){
    var ingCont = $(".ingredients-container")
    ingCont.empty()
    for(var i = 0; i < ingredientList.length; i++){
        var ing = $("<li>").text(ingredientList[i])
        ingCont.prepend(ing)
    }
}

function fakeItemAlert(){ //Notify user that input is not a real ingredient
    /*Add alert elements to modal*/
    var alertCont = $("<div>").addClass("callout small alert")
    var alrMsg = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alrMsg)
    pantryModal.append(alertCont)

    var secondsLeft = 5 //Run the alert for 5 seconds
    var timerInterval = setInterval(function() { 
        secondsLeft--
        console.log(secondsLeft)
        if(secondsLeft === 0){ //Auto close the alert after time runs out
            clearInterval(timerInterval)
            alertCont.remove()
        }
    }, 1000)
}

function queryStringifyIngredients(){
    var rtn = ""
    for(var i = 0; i < ingredientList.length; i++){
        if(i==0){
            rtn+= ingredientList[i]
        } else {
            rtn += ",+" + ingredientList[i]
        }
    }
    return rtn
}




/* API ingredient check

https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=god&number=5

*/



//shopping modal 
var shoppingModal = $('#cartModal')

/* Open and close pantry modal*/
$(document).on("click", "#cart", function (event) {
    shoppingModal.css("display", "block")
});

$(document).on("click", ".close", function () {
    shoppingModal.css("display", "none")
});

$(document).on("click", "#addCartBtn", function (event) {
    var cartVal = $(this).siblings("input").val()
    if(cartVal != ""){
        var cartCheckUrl = "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=c8ae3021308e4c6fa278becfa56df80b&query=" + cartVal
        $.ajax({
           url: cartCheckUrl,
           method: "GET" 
        })
            .then(function(response) {
                if(response.length > 0){
                  addShoopingList(cartVal)  
                } else {
                    itemNotAValidInput()
                }
    })

    }
})

function addShoopingList(item){
    var listCont = $(".shopping-container")
    var list = $("<li>").text(item)
    listCont.prepend(list)
}

function itemNotAValidInput(){
    var alertCont = $("<div>").addClass("callout small alert")
    var alertMessage = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alertMessage)
    shoppingModal.append(alertCont)

    var secondsLeftCart = 5 
    var timerInterval = setInterval(function() { 
        secondsLeftCart--
        console.log(secondsLeftCart)
        if(secondsLeftCart === 0){ 
            clearInterval(timerInterval)
            alertCont.remove()
        }
    }, 1000)
}

