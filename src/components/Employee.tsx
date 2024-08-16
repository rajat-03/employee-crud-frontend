"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import AddEmployee from "./AddEmployee";
import axios from "axios";
import UpdateEmployee from "./UpdateEmployee";

// Define a type for Employee
interface Employee {
    employeeId: number;
    employeeName: string;
    employeeEmail: string;
    employeeDepartment: string;
    employeeTitle: string;
}

export default function EmployeeComponent() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [openAddEmployee, setOpenAddEmployee] = useState(false);
    const [openUpdateEmployee, setOpenUpdateEmployee] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:8080/getByAnyField", {
                params: {
                    empName: searchTerm,
                    empDepartment: searchTerm,
                    empTitle: searchTerm,
                },
            });
            const data = response.data;
            setEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Reset to page 1 whenever the search term changes
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        paginatedEmployees();
    }, [searchTerm, currentPage]);

    const handleEditEmployee = (empId: number) => {
        setSelectedEmployeeId(empId);
        setOpenUpdateEmployee(true);
    };
    

    const paginatedEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:8080/searchEmployeeWithPaginated", {
                params: {
                    searchTerm: searchTerm,
                    page: currentPage - 1, // Page should be zero-based
                    size: pageSize,
                },
            });
            const data = response.data.content;
            setEmployees(data);
            setTotalPages(Math.ceil(response.data.totalElements / pageSize));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteEmployee = async (empId: number) => {
        try {
            await axios.delete(`http://localhost:8080/deleteEmployee/${empId}`);
            toast({
                variant: "success",
                description: "Employee deleted successfully.. ✔️",
            });
            paginatedEmployees(); // Refresh the paginated list after deletion
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Employee Management</h1>
                <Input
                    type="text"
                    placeholder="Search Employee"
                    className="max-w-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={() => setOpenAddEmployee(true)}>Add Employee</Button>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.employeeId}>
                                <TableCell className="font-medium">
                                    {employee.employeeName}
                                </TableCell>
                                <TableCell>{employee.employeeEmail}</TableCell>
                                <TableCell>{employee.employeeDepartment}</TableCell>
                                <TableCell>{employee.employeeTitle}</TableCell>
                                <TableCell className="text-right">
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() => handleEditEmployee(employee.employeeId)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteEmployee(employee.employeeId)}
                                            className="hover:bg-red-500 hover:text-white"
                                        >
                                            Delete
                                        </Button>
                                    </>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 flex justify-center items-center">
                <div className="space-x-2">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <AddEmployee
                openAddEmployee={openAddEmployee}
                setOpenAddEmployee={setOpenAddEmployee}
                fetchEmployees={paginatedEmployees}
            />
            <UpdateEmployee
                openUpdateEmployee={openUpdateEmployee}
                setOpenUpdateEmployee={setOpenUpdateEmployee}
                empId={selectedEmployeeId}
                fetchEmployees={paginatedEmployees}
            />
        </div>
    );
}
