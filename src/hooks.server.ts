// import type { HandleValidationError } from '@sveltejs/kit';

import { COOKIE_ENCRYPTION_KEY, SESSION_COOKIE_KEY } from '$env/static/private';
import { SessionCookieSchema, validUserID } from '$lib/remote/$utils';
import { getUserID, getUserName} from '$lib/remote/auth.remote';
import { encrypt } from '$lib/utils/encryption/helpers';
import { Status } from '$lib/utils/endpoint/status';
import { redirect, type Handle } from '@sveltejs/kit';

// export const handleValidationError: HandleValidationError = ({ event, issues }) => {
//     console.log(issues)
//     return {
//         message: issues.toString()
//     }
// };

export const handle: Handle = async ({ event, resolve }) => {
    const authRedirect = async () => {
        const redirectTo = new URLSearchParams({ redirectTo: event.url.pathname });
        return redirect(Status.TEMPORARY_REDIRECT, `/auth?${redirectTo}`);
    }

	const username = await getUserName()
	if (!username) {
		event.locals.username = undefined

		if (event.url.pathname.startsWith('/secured')) {
			return await authRedirect();
		}

		return resolve(event);
	}

	event.locals.username = username

	return resolve(event);
};
