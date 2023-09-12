import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Divider,
  DrawerBody,
  DrawerFooter,
  Button,
  DrawerCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { AppointmentType } from "../../types";

type Props = {
  appointment: AppointmentType;
  isOpen: any;
  onClose: any;
};

const ViewAppointmentDescription = ({
  appointment,
  isOpen,
  onClose,
}: Props) => {
  return (
    <Drawer
      isFullHeight
      size={"sm"}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Text
            textTransform={"capitalize"}
            pt={6}
            borderRadius={"sm"}
            fontSize={"lg"}
          >
            Appointment Description
          </Text>
          <Divider />
        </DrawerHeader>

        <DrawerBody whiteSpace={"pre-wrap"}>
          {appointment?.description}
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

export default ViewAppointmentDescription;
