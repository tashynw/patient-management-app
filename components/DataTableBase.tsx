import { Box, Spinner } from "@chakra-ui/react";
import React from "react";
import DataTable, { TableProps } from "react-data-table-component";

const customStyles = {
  head: {
    style: {
      minHeight: "40px",
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "16px",
    },
  },
  headCells: {
    style: {
      justifyContent: "left",
      backgroundColor: "#F2F3F4",
    },
  },
};

const paginationComponentOptions = {
  noRowsPerPage: true,
};

type Props = {
  isLoading?: boolean;
};

export default function DataTableBase<T>(
  props: TableProps<T> & Props
): JSX.Element {
  return (
    <Box w="full">
      <DataTable
        progressComponent={
          <Box py={10}>
            <Spinner size="lg" color="blue.700" />
          </Box>
        }
        progressPending={props.isLoading}
        highlightOnHover
        pagination
        noDataComponent={"No Records found"}
        responsive
        {...props}
        customStyles={customStyles}
        striped
        paginationComponentOptions={paginationComponentOptions}
      />
    </Box>
  );
}
