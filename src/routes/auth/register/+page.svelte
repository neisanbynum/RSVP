<script lang="ts">
	import { goto } from '$app/navigation';
	import { FormInput, FormSwitch, useForm } from '$lib/components/custom/form';
	import { Button } from '$lib/components/ui/button';
	import { register } from '$lib/remote/auth.remote';
	import { RegisterSchema } from '$lib/remote/auth.utils';
	import { toast } from 'svelte-sonner';

	const form = useForm({
		schema: RegisterSchema,
		initial: {
			last: '',
			first: '',
			middle: '',
			prefermiddle: false,
			email: '',
			phone: '',
			password: '',
			confirmpassword: ''
		},
		remotefunction: register,
		onsuccess: ({ message }) => {
			toast.success(message);
			goto('/auth');
		},
		debug: true
	});
</script>

<form onsubmit={form.onsubmit} class="gap-6">
	<div class="flex h-fit w-full flex-col gap-4">
		<div class="flex h-fit w-full flex-col gap-1">
			<div class="grid w-full grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1">
				<FormInput
					name="last"
					label="Last Name"
					autocomplete="family-name"
					required
					class="w-full"
				/>
				<FormInput
					name="first"
					label="First Name"
					autocomplete="given-name"
					required
					class="w-full"
				/>
			</div>
			<div
				class="grid w-full grid-cols-1 grid-rows-[fit-content_fit-content] gap-1 sm:flex sm:gap-1"
			>
				<FormInput
					name="middle"
					label="Middle Name"
					autocomplete="additional-name"
					required
					class="w-full"
				/>
				<FormSwitch
					name="prefermiddle"
					label="Preferred Name?"
					desc="Do you prefer to go by your middle name?"
					labelsize="xs"
					containerclass="relative sm:top-2 left-1"
					tooltipclass="relative sm:top-6 left-1"
				/>
			</div>
		</div>
		<div class="grid grid-cols-1 grid-rows-2 sm:grid-cols-[4fr_2fr] sm:grid-rows-1">
			<FormInput name="email" label="Email Address" required class="w-full" type="email" />
			<FormInput name="phone" label="Phone Number" required class="w-full" type="number" />
		</div>
		<div class="grid w-full grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1">
			<FormInput
				name="password"
				label="Password"
				type="password"
				autocomplete="new-password"
				required
				class="w-full"
			/>
			<FormInput
				name="confirmpassword"
				label="Confirm Password"
				type="password"
				autocomplete="new-password"
				required
				class="w-full"
			/>
		</div>
	</div>
	<Button label="Register" class="w-3/5" />
</form>
