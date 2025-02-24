import { Center } from "@chakra-ui/react";
import Container from "@components/container";
import ContainerInside from "@components/containerInside";

export default function Essay(): JSX.Element {
	return (
		<Container>
			<ContainerInside py={10}>
				<Center>
					<iframe
						title=""
						src="https://docs.google.com/forms/d/e/1FAIpQLSe_8Dt4HL-UpI-JeTzTS-9K8bZE5WzdsQB38nZ7L915unEGCg/viewform?embedded=true"
						height="600"
						width="600"
						frameBorder={0}
						marginHeight={0}
						marginWidth={0}
					>
						Loading…
					</iframe>
				</Center>
			</ContainerInside>
		</Container>
	);
}
