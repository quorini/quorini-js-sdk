import axios from 'axios';
import { QClient } from '../config';
import { SESSION_KEY } from '.';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: QClient.getPrivate().authApiUrl, // Default base URL; can override per request if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

const getPresignedUrl = async (accessToken: string) => {
  let result: any = undefined;
  try {
    const apiUrl = QClient.getPrivate().apiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const url = `${apiUrl}/${projectId}/file-upload-url-type/${projectEnvironment === 'development' ? `?env=dev` : ''}`;
    console.log("getPresignedUrl", url)

    const response = await apiClient.get(url, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    console.log("getPresignedUrl-response", response)

    if (response.status === 200) {
      result = response.data;
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export const fileUpload = async (file: File, accessToken: string) => {
  let result: any = undefined;
  try {
    const presignedUrl = await getPresignedUrl(accessToken);

    // Set the Content-Type based on the file's MIME type
    const headers = {
      'Content-Type': file.type || 'application/octet-stream', // Fallback to generic type if file.type is empty
    };

    const response = await apiClient.put(presignedUrl.uploadUrl, file, { headers });

    console.log("fileUpload-response", response)
    if (response.status === 200) {
      result = {
        id: presignedUrl.fileId,
        url: presignedUrl.uploadUrl
      };
    }
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export const create = async (file: File, formData: any, usergroup: string) => {
  let result: any = undefined;
  const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);
  try {
    const apiUrl = QClient.getPrivate().apiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const url = `${apiUrl}/${projectId}/gql${projectEnvironment === 'development' ? `?env=dev` : ''}`;
    const uploadedFileId = fileUpload(file, session?.accessToken);
    const response = await apiClient.post(
      url, 
      {
        query: `mutation create($input: create${usergroup}Input!) { create${usergroup}(input: $input) { id }}`,
        variables: {
          input: {
            ...formData,
            fileField: `${uploadedFileId}`,
          },
        }
      },
      {
        headers: {
          Authorization: `${session?.accessToken}`
        }
      }
    );
    if (response.status === 200) {
      result = response.data;
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export const update = async (file: File, formData: any, usergroup: string) => {
  let result: any = undefined;
  const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);
  try {
    const apiUrl = QClient.getPrivate().apiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const url = `${apiUrl}/${projectId}/gql${projectEnvironment === 'development' ? `?env=dev` : ''}`;
    const uploadedFileId = fileUpload(file, session?.accessToken);
    const response = await apiClient.post(
      url, 
      {
        query: `mutation update($input: update${usergroup}Input!) { update${usergroup}(input: $input) { id }}`,
        variables: {
          input: {
            ...formData,
            fileField: `${uploadedFileId}`,
          },
        }
      },
      {
        headers: {
          Authorization: `${session?.accessToken}`
        }
      }
    );
    if (response.status === 200) {
      result = response.data;
    }
    return result;
  } catch (error) {
    throw error;
  }
}