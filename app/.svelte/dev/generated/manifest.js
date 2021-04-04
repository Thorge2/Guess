import * as layout from "../../../src/routes/$layout.svelte";

const components = [
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/about.svelte"),
	() => import("../../../src/routes/game/index.svelte"),
	() => import("../../../src/routes/game/create.svelte"),
	() => import("../../../src/routes/game/join.svelte")
];

const d = decodeURIComponent;
const empty = () => ({});

export const routes = [
	// src/routes/index.svelte
[/^\/$/, [components[0]]],

// src/routes/about.svelte
[/^\/about\/?$/, [components[1]]],

// src/routes/game/index.svelte
[/^\/game\/?$/, [components[2]]],

// src/routes/game/create.svelte
[/^\/game\/create\/?$/, [components[3]]],

// src/routes/game/join.svelte
[/^\/game\/join\/?$/, [components[4]]]
];

export { layout };