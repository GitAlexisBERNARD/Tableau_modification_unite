
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Suspense } from 'vue'
import HeaderPage from '@/components/HeaderPage.vue'
</script>

<template>
    <main>
        <Suspense>
            <RouterView />
        </Suspense>
    </main>
</template>