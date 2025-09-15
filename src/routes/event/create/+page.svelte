<script lang="ts">
	import { goto } from '$app/navigation';
	import { FormInput, useForm } from '$lib/components/custom/form';
	import { createdEvents, createEvent } from '$lib/remote/event.remote';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { CreateEventSchema } from '$lib/remote/event.utils';

	const form = useForm({
		schema: CreateEventSchema,
		initial: {
			title: '',
			date: new Date(),
			time: '',
			address: {
				addressline1: '',
				addressline2: '',
				city: '',
				state: '',
				zip: ''
			},
			private: false
		},
		remotefunction: createEvent,
		onsuccess: async ({ message }) => {
			toast.success(message);
            await createdEvents().refresh();
			goto('/event/upcoming');
		},
        debug: true
	});
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<Card.Root class="w-sm sm:w-md md:w-lg">
		<Card.Header>
			<Card.Title>Create Event</Card.Title>
			<Card.Description>Create an event to share with others!</Card.Description>
		</Card.Header>
        <Card.Content>
            <form onsubmit={form.onsubmit} class="gap-6">
                <FormInput name="title" label="Title" required class="w-full" />
            </form>
        </Card.Content>
	</Card.Root>
</div>
