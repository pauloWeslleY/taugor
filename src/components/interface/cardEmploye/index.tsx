import { icons } from "../../../config/icons";

import AvatarGirl from "../../../assets/avatar-feminino.png";
import AvatarBoy from "../../../assets/avatar-masculino.png";
import { useContext, useState } from "react";
import {
  DataEmploye,
  EmployerContext,
} from "../../../contexts/employerContext";
import { handleRenderRoleOrSector } from "../../../utils";

import { ChakraProvider } from "@chakra-ui/react";

import {
  Badge,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface CardEmployeProps {
  employe: DataEmploye;
  handleDelete?: (employe: DataEmploye) => Promise<void>;
}

export function CardEmploye({ employe, handleDelete }: CardEmployeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { listRoles } = useContext(EmployerContext);

  async function handleLoading() {
    if (handleDelete) {
      setLoading(true);
      await handleDelete(employe);
      setLoading(false);
    }
  }

  return (
    <ChakraProvider>
      <Stack
        borderWidth="1px"
        w={"full"}
        maxWidth={"400px"}
        borderRadius="lg"
        direction={{ md: "row" }}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        padding={2}
      >
        <Flex flex={1} bg="blue.200">
          {employe?.profileUrl ? (
            <Image
              objectFit="cover"
              w={"full"}
              h={"250px"}
              src={employe?.profileUrl}
              alt="Foto de perfil"
              borderRadius={"0.2rem"}
            />
          ) : (
            <Image
              w={"full"}
              h={"250px"}
              objectFit="cover"
              src={employe?.sex === "masculine" ? AvatarBoy : AvatarGirl}
              alt="Foto de perfil"
              borderRadius={"0.2rem"}
            />
          )}
        </Flex>

        <Stack flex={1} flexDirection="column" alignItems="center">
          <Flex
            bg={employe?.status === "active" ? "green.400" : "red.400"}
            alignSelf={"flex-end"}
            px={2}
            py={1}
            borderRadius={"0.3rem"}
            color={"white"}
          >
            {employe?.status === "active" ? "ATIVO" : "INATIVO"}
          </Flex>
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            {employe?.name}
          </Heading>
          <Text fontWeight={500} color={"gray.500"} size="sm">
            {employe?.email}
          </Text>
          <Stack
            align={"center"}
            justify={"center"}
            direction={"row"}
            mt={employe.status !== "active" ? 3 : 12}
          >
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
            >
              #{" "}
              {handleRenderRoleOrSector({ id: employe?.role, list: listRoles })}
            </Badge>
          </Stack>

          <Stack width={"100%"} direction={"column"} padding={1}>
            <Button
              as={Link}
              py={2}
              to={`/detail/${employe?.id}`}
              flex={1}
              h={"35px"}
              bg={"blue.400"}
              color={"white"}
              gap={2}
              boxShadow={
                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
              }
              _hover={{
                bg: "blue.500",
              }}
              _focus={{
                bg: "blue.500",
              }}
            >
              {icons.plus} Detalhes
            </Button>
            {employe.status !== "active" && (
              <Button
                py={2}
                flex={1}
                bg={"red.400"}
                color={"white"}
                gap={2}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                _hover={{
                  bg: "red.500",
                }}
                _focus={{
                  bg: "red.500",
                }}
                onClick={handleLoading}
                disabled={loading}
              >
                {loading ? icons.loading : "excluír"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </ChakraProvider>
  );
}
