import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionWrapper from '@/lib/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'MARVEL APPLICATION',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionWrapper>
			<html lang="en">
				<body className={inter.className}>{children}</body>
			</html>
		</SessionWrapper>
	);
}
