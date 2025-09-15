<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { createdEvents } from '$lib/remote/event.remote';
</script>

<Card.Root class="flex h-fit w-full gap-0 p-0">
	<Card.Header class="p-4">
		<Button label="Create Event" class="w-fit" onclick={() => goto('/event/create')} />
	</Card.Header>
	<Card.Content class="p-0">
		<Table.Root>
			<Table.Caption>A list of events you have created.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Date</Table.Head>
					<Table.Head>Time</Table.Head>
					<Table.Head>Event</Table.Head>
					<Table.Head>Location</Table.Head>
					<Table.Head class="max-w-fit">Attendees</Table.Head>
					<Table.Head>Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<svelte:boundary>
					{@const events = await createdEvents()}
					{#if events && events.length > 0}
						{#each events as event}
							<Table.Row>
								<Table.Cell>{event.date.toLocaleDateString('en-US')}</Table.Cell>
								<Table.Cell>{event.time}</Table.Cell>
								<Table.Cell>{event.title}</Table.Cell>
								<Table.Cell>
									{`${event.address.addressline1},${event.address.addressline2 ? ` ${event.address.addressline2},` : ''} ${event.address.city}, ${event.address.state} ${event.address.zip}`}
								</Table.Cell>
								<Table.Cell>
									{event.attendees.reduce((total, attendee) => total + attendee.total, 0)}
								</Table.Cell>
							</Table.Row>
						{/each}
					{/if}

					{#snippet pending()}
						<Table.Row>
							<Table.Cell colspan={6}>No Created Events</Table.Cell>
						</Table.Row>
					{/snippet}
				</svelte:boundary>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
