import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [
	{
		ignores: [
			".agents/**",
			".next/**",
			"node_modules/**",
			"next-env.d.ts",
			"prisma/**/*.js",
		],
	},
	...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
