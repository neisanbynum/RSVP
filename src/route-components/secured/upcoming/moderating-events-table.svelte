<script lang="ts">
	import { Text } from '$lib/components/custom';
	import { Table, useTableData } from '$lib/components/custom/table';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getEventAccessCode, getModeratingEvents } from '$remote/event.remote';
	import { toast } from 'svelte-sonner';

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
</script>

<div class="flex h-2/5 w-full flex-col items-start justify-center gap-4 lg:h-full lg:w-3/5">
	<div class="flex h-9 w-full items-end justify-center">
		<Text text="Moderating Events" class="text-lg font-semibold" />
	</div>
	{#await moderating}
		<Skeleton class="flex h-full w-full" />
	{:then properties}
		<Table {...properties} class="h-full w-full">
			{#snippet action({ data })}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" label="Actions" class="h-8 w-16" />
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56" align="start">
						<DropdownMenu.Group>
							<DropdownMenu.Item
								onclick={async () => {
									const accessCode = await getEventAccessCode(data.id);
									if (!accessCode) return;

									await navigator.clipboard.writeText(accessCode.code);
									toast.success('Copied to clipboard');
								}}
							>
								Copy Access Code
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/snippet}
		</Table>
	{/await}
</div>
