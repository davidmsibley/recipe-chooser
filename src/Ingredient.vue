<template>
    <div class="ingredient">
        <span class="ingredient-name">{{ ingredient.name }}</span>
    </div>
</template>

<script>
export default {
    props: ['ingredient']
}
</script>

<style scoped>
body {
    font-family: Helvetica, sans-serif;
}
</style>
