<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
</script>

<Card.Root class="h-fit w-sm sm:w-md">
	<Card.Header>
		<Card.Title>Event Coordinator</Card.Title>
		<Card.Description>Welcome to blah blah blah</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col items-center justify-center gap-4">
		<Button
			label="Event Management"
			variant="outline"
			class="w-4/5"
			onclick={() => console.log('Event Management')}
		/>
		<Button label="Sign In" class="w-4/5" onclick={() => goto("/auth")} />
	</Card.Content>
</Card.Root>
