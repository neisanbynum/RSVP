<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { FormInput, useForm } from '$lib/components/custom/form';
	import { Button } from '$lib/components/ui/button';
	import { attendEvent } from '$remote/event.remote';
	import { AttendEventFormSchema, EventJSONSchema } from '$lib/schemas/events';
	import { getAppContext } from '$routes/layout-context.svelte';
	import z from 'zod/v4';

	type AccessCodeFormProperties = {
		event?: z.core.output<EventJSONSchema>;
	};

	let app = getAppContext();

	let { event = $bindable() }: AccessCodeFormProperties = $props();

	let attending = $state<boolean>(false);

	let form = useForm({
		schema: AttendEventFormSchema,
		initial: {
			eventID: event!.id,
			attendees: 1
		},
		remotefunction: attendEvent,
		onsuccess: ({ message }) => {
			toast.success(message);
			goto(app.previousPage ?? '/');
		}
	});
</script>

<form onsubmit={form.onsubmit} class="items-start gap-4">
	{#if attending}
		<FormInput name="attendees" label="Group Total" class="w-36" type="number" />
	{/if}
	<div class="grid h-fit w-full grid-cols-5 grid-rows-1 gap-4">
		<Button
			label="Go Back"
			class="col-span-2 flex w-full"
			variant="outline"
			onclick={() => goto(app.previousPage ?? '/')}
		/>
		{#if !attending}
			<Button
				label="Attend Event"
				class="col-span-3 flex w-full"
				onclick={() => (attending = true)}
			/>
		{:else}
			<Button label="Confirm Attendance" class="col-span-3 flex w-full" />
		{/if}
	</div>
</form>
