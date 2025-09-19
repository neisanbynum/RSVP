<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
</script>

<Card.Root class="h-fit w-sm sm:w-md">
	<Card.Header>
		<Card.Title>Welcome</Card.Title>
		<Card.Description>NeisanWorks Event Coordinator</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col items-center justify-center gap-4">
		<Button
			label="Attend Event"
			variant="outline"
			class="w-4/5"
			onclick={() => goto("/event/attend")}
		/>
		<Button label="Sign In" class="w-4/5" onclick={() => goto("/auth")} />
	</Card.Content>
</Card.Root>
