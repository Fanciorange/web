// 权限问题后期增加
import { get, post } from '/@/utils/http/axios';
import { UserState } from '/@/store/modules/user/types';
// import axios from 'axios';
enum URL {
    list = '/myapp/admin/thing/list',
    create = '/myapp/admin/thing/create',
    update = '/myapp/admin/thing/update',
    delete = '/myapp/admin/thing/delete',
    detail = '/api/thing/detail',
    uploadPicApi = '/myapp/admin/thing/uploadpic',
    uploadVedioApi = '/myapp/admin/thing/uploadVedio/upload',
    uploadVedioCheckApi = '/myapp/admin/thing/uploadVedio/check',
    uploadVedioMergeApi = '/myapp/admin/thing/uploadVedio/merge'
}

const listApi = async (params: any) => get<any>({ url: URL.list, params: params, data: {}, headers: {} });
const createApi = async (data: any) =>
    post<any>({ url: URL.create, params: {}, data: data, timeout:20000, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
const updateApi = async (params:any, data: any) =>
    post<any>({ url: URL.update,params: params, data: data, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
const deleteApi = async (params: any) => post<any>({ url: URL.delete, params: params, headers: {} });
const detailApi = async (params: any) => get<any>({ url: URL.detail, params: params, headers: {} });

const uploadPicApi =async (data: any) =>
    post<any>({ url: URL.uploadPicApi, params: {}, data: data, timeout:20000, headers: { 'Content-Type': 'multipart/form-data' } });
const uploadChunkApi= async (data: any) =>
    post<any>({ url: URL.uploadVedioApi, params: {}, data: data, timeout:60000, headers: { 'Content-Type': 'multipart/form-data' } });

const uploadCheckApi = async (data: any) => post<any>({url: URL.uploadVedioCheckApi,timeout:60000, params:{}, data: data, headers: {}});
const uploadMergeApi = async (data: any) => post<any>({ url: URL.uploadVedioMergeApi, timeout:60000,params:{},data: data, headers: {} });
export { listApi, createApi, updateApi, deleteApi, detailApi,uploadPicApi,uploadChunkApi,uploadMergeApi,uploadCheckApi };
