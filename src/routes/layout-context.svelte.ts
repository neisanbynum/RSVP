import { getUserName, logout } from "$lib/remote/auth.remote";
import { getContext, setContext } from "svelte";

interface AppState {
    username?: string
}

class AppContext implements AppState {
    previousPage?: string | null
    username = $derived.by(() => getUserName().current)

    async hydrate() {
        if (!this.username) {
            getUserName().refresh();
            this.username = await getUserName();
        }
    }

    async logout() {
        await logout()
        this.username = undefined
    }
}

const APP_CONTEXT_KEY = Symbol("RSVP_APP_CONTEXT");

export const setAppContext = () => {
    return setContext(APP_CONTEXT_KEY, new AppContext());
}

export const getAppContext = () => {
    return getContext<AppContext>(APP_CONTEXT_KEY);
}
