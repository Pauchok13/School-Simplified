import { getBlogListing, getBlogPage } from "@api/notion";
import {
	Box,
	Center,
	Flex,
	Heading,
	Image,
	Text,
	VStack,
} from "@chakra-ui/react";
import Button from "@components/button";
import Container from "@components/container";
import ContainerInside from "@components/containerInside";
import NextLink from "@components/nextChakra";
import Head from "next/head";
import { BlogListing, BlogPage } from "types";
import { parsePage } from "util/parse_notion";

type BlogPageProps = { page: BlogPage; listing: BlogListing };
export default function BlogPage_({
	page,
	listing,
}: BlogPageProps): JSX.Element {
	if (!listing) {
		return (
			<>
				<Head>
					<title>School Simplified | 404 Error</title>
				</Head>
				<Container>
					<ContainerInside py={5}>
						<Flex
							flexDir={{ base: "column", md: "row" }}
							alignItems="center"
							justifyContent="space-between"
						>
							<Box>
								<Heading
									size="2xl"
									textAlign={{ base: "center", md: "left" }}
								>
									Oh No!
								</Heading>
								<Text
									fontSize="xl"
									my={3}
									textAlign={{ base: "center", md: "left" }}
								>
									It looks like a dog has eaten the blog page
									you're looking for. Click below to run away
									before it eats another one...
								</Text>
								<Text
									textAlign={{ base: "center", md: "left" }}
								>
									If a blog page is supposed to be here,
									please{" "}
									<NextLink
										href="/contact"
										color="brand.gold"
									>
										let us know
									</NextLink>
									.
								</Text>
								<NextLink
									href="/blog"
									_hover={{ cursor: "auto" }}
								>
									<Button
										_hover={{ cursor: "pointer" }}
										mt={3}
									>
										Return to Blog Home
									</Button>
								</NextLink>
							</Box>
							<Image
								src="/timmy/dog.png"
								alt="timmy dog"
								w={{ base: 200, sm: 250, md: 300 }}
								mt={{ base: 5, lg: 0 }}
							/>
						</Flex>
					</ContainerInside>
				</Container>
			</>
		);
	}

	const dtFormatter = new Intl.DateTimeFormat("en-US");
	return (
		<>
			<Head>
				<title>School Simplified | {listing.title}</title>
			</Head>
			<Container bg="brand.transparent">
				<ContainerInside my={7}>
					<VStack spacing={5}>
						<Heading as="h1">{listing.title}</Heading>
						<Text fontSize={18}>
							Published:{" "}
							{dtFormatter.format(new Date(listing.created_time))}
						</Text>
						{listing.authors?.length ? (
							<Box>
								<Text fontSize={18}>Written by:</Text>
								{listing.authors.map(
									(author, index: number) => {
										return (
											<Center key={index}>
												<Image
													src={author.avatar_url}
													boxSize={30}
													borderRadius={15}
													mr={3}
												/>
												<Text>{author.name}</Text>
											</Center>
										);
									}
								)}
							</Box>
						) : null}
						<NextLink href="/blog" color="#ffe19a">
							Back to Blog Home
						</NextLink>
					</VStack>
				</ContainerInside>
			</Container>
			<Container>
				<ContainerInside my={5} mx={{ sm: 0, md: 3 }}>
					<VStack spacing={3} alignItems="stretch">
						{parsePage(page)}
					</VStack>
				</ContainerInside>
			</Container>
			<Container bg="brand.transparent">
				<ContainerInside my={7}>
					<NextLink href="/blog" color="#ffe19a">
						Back to Blog Home
					</NextLink>
				</ContainerInside>
			</Container>
		</>
	);
}

export async function getStaticProps({ params }: any) {
	const blogListings = await getBlogListing();
	let thisListing = null;
	for (const blogListing of blogListings) {
		if (
			blogListing.link === params.link ||
			(!blogListing.link.length && blogListing.id === params.link)
		) {
			thisListing = blogListing;
			break;
		}
	}

	if (!thisListing) {
		return { props: { listing: null, page: [] } };
	}
	const props: BlogPageProps = {
		listing: thisListing,
		page: await getBlogPage(thisListing.id),
	};
	return { props, revalidate: 60 };
}

export async function getStaticPaths() {
	const blogListing = await getBlogListing();
	const paths = blogListing.map((blogListing) => {
		return { params: { link: blogListing.link } };
	});
	return { paths, fallback: true };
}
