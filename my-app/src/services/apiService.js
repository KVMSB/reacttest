import axiosInstance from "./axios";
import apiClient from "./axios"
import { getToken } from "./tokenService";

export const getReports=async (token)=>{
   return await axiosInstance.get(`/userreport`, {
    headers:{
        Authorization: `Bearer ${token}`
    }
   });
}


export const getEmbedDetails=async (reportId, workspaceId, token)=>{
    return await axiosInstance.get(`/PowerBI/embed-url/${workspaceId}/${reportId}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
       })
}