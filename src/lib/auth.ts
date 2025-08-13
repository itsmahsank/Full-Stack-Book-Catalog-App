import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email = credentials?.email?.toLowerCase();
				const password = credentials?.password ?? "";
				if (!email || !password) return null;

				const user = await prisma.user.findUnique({ where: { email } });
				if (!user?.password) return null;
				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) return null;
				const authUser: NextAuthUser = {
					id: user.id,
					name: user.name ?? null,
					email: user.email ?? null,
					image: user.image ?? null,
				};
				return authUser;
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async session({ session, token }: { session: import("next-auth").Session; token: JWT }) {
			if (session.user && token.sub) {
				(session.user as { id?: string }).id = token.sub;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};


