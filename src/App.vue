<template>
    <div id="app">
        <template v-for="ingredient in ingredients">
            <ingredient :ingredient="ingredient"></ingredient>
        </template>
    </div>
</template>

<script>
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
body {
    font-family: Helvetica, sans-serif;
}
</style>
