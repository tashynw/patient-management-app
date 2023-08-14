import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import NavBar from "../components/navbar";
import {
  createDoctor,
  createUser,
  getIpAddress,
  getUserFromEmail,
} from "../utils/apiService";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { UserType } from "../types";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Checkbox,
} from "@chakra-ui/react";
import { SignupForm, SignupFormSchema } from "../types/Authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface SignUpPageProps {
  pageSession: UserType;
}

export default function SignUpPage(props: SignUpPageProps) {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupForm>({ resolver: zodResolver(SignupFormSchema) });
  const submitSignUp = handleSubmit(async (values) => {
    try {
      setIsLoading(true);
      const currentUser = await getUserFromEmail(values.email).catch((e) => {});
      if (currentUser) {
        setIsLoading(false);
        return toast({
          title: `Email already taken`,
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      }

      const ipAddress: string = await getIpAddress();
      if (isDoctor) {
        await createDoctor({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          ipAddress,
        });
        const loginStatus = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (!loginStatus?.ok) {
          return toast({
            title: `Login Failed`,
            status: "error",
            duration: 5000,
            position: "top-right",
            isClosable: true,
          });
        }
        setIsLoading(false);
        toast({
          title: `Sign up Successful`,
          description: `Account created successfully`,
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        return router.push("/doctor");
      }
      await createUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        ipAddress,
      });
      const loginStatus = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (!loginStatus?.ok) {
        return toast({
          title: `Login Failed`,
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      }

      setIsLoading(false);
      toast({
        title: `Sign up Successful`,
        description: `Account created successfully`,
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      router.push("/");
    } catch (err) {
      setIsLoading(false);
    }
  });

  // const handleSignUpForm = async (e: React.FormEvent<HTMLFormElement>) => {
  //   try {
  //     e.preventDefault();
  //     setIsLoading(true);
  //     if (password != confirmPassword) {
  //       setIsLoading(false);
  //       return setPasswordMismatch(true);
  //     }
  //     if (
  //       !new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(
  //         password
  //       )
  //     ) {
  //       setIsLoading(false);
  //       return setMatchPasswordRegex(false);
  //     }

  //     const currentUser = await getUserFromEmail(email).catch((e) => {});
  //     if (currentUser) {
  //       setIsLoading(false);
  //       return toast.error("Email already taken - try again");
  //     }

  //     const ipAddress: string = await getIpAddress();
  //     if (isDoctor) {
  //       const passCode: string = process.env.NEXT_PUBLIC_DOCTOR_CODE || "";
  //       if (doctorPassword != passCode) {
  //         setIsLoading(false);
  //         return toast.error("Incorrect doctor code");
  //       }
  //       await createDoctor({ firstName, lastName, email, password, ipAddress });
  //       const loginStatus = await signIn("credentials", {
  //         email,
  //         password,
  //         redirect: false,
  //       });
  //       if (!loginStatus?.ok) return toast.error("Sign in failed");
  //       setIsLoading(false);
  //       toast.success("Account created successfully");
  //       return router.push("/doctor");
  //     }
  //     await createUser({ firstName, lastName, email, password, ipAddress });
  //     const loginStatus = await signIn("credentials", {
  //       email,
  //       password,
  //       redirect: false,
  //     });
  //     if (!loginStatus?.ok) return toast.error("Sign in failed");
  //     setIsLoading(false);
  //     toast.success("Account created successfully");
  //     router.push("/");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  return (
    <div
      className="bg-image"
      style={{
        backgroundImage: `url("/static/background.jpg")`,
        height: "100vh",
      }}
    >
      <NavBar pageSession={props?.pageSession} />
      <div className="container" style={{ height: "88vh" }}>
        <div
          className="column h-100 d-flex justify-content-center align-items-center"
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
            <Heading size="md">Sign Up</Heading>
            <HStack flexDir={["column", "column", "row"]} gap={3} w="100%">
              <FormControl isRequired isInvalid={errors?.firstName != null}>
                <FormLabel>First Name</FormLabel>
                <Input
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: `Field is required`,
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors?.firstName && errors?.firstName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors?.lastName != null}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="lastName"
                  {...register("lastName", {
                    required: {
                      value: true,
                      message: `Field is required`,
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors?.lastName && errors?.lastName?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl
              isRequired
              id="email"
              isInvalid={errors?.email != null}
            >
              <FormLabel>Email Address</FormLabel>
              <Input
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
            <HStack flexDir={["column", "column", "row"]} gap={3} w="100%">
              <FormControl isRequired isInvalid={errors?.password != null}>
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
              <FormControl
                isRequired
                isInvalid={errors?.confirmPassword != null}
              >
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? `text` : `password`}
                    {...register("confirmPassword", {
                      required: {
                        value: true,
                        message: `Field is required`,
                      },
                      validate: (value) => {
                        if (value != getValues("password")) {
                          return "Passwords must match";
                        }
                      },
                    })}
                  />
                  <InputRightElement
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    children={
                      showConfirmPassword ? (
                        <ViewOffIcon fontSize={20} color="blue.700" />
                      ) : (
                        <ViewIcon fontSize={20} color="blue.700" />
                      )
                    }
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors?.confirmPassword && errors?.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <VStack w="100%" alignItems="flex-start">
              {isDoctor && (
                <FormControl isInvalid={errors?.doctorCode != null}>
                  <FormLabel>Doctor Code</FormLabel>
                  <Input
                    {...register("doctorCode", {
                      validate: (value) => {
                        if (!isDoctor) return undefined;

                        if (value != process.env.NEXT_PUBLIC_DOCTOR_CODE) {
                          return "Incorrect doctor code";
                        }
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors?.doctorCode && errors?.doctorCode?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
              <Checkbox onChange={() => setIsDoctor(!isDoctor)}>
                Are you a doctor?
              </Checkbox>
            </VStack>

            <Button
              bg={"blue.800"}
              color={"white"}
              mt={4}
              _hover={{
                bg: "blue.900",
              }}
              isLoading={isLoading}
              onClick={() => {
                submitSignUp();
              }}
              w={"100%"}
            >
              Sign up
            </Button>

            <Text size={"sm"}>
              Already have an account?{" "}
              <Text as="span" size={"sm"} color={"blue.700"}>
                <Link href={"/login"}>Login</Link>
              </Text>
            </Text>
          </VStack>
          {/* <div className="w-20 p-4 bg-white rounded-3">
            <h4 className="text-center">Sign Up</h4>
            <br />
            <form>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter First Name"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter Last Name"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control mt-2"
                  placeholder="Enter email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className={
                    matchPasswordRegex
                      ? "form-control mt-2"
                      : "form-control mt-2 is-invalid"
                  }
                  placeholder="Enter password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!matchPasswordRegex && (
                  <div className="invalid-feedback">
                    Minimum of eight characters, at least one letter, number and
                    special character.
                  </div>
                )}
              </div>
              <br />
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={
                    !passwordMismatch
                      ? "form-control mt-2"
                      : "form-control mt-2 is-invalid"
                  }
                  placeholder="Confirm password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordMismatch && (
                  <div className="invalid-feedback">
                    The password does not match.
                  </div>
                )}
              </div>
              <br />
              {isDoctor && (
                <div className="form-group">
                  <label>Enter Doctor's code</label>
                  <input
                    type="password"
                    className="form-control mt-2"
                    placeholder="Enter password"
                    required
                    onChange={(e) => setDoctorPassword(e.target.value)}
                  />
                </div>
              )}
              <br />
              <div className="form-check">
                <label className="form-check-label">
                  Are you a Doctor?
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isDoctor}
                    onChange={() => setIsDoctor(!isDoctor)}
                  />
                </label>
              </div>
              <br />
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg text-white"
                >
                  Start Today!{" "}
                  {isLoading && (
                    <div
                      className="spinner-border text-white spinner-border-sm"
                      role="status"
                    ></div>
                  )}
                </button>
              </div>
            </form>
            <br />
            <div className="text-center">
              <Link
                href="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <strong>Already have an account? Login</strong>
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
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
