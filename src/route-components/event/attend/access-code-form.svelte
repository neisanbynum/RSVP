<script lang="ts">
	import { goto } from '$app/navigation';
	import { FormInput, useForm } from '$lib/components/custom/form';
	import { Button } from '$lib/components/ui/button';
	import { getEvent } from '$lib/remote/event.remote';
	import { EventAccessFormSchema, EventJSONSchema } from '$lib/schemas/events';
    import { getAppContext } from "$routes/layout-context.svelte";
	import z from 'zod/v4';

    type AccessCodeFormProperties = {
        event?: z.core.output<EventJSONSchema>
    }

    let app = getAppContext();

    let { event = $bindable() }: AccessCodeFormProperties = $props()

	let eventData = $state<z.core.output<EventJSONSchema>>();

	const form = useForm({
		schema: EventAccessFormSchema,
		initial: {
			code: ''
		},
		remotefunction: getEvent,
		onsuccess: async (data) => {
			console.log(data);
			event = data;
		}
	});
</script>

<form onsubmit={form.onsubmit} class="flex flex-col gap-4">
    <FormInput name="code" label="Access Code" required class="w-full" />
    <div class="grid h-fit w-full grid-cols-5 grid-rows-1 gap-4">
        <Button
            label="Go Back"
            class="col-span-2 flex w-full"
            variant="outline"
            onclick={() => goto(app.previousPage ?? '/')}
        />
        <Button label="Find Event" class="col-span-3 flex w-full" />
    </div>
</form>
