<script lang="ts">
	import { goto } from '$app/navigation';
	import { FormInput, useForm } from '$lib/components/custom/form';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { getEvent } from '$lib/remote/event.remote';
	import { EventAccessFormSchema, EventJSONSchema } from '$lib/schemas/events';
	import AccessCodeForm from "$route-components/event/attend/access-code-form.svelte";
	import EventDetails from "$route-components/event/attend/event-details.svelte";
	import AttendanceConfirmationForm from "$route-components/event/attend/attendance-confirmation-form.svelte";
	import z from 'zod/v4';
	import { getAppContext } from '../../layout-context.svelte';
	import { Text } from '$lib/components/custom';

	let app = getAppContext();
	let event = $state<z.core.output<EventJSONSchema>>();
	let attending = $state<boolean>(false);

	$inspect(event)
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<Card.Root class="flex w-sm sm:w-md">
		<Card.Header>
			<Card.Title>Attend Event</Card.Title>
			<Card.Description>Use the access code to join the event!</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if !event}
				<AccessCodeForm bind:event />
			{:else}
				<div class="flex flex-col gap-4">
					<EventDetails bind:event />
					<AttendanceConfirmationForm bind:event />
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
