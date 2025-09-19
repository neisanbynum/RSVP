<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		FormDatePicker,
		FormInput,
		FormSwitch,
		FormTimePicker,
		useForm
	} from '$lib/components/custom/form';
	import { createdEvents, createEvent } from '$lib/remote/event.remote';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { CreateEventSchema } from '$lib/remote/event.utils';
	import { Button } from '$lib/components/ui/button';
	import { isHttpError } from '@sveltejs/kit';
	import { Status } from '$lib/utils/endpoint/status';
	import { logout } from '$lib/remote/auth.remote';

	const form = useForm({
		schema: CreateEventSchema,
		initial: {
			title: '',
			date: new Date(),
			time: '',
			addressline1: '',
			addressline2: '',
			city: '',
			state: '',
			zip: '',
			private: false
		},
		remotefunction: createEvent,
		onsuccess: async ({ message }) => {
			toast.success(message);
			createdEvents().refresh();
			goto('/secured/event/upcoming');
		},
		onerror: async (error) => {
			if (isHttpError(error) && error.status === Status.UNAUTHORIZED) {
				toast.error('User Not Authenticated');
				logout();
				goto('/auth');
			}
		}
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center p-4">
	<Card.Root class="w-sm sm:w-md md:w-lg">
		<Card.Header>
			<Card.Title>Create Event</Card.Title>
			<Card.Description>Soon, you'll have an event to share with others!</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={form.onsubmit} class="gap-6">
				<div class="flex h-fit w-full flex-col items-start gap-4">
					<FormInput name="title" label="Title" required class="w-full" />
					<div class="grid w-full grid-cols-12 grid-rows-1 justify-start gap-2">
						<FormDatePicker name="date" label="Date" class="col-span-7 w-full" />
						<FormTimePicker name="time" label="Time" class="col-span-5 w-full" />
					</div>
					<div class="flex h-fit w-full flex-col gap-1">
						<FormInput name="addressline1" label="Address Line 1" required class="w-full" />
						<FormInput name="addressline2" label="Address Line 2" class="w-full" />
						<div
							class="grid h-fit w-full grid-cols-12 grid-rows-1 items-start justify-center gap-1"
						>
							<FormInput name="city" label="City" required class="col-span-7 w-full" />
							<FormInput name="state" label="State" required class="col-span-2 w-full" />
							<FormInput name="zip" label="Zip" required class="col-span-3 w-full" />
						</div>
					</div>
					<FormSwitch name="private" label="Private" />
				</div>
				<div class="flex h-fit w-full items-center justify-center gap-4">
					<Button
						label="Go Back"
						variant="secondary"
						class="w-2/6"
						onclick={() => goto('/secured/event/upcoming')}
					/>
					<Button label="Create" class="w-3/6" />
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
