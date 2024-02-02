/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port:'3000'
			},
			{
				protocol: "https",
				hostname: "deadpan-battle-production.up.railway.app",
			},
		],
	},
};

module.exports = nextConfig;
