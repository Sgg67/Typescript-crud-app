import { Project } from './Projects';

const baseUrl = 'https://typescript-crud-app.vercel.app';
const url = `${baseUrl}/projects`;

function translateStatusToErrorMessage(status: number): string {
    switch (status) {
        case 401:
            return 'Please login again.';
        case 403:
            return 'You do not have permission to view the project(s).';
        default:
            return 'There was an error retrieving the project(s). Please try again.';
    }
}

function checkStatus(response: Response): Response {
    if (response.ok) {
        return response;
    }
    const httpErrorInfo = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    const errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
}

function parseJSON(response: Response): Promise<unknown> {
    return response.json();
}

interface ProjectData {
    id: number;
    name: string;
    description: string;
    budget: number;
    isActive: boolean;
}

function convertToProjectModels(data: ProjectData[]): Project[] {
    return data.map(convertToProjectModel);
}

function convertToProjectModel(item: ProjectData): Project {
    return new Project(item);
}

interface ProjectAPI {
    get(page?: number, limit?: number): Promise<Project[]>;
    put(project: Project): Promise<Project>;
    find(id: number): Promise<Project>;  // Added find method to the interface
}

const projectAPI: ProjectAPI = {
    put(project: Project): Promise<Project> {
        return fetch(`${url}/${project.id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((data: unknown) => {
            return convertToProjectModel(data as ProjectData);
        })
        .catch((error: Error) => {
            console.log('log client error ' + error);
            throw new Error(
                'There was an error updating the project. Please try again.'
            );
        });
    },
    get(page = 1, limit = 20): Promise<Project[]> {
        return fetch(`${url}?_page=${page}&_limit=${limit}&_sort=name`)
            .then(checkStatus)
            .then(parseJSON)
            .then((data: unknown) => {
                if (!Array.isArray(data)) {
                    throw new Error('Expected an array of projects');
                }
                return convertToProjectModels(data as ProjectData[]);
            })
            .catch((error: Error) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error retrieving the projects. Please try again.'
                );
            });
    },
    find(id: number): Promise<Project> {
        return fetch(`${url}/${id}`)
            .then(checkStatus)
            .then(parseJSON)
            .then((data: unknown) => convertToProjectModel(data as ProjectData))
            .catch((error: Error) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error finding the project. Please try again.'
                );
            });
    }
};

export { projectAPI };