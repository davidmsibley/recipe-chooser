<template>
    <div class="ingredient col s6 m4 l3">
        <div class="card-panel cyan lighten-2 hoverable">
            <div class="ingredient-thumb"></div>
            <div class="ingredient-name white-text">{{ ingredient.name }}</div>
            <div class="ingredient-detail"></div>
        </div>
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
