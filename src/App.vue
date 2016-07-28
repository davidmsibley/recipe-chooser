<template>
    <div id="app" class="container center-align flow-text">
        <div class="row">
            <div class="view-title col s12">
                <h3>Find Recipe</h3>
            </div>
            <div class="col s2">
                <div class="card-panel red lighten-2">Protein</div>
            </div>
            <div class="col s2">
                <div class="card-panel amber lighten-2">Grains</div>
            </div>
            <div class="col s4">
                <div class="card-panel green lighten-2">Fruits &amp; Vegetables</div>
            </div>
            <div class="col s2">
                <div class="card-panel purple lighten-2">Sauces</div>
            </div>
            <div class="col s2">
                <div class="card-panel brown lighten-2">Spices</div>
            </div>
        </div>
        <div class="row divider"></div>
        <div class="row">
            <template v-for="ingredient in filteredIngredients">
                <ingredient :ingredient="ingredient"></ingredient>
            </template>
        </div>
    </div>
</template>

<script>
import ml from 'materialize-loader'
import Ingredient from './Ingredient.vue'
import Ingredients from './../generatedData/ingredientOrder.json'

export default {
    data () {
        return {
            ingredients: Ingredients
        }
    },
    computed : {
        filteredIngredients : function () {
            return Ingredients.filter(function(el) {return el.img});
        }
    },
    components: {
        Ingredient
    }
}
</script>

<style>
    #app {

    }
</style>
