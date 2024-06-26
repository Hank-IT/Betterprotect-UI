<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Update user role
        </template>

        <template #default>
            <form @submit.prevent="submit" id="update-user-role-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <div>
                            <label for="role" class="block text-sm font-medium leading-6 text-gray-900">Role</label>
                            <select ref="roleRef" v-model="form.role" id="role" name="role" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option value="">Please select</option>
                                <option value="readonly">Readonly</option>
                                <option value="authorizer">Authorizer</option>
                                <option value="editor">Editor</option>
                                <option value="administrator">Administrator</option>
                            </select>

                            <p class="mt-2 text-sm text-red-600" id="client_type-error">
                                <template v-for="error in formErrors.role">
                                    {{ error }}
                                </template>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Cancel</button>
                <button form="update-user-role-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Save</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper, useOnOpen} from '@hank-it/ui/vue'
import { ref} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import { UserRoleUpdatePayload, UserRoleUpdateRequest } from '@/api/requests/user/UserRoleUpdateRequest'

const props = defineProps({
    modelValue: Boolean,
    id: Number,
})

const form = ref({
    role: '',
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const formErrors = ref({})
const roleRef = ref(null)

const {onOpen} = useOnOpen(props)

onOpen(() => {
    roleRef.value.focus()
})

const request = new UserRoleUpdateRequest

function submit() {
    request.setId(props.id)
        .setBody(new UserRoleUpdatePayload(form.value))
        .send()
        .then(response => {
            emits('success')

            isOpen.value = false
        })
        .catch(exception => {
            const error = exception.getError()

            if (error.statusCode === 422) {
                error.getBodyPromise().then(bodyContent => {
                    formErrors.value = bodyContent.errors
                })

                return
            }

            genericError.value = true
        })
}
</script>