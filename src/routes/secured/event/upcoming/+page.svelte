<script lang="ts">
	import { goto } from '$app/navigation';
	import { Text } from '$lib/components/custom';
	import { Table, useTableData } from '$lib/components/custom/table';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getAttendingEvents, getModeratingEvents } from '$lib/remote/event.remote';
	import { EventJSONSchema } from '$lib/schemas/events';
	import CreatedEventsTable from '$route-components/secured/upcoming/created-events-table.svelte';
	import { toast } from 'svelte-sonner';
	import z from 'zod/v4';

	const moderating = $derived.by(
		async () =>
			await useTableData(
				() => getModeratingEvents(),
				[
					{ key: 'date', label: 'Date', class: 'w-fit' },
					{ key: 'time', label: 'Time', class: 'w-fit' },
					{ key: 'title', label: 'Event', class: 'min-w-fit w-2/3' },
					{ key: 'addressString', label: 'Location', class: 'min-w-fit w-1/3', breakpoint: 'lg' },
					{ key: 'totalAttendees', label: 'Attendees', class: 'w-fit', breakpoint: 'sm' }
				]
			)
	);
	const attending = $derived.by(
		async () =>
			await useTableData(
				() => getAttendingEvents(),
				[
					{ key: 'date', label: 'Date', class: 'w-fit' },
					{ key: 'time', label: 'Time', class: 'w-fit' },
					{ key: 'title', label: 'Event', class: 'min-w-fit w-full' }
				]
			)
	);
</script>

<div class="flex h-full min-h-fit w-full flex-col gap-4 overflow-y-auto p-4">
	<CreatedEventsTable />
	<div class="flex h-full min-h-fit w-full flex-col-reverse gap-4 lg:flex-row">
		<div class="flex h-2/5 w-full flex-col items-start justify-center gap-4 lg:h-full lg:w-3/5">
			<div class="flex h-9 w-full items-end justify-center">
				<Text text="Moderating Events" class="text-lg font-semibold" />
			</div>
			{#await moderating}
				<Skeleton class="flex h-full w-full" />
			{:then data}
				<Table {...data} class="h-full w-full" />
			{/await}
		</div>
		<div class="flex h-3/5 w-full flex-col items-start justify-center gap-4 lg:h-full lg:w-2/5">
			<div class="relative flex h-9 w-full items-end justify-center">
				<Button
					label="Attend Event"
					class="absolute left-0 w-32"
					onclick={() => goto('/event/attend')}
				/>
				<Text text="Attending Events" class="text-lg font-semibold" />
			</div>
			{#await attending}
				<Skeleton class="flex h-full min-h-48 w-full lg:w-2/5" />
			{:then data}
				<Table {...data} class="h-full w-full" />
			{/await}
		</div>
	</div>
</div>
