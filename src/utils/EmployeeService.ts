import axios from "axios";
import { Employee } from "./type";

export const api = axios.create({
    baseURL: "http://localhost:8080",
});

export const fetchEmployees = async () => {
    try {
        const response = await api.get("/allEmployees");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const addEmployee = async (employee: Employee) => {
    try {
        await api.post("/employee", employee);
    } catch (error) {
        console.error(error);
    }
};

export const updateEmployee = async (employee: Employee) => {
    try {
        await api.put(`/updateEmployee/${employee.employeeId}`, employee);
    } catch (error) {
        console.error(error);
    }
}

export const fetchAllEmployees = async (searchTerm: String, currentPage: number, pageSize: number) => {
    try {
        const response = await api.get("/searchEmployeeWithPaginated", {
            params: {
                searchTerm: searchTerm,
                page: currentPage - 1, // Page should be zero-based
                size: pageSize,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const deleteEmployee = async (empId: number) => {
    try {
        await api.delete(`/deleteEmployee/${empId}`);
    } catch (error) {
        console.error(error);
    }
};