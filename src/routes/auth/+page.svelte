<script lang="ts">
	import { goto } from '$app/navigation';
	import { HREF } from '$lib/components/custom';
	import { FormInput, useForm } from '$lib/components/custom/form';
	import { Button } from '$lib/components/ui/button';
	import { login, userName } from '$lib/remote/auth.remote';
	import { LoginSchema } from '$lib/remote/auth.utils';
	import { toast } from 'svelte-sonner';

	const form = useForm({
		schema: LoginSchema,
		initial: {
			email: '',
			password: ''
		},
		remotefunction: login,
		onsuccess: async ({ message }) => {
			toast.success(message);
			await userName().refresh();
			goto('/event/upcoming');
		},
		debug: true
	});
</script>

<form onsubmit={form.onsubmit} class="gap-6">
	<div class="flex h-fit w-4/5 flex-col gap-1">
		<FormInput
			name="email"
			label="Email Address"
			type="email"
			required
			class="w-full"
			autocomplete="email"
		/>
		<FormInput
			name="password"
			label="Password"
			type="password"
			required
			class="w-full"
			autocomplete="current-password"
		/>
		<HREF label="Forgot Password?" class="pl-1 text-xs" />
	</div>
	<Button label="Sign In" class="w-3/5" />
</form>
