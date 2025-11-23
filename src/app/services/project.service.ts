import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectRequestDto } from '../model/ProjectRequestDto';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string; // can be URL or data URL
  mediaType?: 'image' | 'video';
  featured: boolean;
  createdDate: Date;
}

// Spring Page response generic
export interface Page<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  empty: boolean;
}

// Backend API model (be tolerant to field variations)
interface ProjectApi {
  id: number | string;
  title: string;
  category: string;
  description: string;
  technologies: string[] | string | null;
  url?: string; // URL
  mediaType?: 'image' | 'video' | string | null;
  createdAt?: string;
  coverImage?: string; // in case backend uses different field
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  // Choose the path matching your controller mapping
  private apiUrl = 'https://api.finspire.lk/api/v1/projects';  
  // private apiUrl = 'http://localhost:8080/api/v1/projects';  
  constructor(private http: HttpClient) {}

  getProjects(page = 0, size = 10): Observable<Page<Project>> {
    return this.http
      .get<Page<ProjectApi>>(`${this.apiUrl}/getAll`, { params: { page, size } as any })
      .pipe(
        map((resp) => {
          const mapped: Page<Project> = {
            ...resp,
            content: (resp.content || []).map((p): Project => ({
              id: String(p.id),
              title: p.title,
              category: p.category,
              description: p.description,
              technologies: Array.isArray(p.technologies)
                ? (p.technologies as string[])
                : (typeof p.technologies === 'string' && p.technologies.trim().length > 0
                    ? p.technologies.split(/[,#\s]+/).filter(Boolean)
                    : []),
              image: (p.url || p.coverImage || ''),
              mediaType: (p.mediaType === 'video' ? 'video' : 'image'),
              featured: false,
              createdDate: p.createdAt ? new Date(p.createdAt) : new Date()
            }))
          };
          return mapped;
        })
      );
  }

  addProject(dto: ProjectRequestDto, file?: File | null): Observable<string> {
    const form = new FormData();
    if (file) {
      form.append('file', file);
    }
    form.append('projectsRequestDto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    return this.http.post<string>(`${this.apiUrl}`, form, { responseType: 'text' as 'json' });
  }

  updateProject(id: string, dto: Partial<ProjectRequestDto>, file?: File | null): Observable<string> {
    const form = new FormData();
    if (file) {
      form.append('file', file);
    }
    form.append('projectsRequestDto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    return this.http.put<string>(`${this.apiUrl}/${id}`, form, { responseType: 'text' as 'json' });
  }

  deleteProject(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}

