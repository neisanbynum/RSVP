<script lang="ts" module>
	import type { ClassValue } from 'svelte/elements';
	import type { Breakpoint, HTMLProperties } from '$lib/components/$types';
	import type { Prettier } from '$lib/utils/$type';
	import type { RemoteQuery } from '@sveltejs/kit';

	export type ColumnConfiguration<Record extends object> = {
		label: string;
		key: keyof Record;
		class?: ClassValue;
		breakpoint?: Breakpoint;
	};

	export type TableData<Record extends object> = {
		data: Array<Record>;
		columns: Array<ColumnConfiguration<Record>>;
	};

	export type TableProperties<Record extends object> = Prettier<
		HTMLProperties<'table'> &
			TableData<Record> & { trailingRow?: boolean; action?: Snippet<[{ data: Record }]> }
	>;

	export async function useTableData<Record extends object>(
		data: Array<Record> | (() => RemoteQuery<Array<Record>>),
		columns: Array<ColumnConfiguration<Record>>
	): Promise<TableData<Record>> {
		let returned: Array<Record>;
		if (Array.isArray(data)) {
			returned = data;
		} else {
			returned = await data();
		}

		return { data: returned, columns };
	}
</script>

<script lang="ts" generics="Record extends object">
	import { Card } from '$lib/components/ui/card';
	import { cn } from '$lib/utils/shadcn';
	import type { Snippet } from 'svelte';

	let { columns, data, trailingRow = true, action, ...rest }: TableProperties<Record> = $props();
</script>

<Card
	class={cn(
		'flex h-fit w-fit rounded-sm shadow hover:shadow-md dark:bg-neutral-800',
		rest.class,
		'relative overflow-hidden overflow-y-auto p-0'
	)}
>
	<table
		{...rest}
		class={cn(
			'outline-1 outline-neutral-400 dark:outline-neutral-950',
			rest.class,
			'table h-fit max-h-fit min-w-full'
			// !data.length && 'h-10'
		)}
	>
		<thead class="sticky top-0 table-header-group">
			<tr
				class={cn(
					'table-row h-10 max-h-10',
					'outline-1 outline-neutral-400 dark:outline-neutral-950'
				)}
			>
				{#each columns as column}
					<th
						class={cn(
							'table-cell px-2 text-start',
							'bg-neutral-200 dark:bg-neutral-900',
							column.breakpoint && `hidden ${column.breakpoint}:table-cell`
						)}
					>
						<p class="text-sm font-medium">{column.label}</p>
					</th>
				{/each}
				{#if action}
					<th class={cn('table-cell px-2 text-start', 'bg-neutral-200 dark:bg-neutral-900')}>
						<p class="text-sm font-medium">Action</p>
					</th>
				{/if}
			</tr>
		</thead>
		<tbody class="table-row-group">
			{#if data.length === 0}
				<tr class="table-row h-10 max-h-10">
					<td class="table-cell text-center" colspan={columns.length}>
						<p class="text-sm">No data found</p>
					</td>
				</tr>
			{:else}
				{#each data as row}
					<tr
						class={cn(
							'table-row h-10',
							'outline-neutral-400 even:outline-1 dark:outline-neutral-950',
							'hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900'
						)}
					>
						{#each columns as column}
							<td
								class={cn(
									'w-full px-2 text-nowrap',
									column.class,
									'table-cell',
									column.breakpoint && `hidden ${column.breakpoint}:table-cell`
								)}
							>
								<p class="text-sm">{row[column.key]}</p>
							</td>
						{/each}
						{#if action}
							<td class="table-cell w-fit min-w-fit px-2">
								{@render action({ data: row })}
							</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</Card>
