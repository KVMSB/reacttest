import axiosInstance from "./axios";
import apiClient from "./axios"
import { getToken } from "./tokenService";

export const getReports=async (email)=>{
   return await axiosInstance.get(`/userreport/?email=${email}`)
}


export const getEmbedDetails=async (reportId, workspaceId)=>{
    return await axiosInstance.get(`/PowerBI/embed-url/${workspaceId}/${reportId}`)
}