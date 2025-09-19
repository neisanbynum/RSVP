<script lang="ts">
	import { Text } from '$lib/components/custom/typography';
	import { EventJSONSchema } from '$lib/schemas/events';
	import z from 'zod/v4';

	type EventDetailsProperties = {
		event?: z.core.output<EventJSONSchema>;
	};

	let { event = $bindable() }: EventDetailsProperties = $props();
</script>

{#if event}
	<div class="flex flex-col gap-1">
		<div class="flex w-full items-center justify-start gap-1">
			<Text text="Event:" class="text-lg font-semibold" />
			<Text text={event.title} class="text-lg" />
		</div>
		<div class="flex w-full items-center justify-start gap-1">
			<Text text="Date/Time:" class="font-semibold" />
			<Text text={`${event.date} ${event.time}`} />
		</div>
	</div>
{/if}
