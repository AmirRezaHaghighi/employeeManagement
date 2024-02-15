"use client";

import react, { useState } from "react";

// mui
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Button, Container } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

// types
import { IEmployee } from "src/types/employee";

// store
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "src/store/slices";

// api
import { deleteEmployee } from "src/api/employee";

// components
import { useSnackbar } from "notistack";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import EmptyContent from "src/components/empty-content/empty-content";
import Iconify from "src/components/iconify";
import AddEmployeeModal from "./modals/AddEmployeeModal";

//----------------------------------

/**
 * This component represents a list of employees displayed using MUI DataGrid.
 * It allows users to perform CRUD operations on employee data.
 */

const EmployeeList = ({
  employees,
}: {
  employees: IEmployee[] | undefined;
}) => {
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IEmployee>();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const employeesState = useSelector((state: RootState) => state.employee);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "firstName",
      headerName: "First name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="bx:edit" />}
          color="primary"
          label="Edit"
          key="edit"
          onClick={() => {
            setSelectedItem(params?.row as IEmployee);
            setShowAddEditModal(true);
          }}
        />,
        <GridActionsCellItem
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          color="error"
          label="Delete"
          key="delete"
          onClick={() => {
            setSelectedItem(params.row as IEmployee);
            setShowDeleteModal(true);
          }}
        />,
      ],
    },
  ];

  const handleDelete = () => {
    dispatch(deleteEmployee(selectedItem?.id || ""));
    enqueueSnackbar("Employee Deleted Successfully");
    setShowDeleteModal(false);
    setSelectedItem(undefined);
  };

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="List"
        links={[{ name: "Employees", href: "" }, { name: "List" }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="ic:baseline-plus" />}
            onClick={() => setShowAddEditModal(true)}
          >
            New User
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {employees?.length ? (
        <DataGrid
          rows={employees || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      ) : (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
          }}
        />
      )}
      <AddEmployeeModal
        open={showAddEditModal}
        handleClose={() => {
          setShowAddEditModal(false);
          setSelectedItem(undefined);
        }}
        data={selectedItem}
      />
      <ConfirmDialog
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(undefined);
        }}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={employeesState.loading}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />
    </Container>
  );
};

export default EmployeeList;
