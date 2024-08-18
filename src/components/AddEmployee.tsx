"use client"

import React, { FC, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { addEmployee } from '@/utils/EmployeeService';

// Define a type for Employee
interface Employee {
    employeeId?: number;
    employeeName: string;
    employeeEmail: string;
    employeeDepartment: string;
    employeeTitle: string;
}

interface AddEmployeeProps {
    openAddEmployee: boolean;
    setOpenAddEmployee: (open: boolean) => void;
    fetchEmployees: () => void;
}

const AddEmployee: FC<AddEmployeeProps> = ({ openAddEmployee, setOpenAddEmployee, fetchEmployees }) => {

    const { toast } = useToast();
    const [newEmployee, setNewEmployee] = useState<Employee>({
        employeeName: "",
        employeeEmail: "",
        employeeDepartment: "",
        employeeTitle: "",
    });
    const handleAddEmployee = async () => {
        try {
            await addEmployee(newEmployee);
            toast({
                variant: "success",
                description: "Employee added successfully.. ✔️",
            });
            setOpenAddEmployee(false);
        } catch (error) {
            console.error(error);
        } finally {
            setNewEmployee({
                employeeName: "",
                employeeEmail: "",
                employeeDepartment: "",
                employeeTitle: "",
            });
            fetchEmployees();
        }
    };
    return (
        <>{
            openAddEmployee && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newEmployee.employeeName}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, employeeName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newEmployee.employeeEmail}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, employeeEmail: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    type="text"
                                    value={newEmployee.employeeDepartment}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, employeeDepartment: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={newEmployee.employeeTitle}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, employeeTitle: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setOpenAddEmployee(false)}
                                >
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleAddEmployee}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddEmployee