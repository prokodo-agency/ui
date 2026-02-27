/** Base URL for the prokodo Storybook. */
export const STORYBOOK_URL = process.env.NODE_ENV === 'development'
	? 'http://localhost:6006'
	: 'https://ui.prokodo.com/storybook';

/** Base URL for the prokodo n8n marketplace. */
export const MARKETPLACE_URL = 'https://www.n8n-marketplace.prokodo.com';

/** prokodo parent website. */
export const PROKODO_URL = 'https://www.prokodo.com';

/** prokodo GitHub organisation. */
export const GITHUB_URL = 'https://github.com/prokodo-agency';

/** prokodo UI repository. */
export const GITHUB_UI_URL = 'https://github.com/prokodo-agency/ui';

/** prokodo UI on npm. */
export const NPM_URL = 'https://www.npmjs.com/package/@prokodo/ui';

/** prokodo LinkedIn company page. */
export const LINKEDIN_URL = 'https://www.linkedin.com/company/prokodo-agency/';
