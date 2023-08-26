import React from "react";
import { AppointmentType, UserType } from "../../types";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { updateAppointment } from "../../utils/apiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Props = {
  pageSession: UserType;
  appointment: AppointmentType;
  isOpen: any;
  onClose: any;
};

const ViewAppointmentDrawer = ({
  appointment,
  isOpen,
  onClose,
  pageSession,
}: Props) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (status: string) =>
      updateAppointment(
        appointment?.appointmentId,
        appointment?.date,
        appointment?.description,
        status
      ),
    {
      onError(err) {
        toast({
          title: `Error`,
          description:
            "An error occurred while setting the appointment status. Try again later.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        onClose();
      },
      onSuccess() {
        toast({
          title: `Appointment Updated`,
          description: `The appointment status has been updated.`,
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        queryClient.invalidateQueries("appointments");
        onClose();
      },
    }
  );
  return (
    <Drawer
      isFullHeight
      size={"md"}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Text
            textTransform={"capitalize"}
            pt={6}
            borderRadius={"sm"}
            fontSize={"lg"}
          >
            Appointment Details
          </Text>
          <Divider />
        </DrawerHeader>

        <DrawerBody whiteSpace={"pre-wrap"}>
          <VStack gap={5}>
            {pageSession?.role == "Patient" ? (
              <FormControl>
                <FormLabel>Doctor</FormLabel>
                <Input disabled value={`Dr. ${appointment?.doctorId}`} />
              </FormControl>
            ) : (
              <FormControl>
                <FormLabel>Patient</FormLabel>
                <Input disabled value={appointment?.patientId} />
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                disabled
                value={dayjs(new Date(appointment?.date)).format(
                  "MMMM D, YYYY"
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Time</FormLabel>
              <Input
                disabled
                value={dayjs(appointment?.time, "HH:mm").format("h:mm a")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                disabled
                size="md"
                value={appointment?.description}
              ></Textarea>
            </FormControl>
            {pageSession?.role == "Patient" ? (
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Input disabled value={appointment?.appointmentStatus} />
              </FormControl>
            ) : (
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  defaultValue={appointment?.appointmentStatus}
                  isDisabled={appointment?.appointmentStatus !== "Pending"}
                  onChange={(e) => mutate(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormControl>
            )}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewAppointmentDrawer;
