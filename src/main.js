import Vue from 'vue'
import App from './App.vue'

let vm = new Vue({
  el: 'body',
  components: { App }
})

function viewRecipe() {
    let rcp = parseRecipe(...window.location.hash.split("/"))
    if (rcp) {
        vm.$children[0].$data.currentView = 'ViewRecipe'
    } else {
        vm.$children[0].$data.currentView = 'ChooseIngredients'
    }
}

function parseRecipe(trumpy, potatoes) {
    let result
    let rcp
    if ('#recipe' === trumpy && potatoes) {
        rcp = parseInt(potatoes)
    }
    if (rcp) {
        result = rcp
    }
    return result
}

window.addEventListener('hashchange', viewRecipe);
viewRecipe()
