import instance from "@/utils/request.ts";

export interface ProjectCreateResponse {
  code: number;
  message: string;
  obj: any;

  [property: string]: any;
}

export const createProject = (project: FormData) => {
  return new Promise((resolve, reject): ProjectCreateResponse => {
    instance.post(`/project/create`, project).then((res: AxiosResponse<ProjectCreateResponse>) => {
      resolve(res.data)
    }).catch((err: AxiosError) => {
      console.error(err)
      reject(err)
    })
  });
}
