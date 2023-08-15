import React from "react";
import { AppointmentType, UserType } from "../../types";
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  UseModalProps,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BookAppointmentForm } from "../../types/Appointment";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { createAppointment } from "../../utils/apiService";

type Props = {
  doctors: UserType[];
  userId: string;
};

const BookAppointmentModal = ({
  isOpen,
  onClose,
  doctors,
  userId,
}: UseModalProps & Props) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookAppointmentForm>();

  const reset = () => {
    setValue("date", "");
    setValue("description", "");
    setValue("doctorId", "");
    setValue("time", "");
  };

  const { mutate, isLoading } = useMutation(
    (formValues: BookAppointmentForm) =>
      createAppointment({
        patientId: userId,
        date: formValues.date,
        time: formValues.time,
        description: formValues.description,
        doctorId: formValues.doctorId,
      }),
    {
      onError(err) {
        toast({
          title: `Booking Appointment Error`,
          description:
            "An error occurred while booking appointment. Try again later.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        onClose();
        reset();
      },
      onSuccess() {
        toast({
          title: `Appointment Booked`,
          description: `Your appointment request has been submitted and is pending review`,
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        queryClient.invalidateQueries("appointments");
        onClose();
        reset();
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutate(values);
  });
  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform={"capitalize"}>
          Book Appointment
          <Divider />
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody mt={-3}>
          <VStack gap={5}>
            <FormControl isRequired isInvalid={errors?.doctorId != null}>
              <FormLabel>Doctor</FormLabel>
              <Select
                placeholder="Select doctor"
                {...register("doctorId", {
                  required: {
                    value: true,
                    message: "Field is required",
                  },
                })}
              >
                {doctors?.map((doctor: UserType) => (
                  <option value={doctor?.userId} key={doctor?.userId}>
                    Dr. {`${doctor?.firstName} ${doctor?.lastName}`}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors?.doctorId && errors?.doctorId?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors?.date != null}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                {...register("date", {
                  required: {
                    value: true,
                    message: "Field is required",
                  },
                })}
              />
              <FormErrorMessage>
                {errors?.date && errors?.date?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors?.time != null}>
              <FormLabel>Time</FormLabel>
              <Input
                type="time"
                {...register("time", {
                  required: {
                    value: true,
                    message: "Field is required",
                  },
                })}
              />
              <FormErrorMessage>
                {errors?.time && errors?.time?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors?.description != null}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description", {
                  required: {
                    value: true,
                    message: "Field is required",
                  },
                  minLength: {
                    value: 10,
                    message: `Description is too short.`,
                  },
                  maxLength: {
                    value: 100,
                    message: `Description too long.`,
                  },
                })}
              />
              <FormErrorMessage>
                {errors?.description && errors?.description?.message}
              </FormErrorMessage>
            </FormControl>
            <Divider />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={() => onClose()}>
            Close
          </Button>
          <Button
            variant="solid"
            colorScheme="cyan"
            textTransform={"capitalize"}
            bg="blue.800"
            color="white"
            _hover={{
              bg: "blue.900",
            }}
            onClick={onSubmit}
            isLoading={isLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookAppointmentModal;
