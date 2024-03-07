<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gray-100 py-4">
      <nav class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Hi I'm Alexis Bernard</h1>
          <p class="text-lg">Future full-stack developer</p>
        </div>
        <button class="bg-blue-500 text-white py-2 px-4 rounded">
          View my work
        </button>
      </nav>
    </header>

    <main class="flex-grow container mx-auto py-8">
      <!-- Design Projects -->
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">Designs Projects</h2>
        <p>All of my project Designs Projects</p>
        <a href="#" class="text-blue-500">Go to details ></a>
      </section>

      <!-- Video Project -->
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">Video Project</h2>
        <p>All of my project in Video</p>
        <a href="#" class="text-blue-500">Go to details ></a>
        <img
          src="../assets/video-project.jpg"
          alt="Video Project"
          class="mt-4"
        />
      </section>

      <!-- Development Projects -->
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">Development projects</h2>
        <p>Get to my Development projects</p>
        <a href="#" class="text-blue-500">Go to details ></a>
        <img
          src="../assets/dev-project.jpg"
          alt="Development Project"
          class="mt-4"
        />
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 py-4">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <p>alexis.bernard@gmail.com</p>
        </div>
        <div class="flex">
          <a href="#" class="mx-2">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="#" class="mx-2">
            <i class="fab fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
