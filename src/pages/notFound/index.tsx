import {
  Heading,
  Text,
  Button,
  ChakraProvider,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <ChakraProvider>
      <Flex
        textAlign="center"
        flexDir={"column"}
        justify={"center"}
        py={10}
        px={6}
        h={"full"}
      >
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, blue.200, blue.900)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Página não encontrada
        </Text>
        <Text color={"gray.500"} mb={6}>
          Clique no botão e navegue para a página inicial
        </Text>

        <Flex align={"center"} justify={"center"}>
          <Button
            colorScheme="blue"
            bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
            color="white"
            as={Link}
            to={"/home"}
          >
            Página inicial
          </Button>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
