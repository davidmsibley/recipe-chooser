<template>
    <div>
        <component :is="currentView" keep-alive></component>
    </div>
</template>

<script>
import ChooseIngredients from './ChooseIngredients.vue'
import ViewRecipe from './ViewRecipe.vue'

export default {
    data () {
        return {
            currentView: 'ChooseIngredients'
        }
    },
    components : {
        ChooseIngredients,
        ViewRecipe
    }
}
</script>

<style>
</style>
