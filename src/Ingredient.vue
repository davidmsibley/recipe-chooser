<template>
    <div class="ingredient col s6 m4 l3">
        <template v-if="ingredient.img">
            <div class="card cyan lighten-2 hoverable">
                <div class="ingredient-thumb card-image"><img :src="ingredient.img"></div>
                <div class="ingredient-name white-text">{{ ingredient.name }}</div>
            </div>
        </template>
        <template v-else>
            <div class="card-panel cyan lighten-2 hoverable">
                <div class="ingredient-name white-text">{{ ingredient.name }}</div>
            </div>
        </template>
    </div>
</template>

<script>
//TODO pull the card styling up!
export default {
    props: ['ingredient']
}
</script>

<style scoped>

</style>
