import { useRouter } from "next/router";
import React from "react";
import NextLink from "next/link";
import { AppointmentType, UserType, badgeStatusColor } from "../types/index";
import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Divider,
  HStack,
  Avatar,
  Badge,
  Link,
  Spacer,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface CardProps {
  cards: AppointmentType[];
  pageSession: UserType;
  setSelectedAppointment: any;
  onViewAppointmentOpen: any;
}

const Cards: React.FC<CardProps> = (props: CardProps) => {
  return (
    <SimpleGrid w="100%" gap={5} spacing={5} columns={[1, 2, 3]}>
      {props?.cards?.map((card) => (
        <Box
          bg="white"
          borderRadius={10}
          p={5}
          w="100%"
          key={card?.appointmentId}
          boxShadow="lg"
        >
          <Badge colorScheme={badgeStatusColor[card?.appointmentStatus]}>
            {card?.appointmentStatus}
          </Badge>

          <VStack w="100%" alignItems="flex-start" mt={4}>
            <Text
              fontSize="16px"
              fontWeight={500}
              noOfLines={1}
              cursor="pointer"
              onClick={() => {
                props?.setSelectedAppointment(card);
                props?.onViewAppointmentOpen();
              }}
            >
              {card?.description}
            </Text>
            <Text
              fontSize="14px"
              color="gray.600"
              noOfLines={1}
              fontWeight={500}
            >
              Date: {dayjs(new Date(card?.date)).format("MMMM D, YYYY")}
            </Text>
            <Text
              fontSize="14px"
              color="gray.600"
              noOfLines={1}
              fontWeight={500}
            >
              Time: {dayjs(card?.time, "HH:mm").format("h:mm a")}
            </Text>
          </VStack>

          <Divider />

          <VStack gap={1} w="100" alignItems="flex-start">
            {props?.pageSession?.role == "Patient" ? (
              <>
                <Heading size="sm" fontWeight={500} color="gray.600">
                  Doctor
                </Heading>
                <HStack w="100%">
                  <Avatar size="sm" name={card?.doctorId} />
                  <Heading size="sm" fontWeight={500}>
                    Dr. {card?.doctorId}
                  </Heading>
                </HStack>
              </>
            ) : (
              <>
                <Heading size="sm" fontWeight={500} color="gray.600">
                  Patient
                </Heading>
                <HStack w="100%">
                  <Avatar size="sm" name={card?.patientId} />
                  <Heading size="sm" fontWeight={500}>
                    {card?.patientId}
                  </Heading>
                </HStack>
              </>
            )}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default Cards;
