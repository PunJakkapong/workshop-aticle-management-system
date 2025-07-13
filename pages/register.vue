<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <UCard class="w-full max-w-md p-8 shadow-xl">
      <template #header>
        <h1 class="text-2xl font-bold text-center mb-2">Register</h1>
      </template>
      <UForm
        :state="{ username: '', email: '', password: '' }"
        class="flex flex-col space-y-4"
        @submit.prevent="register"
      >
        <UFormGroup label="Username" name="username" class="w-full">
          <UInput
            v-model="username"
            placeholder="Enter your username"
            required
            size="lg"
            class="w-full"
          />
        </UFormGroup>
        <UFormGroup label="Email" name="email" class="w-full">
          <UInput
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            size="lg"
            class="w-full"
          />
        </UFormGroup>
        <UFormGroup label="Password" name="password" class="w-full">
          <UInput
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            size="lg"
            class="w-full"
          />
        </UFormGroup>
        <UButton type="submit" size="lg" block color="primary" class="w-full"
          >Register</UButton
        >
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          class="w-full"
        >
          {{ error }}
        </UAlert>
      </UForm>
      <div class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="text-primary font-medium hover:underline"
          >Login</NuxtLink
        >
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const register = async () => {
  error.value = "";
  try {
    const res = await axios.post("/api/v1/users/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    if (res.data.success) {
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      error.value = "Registration failed";
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      error.value = e.message || "Registration failed";
    } else {
      error.value = "Registration failed";
    }
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 40px auto;
}
.error {
  color: red;
}
</style> 