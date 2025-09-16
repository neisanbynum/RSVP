<script lang="ts">
	import { goto } from '$app/navigation';
	import Text from '$lib/components/custom/typography/text.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { createdEvents } from '$lib/remote/event.remote';
</script>

<div class="flex h-fit w-full flex-col items-start justify-center gap-4">
	<div class="relative flex h-9 w-full items-end justify-center">
		<Button
			label="Create Event"
			class="absolute left-0 w-fit"
			onclick={() => goto('/event/create')}
		/>
		<Text text="Created Events" class="text-lg font-semibold" />
	</div>
	<Card.Root class="flex h-fit w-full gap-0 p-0">
		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="border-r-1">Date</Table.Head>
						<Table.Head class="border-x-1">Time</Table.Head>
						<Table.Head class="border-r-0 sm:border-x-1">Event</Table.Head>
						<Table.Head class="hidden border-x-1 lg:table-cell">Location</Table.Head>
						<Table.Head class="hidden border-l-1 sm:table-cell">Attendees</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<svelte:boundary>
						{@const events = await createdEvents()}
						{#if events && events.length > 0}
							{#each events as event}
								<Table.Row class="border-y-1 first:border-t-0 last:border-b-0">
									<Table.Cell class="min-w-fit border-r-1">{event.date}</Table.Cell>
									<Table.Cell class="min-w-fit border-x-1">{event.time}</Table.Cell>
									<Table.Cell class="w-2/3 min-w-fit border-r-0 sm:border-x-1">
										{event.title}
									</Table.Cell>
									<Table.Cell class="hidden w-1/3 min-w-fit border-x-1 lg:table-cell">
										{event.addressString}
									</Table.Cell>
									<Table.Cell class="hidden min-w-fit border-l-1 sm:table-cell">
										{event.attendees.reduce((total, attendee) => total + attendee.total, 0)}
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={6} class="text-center">No Created Events</Table.Cell>
							</Table.Row>
						{/if}

						{#snippet pending()}
							<Table.Row>
								<Table.Cell colspan={6} class="text-center">No Created Events</Table.Cell>
							</Table.Row>
						{/snippet}
					</svelte:boundary>
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
