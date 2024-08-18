"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from './ui/use-toast';
import { getEmployeeById, updateEmployee } from '@/utils/EmployeeService';


interface Employee {
    employeeId?: number;
    employeeName: string;
    employeeEmail: string;
    employeeDepartment: string;
    employeeTitle: string;
}

interface UpdateEmployeeProps {
    openUpdateEmployee: boolean;
    setOpenUpdateEmployee: (open: boolean) => void;
    empId: number;
    fetchEmployees: () => void;
}

const UpdateEmployee: React.FC<UpdateEmployeeProps> = ({ openUpdateEmployee, setOpenUpdateEmployee, empId, fetchEmployees }) => {

    const [editingEmployee, setEditingEmployee] = useState<Employee>({
        employeeId: empId,
        employeeName: "",
        employeeEmail: "",
        employeeDepartment: "",
        employeeTitle: "",
    });

    const fetchEmployeeDetails = async (empId: number) => {

        try {
            const response = await getEmployeeById(empId);
            setEditingEmployee(response);
        } catch (error: any) {
            console.error("Error fetching employee details:", error);
        }
    }

    useEffect(() => {
        if (empId) { // Ensure empId is valid
            fetchEmployeeDetails(empId);
        }
    }, [empId]); // Include empId in the dependency array



    const handleUpdateEmployee = async () => {
        try {
            await updateEmployee(editingEmployee);
            toast({
                variant: "success",
                description: "Employee updated successfully.. ✔️",
            });
            setOpenUpdateEmployee(false);
        } catch (error) {
            console.error("Error updating employee:", error);
        } finally {
            fetchEmployees();
        }
    };

    const handleCancelClick = () => {
        setEditingEmployee({
            employeeId: 0,
            employeeName: "",
            employeeEmail: "",
            employeeDepartment: "",
            employeeTitle: "",
        });
        setOpenUpdateEmployee(false);
    }


    return (
        <>{openUpdateEmployee &&
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={editingEmployee.employeeName || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        employeeName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editingEmployee.employeeEmail || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        employeeEmail: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                type="text"
                                value={editingEmployee.employeeDepartment || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        employeeDepartment: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={editingEmployee.employeeTitle || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        employeeTitle: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdateEmployee}>
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default UpdateEmployee;