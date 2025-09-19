<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Text } from '$lib/components/custom';
	import { Table, useTableData } from '$lib/components/custom/table';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getAttendingEvents } from '$remote/event.remote';

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

<div class="flex h-3/5 w-full flex-col items-start justify-center gap-4 lg:h-full lg:w-2/5">
	<div class="relative flex h-9 w-full items-end justify-center">
		<Button
			label="Attend Event"
			class="absolute left-0 w-32"
			onclick={() => goto(resolve('/event/attend'))}
		/>
		<Text text="Attending Events" class="text-lg font-semibold" />
	</div>
	{#await attending}
		<Skeleton class="flex h-full min-h-48 w-full lg:w-2/5" />
	{:then data}
		<Table {...data} class="h-full w-full" />
	{/await}
</div>
