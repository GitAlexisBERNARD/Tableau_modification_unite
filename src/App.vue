<script setup lang="ts">
import { Suspense } from 'vue'
import HeaderPage from '@/components/HeaderPage.vue'
import FooterPage from '@/components/FooterPage.vue'
</script>

<template>
    <HeaderPage />
    <main>
        <Suspense>
            <RouterView />
        </Suspense>
    </main>
    <FooterPage />
</template>