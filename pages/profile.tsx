import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import NavBar from "../components/navbar";
import { EditUserProfileForm, UserType } from "../types";
import { deleteUser, updateUser } from "../utils/apiService";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "react-query";

interface ProfilePageProps {
  pageSession: UserType;
}

export default function ProfilePage({ pageSession }: ProfilePageProps) {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditUserProfileForm>();

  useEffect(() => {
    setValue("age", pageSession?.age! as any);
    setValue("address", pageSession?.address!);
    setValue("phoneNumber", pageSession?.phoneNumber!);
  }, [pageSession]);

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation(
    (values: EditUserProfileForm) =>
      updateUser(
        pageSession?.userId,
        parseInt(values?.age),
        values?.phoneNumber,
        values?.address
      ),
    {
      onSuccess() {
        toast({
          title: `Profile Updated`,
          description: `Your profile has been successfully updated.`,
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      },
      onError() {
        toast({
          description:
            "An error occurred while editing your profile. Try again later.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation(
    () => deleteUser(pageSession?.userId),
    {
      onSuccess(data, variables, context) {
        toast({
          title: `Profile Deleted`,
          description: `Your profile has been successfully deleted.`,
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        signOut();
        router.push("/login");
      },
      onError() {
        toast({
          description:
            "An error occurred while deleting your profile. Try again later.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    updateMutate(values);
  });

  return (
    <>
      <NavBar pageSession={pageSession} />
      <div className="container">
        <Heading mt={7} fontWeight="medium">
          Profile
        </Heading>
        <VStack w="100%" alignItems="flex-start" gap={10} mt={10}>
          <HStack gap={3} alignContent="center">
            <Avatar
              name={`${pageSession?.firstName} ${pageSession?.lastName}`}
            />
            <Heading size="sm" fontWeight={600}>
              {`${pageSession?.firstName} ${pageSession?.lastName}`}
            </Heading>
          </HStack>
          <VStack gap={10} alignItems="flex-start">
            <HStack gap={5}>
              <FormControl isRequired isInvalid={errors?.age != null}>
                <FormLabel>Age</FormLabel>
                <NumberInput max={100} min={5}>
                  <NumberInputField
                    {...register("age", {
                      min: {
                        value: 5,
                        message: "Age should be above 5",
                      },
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>
                  {errors?.age && errors?.age?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors?.phoneNumber != null}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  as={InputMask as any}
                  mask={"***-***-****"}
                  maskChar={null}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message: "Field is required",
                    },
                    minLength: {
                      value: 12,
                      message: "Phone number too short",
                    },
                    maxLength: {
                      value: 12,
                      message: "Phone number too short",
                    },
                  })}
                  id="phone"
                  inputMode="numeric"
                  type="tel"
                />
                <FormErrorMessage>
                  {errors?.phoneNumber && errors?.phoneNumber?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isRequired isInvalid={errors?.address != null}>
              <FormLabel>Address</FormLabel>
              <Textarea
                {...register("address", {
                  required: {
                    value: true,
                    message: "Field is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Address too short",
                  },
                  maxLength: {
                    value: 250,
                    message: "Address too long",
                  },
                })}
              />
              <FormErrorMessage>
                {errors?.address && errors?.address?.message}
              </FormErrorMessage>
            </FormControl>
            <HStack gap={5} mt={5}>
              <Button
                size="md"
                bg="blue.800"
                color="white"
                _hover={{
                  bg: "blue.900",
                }}
                isLoading={isUpdateLoading}
                onClick={onSubmit}
              >
                Save
              </Button>
              <Button
                size="md"
                colorScheme="red"
                isLoading={isDeleteLoading}
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete your account?")
                  ) {
                    deleteMutate();
                  }
                }}
              >
                Delete Account
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || session?.role == "Doctor") {
    return {
      redirect: {
        destination: "/login",
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
