<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CreatePostModal from './components/CreatePostModal.vue';
import ToastContainer from './components/ToastContainer.vue';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

const isCreateModalOpen = ref(false);

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div class="app-layout">
    <!-- Navbar -->
    <Navbar @open-create-modal="openCreateModal" />

    <!-- Router View for Pages (HomeView & PostDetailView) -->
    <div class="main-content">
      <router-view @open-create-modal="openCreateModal" />
    </div>

    <!-- Footer -->
    <Footer />

    <!-- Create Post Modal Dialog -->
    <CreatePostModal
      :is-open="isCreateModalOpen"
      @close="closeCreateModal"
    />

    <!-- Global Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<style scoped>
.app-layout {
  min-block-size: 100dvh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
