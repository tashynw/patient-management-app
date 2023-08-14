import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import NavBar from "../components/navbar";
import { UserType } from "../types";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  Heading,
  Input,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginForm, LoginFormSchema } from "../types/Authentication";

interface LoginPageProps {
  pageSession: UserType;
}

export default function LoginPage(props: LoginPageProps) {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const submitSignIn = handleSubmit(async (values) => {
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      toast({
        title: `Login Failed`,
        description: "Invalid Credentials",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    } else {
      toast({
        title: `Login Successful`,
        description: `You successfully logged in`,
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      router.push("/");
    }
    setLoading(false);
  });

  return (
    <>
      <div
        className="bg-image"
        style={{
          backgroundImage: `url("/static/background.jpg")`,
          height: "100vh",
        }}
      >
        <NavBar pageSession={props?.pageSession} />
        <div
          className="container"
          style={{
            height: "88vh",
            backgroundImage: "../public/static/login-background.jpg",
          }}
        >
          <div
            className="h-100 d-flex justify-content-center align-items-center"
            style={{ gap: "100px" }}
          >
            <div className="w-85 p-3 intro-banner">
              <h1 className="text-white">Book Doctor Appointments</h1>
              <br />
              <h4 className="text-white">
                Sign up now and start booking your appointments online
              </h4>
              <br />
            </div>
            <VStack borderRadius={8} bg="white" gap={5} p={5}>
              <Heading size="md">Login</Heading>
              <FormControl
                isRequired
                isInvalid={errors?.email != null}
                id="email"
              >
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: `Field is required`,
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors?.email && errors?.email?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors?.password != null}
                id="password"
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? `text` : `password`}
                    placeholder="Enter password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: `Field is required`,
                      },
                    })}
                  />
                  <InputRightElement
                    onClick={() => setShowPassword(!showPassword)}
                    children={
                      showPassword ? (
                        <ViewOffIcon fontSize={20} color="blue.700" />
                      ) : (
                        <ViewIcon fontSize={20} color="blue.700" />
                      )
                    }
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors?.password && errors?.password?.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                bg={"blue.800"}
                color={"white"}
                mt={4}
                _hover={{
                  bg: "blue.900",
                }}
                isLoading={isLoading}
                onClick={() => {
                  submitSignIn();
                }}
                w={"100%"}
              >
                Login
              </Button>

              <Text size={"sm"}>
                Dont have an account?{" "}
                <Text as="span" size={"sm"} color={"blue.700"}>
                  <Link href={"/signup"}>Sign up</Link>
                </Text>
              </Text>
            </VStack>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    const redirectDestination = session?.role == "Doctor" ? "/doctor" : "/";
    return {
      redirect: {
        destination: redirectDestination,
        permanent: false,
      },
    };
  }

  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
    },
  };
}
