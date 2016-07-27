<template>
    <div id="app" class="container center-align flow-text">
        <div class="row">
            <div class="view-title col s12">
                <h3>Ingredients</h3>
            </div>
            <div class="col s2">
                <div class="card-panel green lighten-2">Vegetables</div>
            </div>
            <div class="col s2">
                <div class="card-panel red lighten-2">Meat</div>
            </div>
            <div class="col s2">
                <div class="card-panel amber lighten-2">Starches</div>
            </div>
            <div class="col s2">
                <div class="card-panel purple lighten-2">Sauces</div>
            </div>
            <div class="col s2">
                <div class="card-panel lime lighten-2">Fruit</div>
            </div>
            <div class="col s2">
                <div class="card-panel brown lighten-2">Spices</div>
            </div>
        </div>
        <div class="row divider"></div>
        <div class="row">
            <template v-for="ingredient in ingredients">
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
    components: {
        Ingredient
    }
}
</script>

<style>
    #app {

    }
</style>
