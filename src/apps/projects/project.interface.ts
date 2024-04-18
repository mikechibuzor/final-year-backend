export interface IProjectId {
  projectId: string;
}

export interface IProjectDetails {
  projectId?: string;
  title?: string;
  matricNo?: string;
  authorFirstName?: string;
  authorLastName?: string;
  year?: number;
  citation?: string;
  supervisorId?: string;
  projectDoc?: Express.Multer.File[]
}

