import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogRequestDto } from '../model/BlogRequestDto';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string; // URL or data URL
  tags: string[];
  published: boolean;
  createdDate: Date;
  instagramLink: string;
  facebookLink: string;
  linkedinLink: string;
  githubLink: string;
}

// Backend API model for a single blog item in the Page response
interface BlogApi {
  id: number | string;
  title: string;
  content: string;
  coverImage: string;
  tags: string | string[] | null;
  createdAt: string; // date string
  instagramLink: string;
  facebookLink: string;
  linkedinLink: string;
  githubLink: string;
}

// Spring Page response
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

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = 'https://api.finspire.lk/api/v1/blogs'; 
  // private apiUrl = 'http://localhost:8080/api/v1/blogs'; 

  constructor(private http: HttpClient) {}

  // Paginated fetch mapped from backend Page<Blogs>
  getBlogs(page = 0, size = 10): Observable<Page<BlogPost>> {
    return this.http
      .get<Page<BlogApi>>(`${this.apiUrl}/getAll`, {
        params: { page, size } as any
      })
      .pipe(
        map((resp) => {
          const mapped: Page<BlogPost> = {
            ...resp,
            content: (resp.content || []).map((b): BlogPost => ({
              id: String(b.id),
              title: b.title,
              content: b.content,
              coverImage: b.coverImage,
              tags: Array.isArray(b.tags)
                ? b.tags as string[]
                : (typeof b.tags === 'string' && b.tags.trim().length > 0
                    ? b.tags.split(/[,#\s]+/).filter(Boolean)
                    : []),
              published: true, // default to true if not provided
              createdDate: new Date(b.createdAt),
              instagramLink: b.instagramLink,
              facebookLink: b.facebookLink,
              linkedinLink: b.linkedinLink,
              githubLink: b.githubLink
            }))
          };
          return mapped;
        })
      );
  }

  getBlogById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${id}`);
  }

  // Some backends return plain text like "Successfully saved blog details" for multipart POSTs.
  // Accept text to avoid JSON parse errors, since the UI refreshes the list after success.
  addBlog(post: BlogRequestDto, file?: File | null): Observable<string> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append(
      'blogsRequestDto',
      new Blob([JSON.stringify(post)], { type: 'application/json' })
    );
    return this.http.post<string>(this.apiUrl, formData, { responseType: 'text' as 'json' });
  }

  updateBlog(id: string, updated: Partial<BlogPost>, file?: File | null): Observable<string> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append(
      'blogsRequestDto',
      new Blob([JSON.stringify(updated)], { type: 'application/json' })
    );
    return this.http.put<string>(`${this.apiUrl}/${id}`, formData, { responseType: 'text' as 'json' });
  }

  deleteBlog(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
