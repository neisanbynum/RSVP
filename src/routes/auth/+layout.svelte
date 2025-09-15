<script lang="ts">
	import { page } from '$app/state';
	import { HREF, Text } from '$lib/components/custom';
	import * as Card from '$lib/components/ui/card';

	let { children } = $props();
	let register = $derived<boolean>(page.url.pathname === '/auth/register');
</script>

<Card.Root class="w-sm sm:w-md md:w-lg">
	<Card.Header>
		<Card.Title>
			{register ? 'Registration' : 'Authentication'}
		</Card.Title>
		<Card.Description>
			{register
				? 'Create an account with the RSVP Event Coordinator'
				: "Sign in to access your event's page"}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{@render children?.()}
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full gap-1 pl-1">
			<Text
				text={register ? 'Already have an account?' : 'Need to create an account?'}
				class="text-xs"
			/>
			<HREF
				label={register ? 'Sign In' : 'Register Now'}
				href={register ? '/auth' : '/auth/register'}
				class="text-xs"
			/>
		</div>
	</Card.Footer>
</Card.Root>
