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
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
          <HStack w="100%" alignItems="center">
            <Badge colorScheme={badgeStatusColor[card?.appointmentStatus]}>
              {card?.appointmentStatus}
            </Badge>
            <Spacer />

            <ExternalLinkIcon
              cursor="pointer"
              onClick={() => {
                props?.setSelectedAppointment(card);
                props?.onViewAppointmentOpen();
              }}
              mx="2px"
            />
          </HStack>

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
            <Text fontSize="14px" color="gray.600" noOfLines={1}>
              Date: {new Date(card?.date).toDateString()}
            </Text>
            <Text fontSize="14px" color="gray.600" noOfLines={1}>
              Time: {card?.time}
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
