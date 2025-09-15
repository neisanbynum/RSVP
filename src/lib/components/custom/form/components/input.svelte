<script module lang="ts">
	import type { InputProps, InputType } from '$lib/components/ui/input';
	import type { Prettier } from '$lib/utils/$type';

	export type FormInputProperties = Prettier<
		Omit<InputProps, 'children' | 'value' | 'files' | 'type'> & {
			type?: InputType;
			label?: string;
			desc?: string;
			name: string;
			clearable?: boolean;
		}
	>;
</script>

<script lang="ts">
	import { useFormContext } from '../utils/useForm.svelte';
	import { cn } from '$lib/utils/shadcn';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeClosedIcon from '@lucide/svelte/icons/eye-closed';
	import XIcon from '@lucide/svelte/icons/x';
	import Description from './description.svelte';
	import Error from './error.svelte';

	let {
		name,
		label,
		desc,
		type = 'text',
		clearable = false,
		class: classname,
		...rest
	}: FormInputProperties = $props();
	let id = $props.id();

	const buttonclass = 'pointer-events-auto cursor-pointer size-4 absolute';
	let renderedType = $state<InputType>(type);
	const togglePassword = () => {
		if (type !== 'password') return;
		renderedType = renderedType === 'password' ? 'text' : 'password';
	};

	const form = useFormContext();
</script>

<div class={cn('relative flex w-48 flex-col items-start justify-center gap-1', classname)}>
	<Label class="pl-1" for={id}>{label}</Label>
	<div class=" relative flex h-fit w-full justify-center items-center p-1">
		<Input
			{...rest}
			{id}
			{name}
			{@attach form.manageinput(name)}
			type={renderedType}
			aria-errormessage="{name}-form-error"
			aria-describedby="{name}-form-description"
			aria-invalid={form.errors.has(name)}
			value={form.values.get(name)}
			class="w-full"
		/>
		<EyeIcon
			class={cn(
				type !== 'password' || renderedType === 'password' ? 'scale-0' : 'scale-100',
				clearable && form.values.get(name) ? 'right-9' : 'right-4',
				buttonclass
			)}
			onclick={togglePassword}
		/>
		<EyeClosedIcon
			class={cn(
				type !== 'password' || renderedType !== 'password' ? 'scale-0' : 'scale-100',
				clearable && form.values.get(name) ? 'right-9' : 'right-4',
				buttonclass
			)}
			onclick={togglePassword}
		/>
		<XIcon
			class={cn(
				!clearable || !form.values.get(name) ? 'scale-0' : 'scale-100',
				'right-4',
				buttonclass
			)}
			onclick={() => form.values.delete(name)}
		/>
	</div>
	<Description {name} text={desc} />
	<Error {name} />
</div>
