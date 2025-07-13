<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <UCard class="w-full max-w-md p-8 shadow-xl">
      <template #header>
        <h1 class="text-2xl font-bold text-center mb-2">Login</h1>
      </template>
      <UForm :state="state" class="flex flex-col space-y-4" @submit.prevent="login">
        <UFormGroup label="Username or Email" name="identifier" class="w-full">
          <UInput
            v-model="state.identifier"
            placeholder="Enter your username or email"
            required
            size="lg"
            class="w-full"
          />
        </UFormGroup>
        <UFormGroup label="Password" name="password" class="w-full">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter your password"
            required
            size="lg"
            class="w-full"
          />
        </UFormGroup>
        <UButton type="submit" size="lg" block color="primary" class="w-full"
          >Login</UButton
        >
        <UAlert
          v-if="error"
          color="red"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          class="w-full"
        >
          {{ error }}
        </UAlert>
      </UForm>
      <div class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="text-primary font-medium hover:underline"
          >Register</NuxtLink
        >
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const state = ref({
  identifier: "",
  password: "",
});
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";
  try {
    const identifierValue = state.value.identifier;
    const passwordValue = state.value.password;
    const body = identifierValue.includes("@")
      ? { email: identifierValue, password: passwordValue }
      : { username: identifierValue, password: passwordValue };
    const res = await axios.post("/api/v1/users/login", body);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } else {
      error.value = "Login failed";
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      error.value = e.message || "Login failed";
    } else {
      error.value = "Login failed";
    }
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 40px auto;
}
.error {
  color: red;
}
</style> 