import z from 'zod/v4';

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string()
});

const PARTICLES =
	'(?:a|da|das|dos|de|del|della|di|du|la|le|lo|las|los|van|von|der|den|ter|ten|al|bin|bint|ibn|mac|mc|st\\.)';
const CAP_WORD = "(?:\\p{Lu}[\\p{L}'’.\\-]*)";
const NAME_REGEX = new RegExp(
	`^(?:${PARTICLES}|${CAP_WORD})(?:\\s+(?:${PARTICLES}|${CAP_WORD}))*$`,
	'u'
);
export const NameSchema = (message?: string) => {
	return z.string().regex(NAME_REGEX, message ?? 'Invalid Name');
};

export const RegisterSchema = z
	.object({
		last: NameSchema('Invalid Last Name'),
		first: NameSchema('Invalid First Name'),
		middle: NameSchema('Invalid Middle Name').optional(),
		prefermiddle: z.boolean().default(false),
		email: z.email('Invalid Email'),
		phone: z.coerce
			.string()
			.regex(/^[0-9]{10}$/, 'Invalid Phone Number')
			.transform((num) => `+1 (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`)
			.or(z.string().regex(/^\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, 'Invalid Phone Number')),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain an uppercase letter')
			.regex(/[a-z]/, 'Password must contain a lowercase letter')
			.regex(/[0-9]/, 'Password must contain a number')
			.regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
		confirmpassword: z.coerce.string()
	})
	.refine(({ password, confirmpassword }) => password === confirmpassword, {
		error: 'Passwords Does Not Match',
		path: ['confirmpassword']
	});
