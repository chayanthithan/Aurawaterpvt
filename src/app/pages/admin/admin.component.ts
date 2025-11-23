import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../../services/project.service';
import { BlogService, BlogPost } from '../../services/blog.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogRequestDto } from '../../model/BlogRequestDto';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ProjectRequestDto } from 'src/app/model/ProjectRequestDto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  projects: Project[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  // UI state: tabs
  activeTab: string = 'projects';
  isAddingProject = false;
  editingProject: Project | null = null;
  // Blog state
  blogs: BlogPost[] = [];
  isAddingBlog = false;
  editingBlog: BlogPost | null = null;
  // hold selected blog cover file for multipart upload
  private selectedCoverFile: File | null = null;

  // ================= NEW: Project Tracking System state =================
  trackingForm!: FormGroup;
  trackedProjects: any[] = [];
  trackingFilters = {
    status: 'All',
    priority: 'All',
    client: '',
    from: '',
    to: ''
  };

  // ================= NEW: Client Management System state =================
  clientForm!: FormGroup;
  clients: any[] = [];
  clientFilters = {
    status: 'All',
    type: 'All',
    search: ''
  };

  // ================= NEW: Budget & Financial Manager state ===============
  salaryForm!: FormGroup;
  transactionForm!: FormGroup;
  salaries: any[] = [];
  transactions: any[] = [];
  financeFilters = {
    type: 'All',
    month: 'All',
    year: 'All'
  };

  newProject: Omit<Project, 'id' | 'createdDate'> = {
    title: '',
    category: '',
    description: '',
    technologies: [],
    image: '',
    featured: false
  };

  availableCategories = [
    'Web Development',
    'Mobile Development', 
    'Data Visualization',
    'Cloud Solutions',
    'Artificial Intelligence',
    'Enterprise Software',
    'Logo Design',
    'UI/UX Design'
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private blogService: BlogService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  blogsForm!: FormGroup;
  projectsForm!: FormGroup;

  ngOnInit(): void {

    this.blogsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]],
      coverImage: [''],
      published: [false],
      tags: this.fb.array([]),
      instagramLink: [''],
      facebookLink: [''],
      linkedinLink: [''],
      githubLink: [''],
    });

    this.projectsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      image: [''],
      featured: [false],
      category: ['', Validators.required],
      technologies: this.fb.array([]),
      mediaType: [''],
      });

    // ================= NEW: Initialize forms for added sections =================
    this.trackingForm = this.fb.group({
      clientName: ['', Validators.required],
      clientCountry: [''],
      startDate: [''],
      endDate: [''],
      meetingTime: [''],
      projectType: [''],
      duration: [''],
      status: ['Incoming'],
      priority: ['Medium'],
      clientRequirements: [''],
      budget: [''],
      assignedTeam: this.fb.array([]),
      description: [''],
      techStack: this.fb.array([]),
      phase: ['Planning'],
      completion: [0],
      notes: ['']
    });

    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      whatsapp: [''],
      country: [''],
      cityState: [''],
      address: [''],
      timeZone: [''],
      type: ['Individual'],
      industry: [''],
      foundUs: [''],
      currentRequirements: [''],
      previousProjects: this.fb.array([]),
      lastMeetingDate: [''],
      lastMeetingNotes: [''],
      nextFollowUpDate: [''],
      status: ['Active'],
      communicationPref: ['Email'],
      updates: [''],
      rating: [0],
      importantNotes: [''],
      contracts: ['']
    });

    this.salaryForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeId: [''],
      role: [''],
      department: [''],
      hireDate: [''],
      salaryType: ['Monthly'],
      baseSalary: [''],
      currency: ['USD'],
      paymentDate: [''],
      bonus: [''],
      deductions: [''],
      netSalary: [''],
      paymentStatus: ['Pending'],
      paymentMethod: ['Bank Transfer'],
      bankDetails: [''],
      notes: ['']
    });

    this.transactionForm = this.fb.group({
      transactionId: [{ value: this.generateId(), disabled: true }],
      date: ['', Validators.required],
      time: [''],
      amount: ['', Validators.required],
      currency: ['USD'],
      txType: ['Income'],
      // Income specific
      incomeClient: [''],
      incomeProject: [''],
      incomeServiceType: [''],
      incomePaymentMethod: ['Bank Transfer'],
      invoiceNumber: [''],
      incomePaymentStatus: ['Pending'],
      // Expense specific
      expenseCategory: [''],
      vendor: [''],
      receiptNumber: [''],
      expensePaymentMethod: ['Bank Transfer'],
      approvalStatus: ['Pending'],
      // Shared
      description: [''],
      attachments: ['']
    });

    this.loadProjects();
    this.loadCategories();
    this.loadBlogs();
  }

  // Switch between tabs
  setTab(tab: 'projects' | 'blogs' | 'tracking' | 'clients' | 'finance'): void {
    this.activeTab = tab;
  }

  // Logout handler used by template button
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // ================= Existing Projects & Blogs functionality (restored) =================
  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (resp) => {
        this.projects = resp.content;
        console.log('projects loaded', this.projects);
        // Refresh categories after projects are loaded so dynamic categories are included
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.toast.error('Failed to load projects');
      }
    });
  }

  loadBlogs(): void {
    this.blogService.getBlogs(0, 10).subscribe({
      next: (resp) => {
        this.blogs = resp.content;
        console.log('blogs loaded', this.blogs);
      },
      error: (err) => {
        console.error('Failed to load blogs', err);
        this.toast.error('Failed to load blogs');
      }
    });
  }

  loadCategories(): void {
    // Merge predefined categories with those present in the loaded projects
    const projectCats = Array.from(new Set(this.projects.map(p => p.category).filter(Boolean)));
    const merged = Array.from(new Set([...
      this.availableCategories,
      ...projectCats
    ]));
    this.categories = ['All', ...merged];
  }

  get filteredProjects(): Project[] {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }
    return this.projects.filter(project => project.category === this.selectedCategory);
  }

  filterProjects(category: string): void {
    this.selectedCategory = category;
  }

  startAddingProject(): void {
    this.isAddingProject = true;
    this.editingProject = null;
    this.resetNewProject();
  }

  startEditingProject(project: Project): void {
    this.editingProject = { ...project };
    this.isAddingProject = false;
  }

  cancelEdit(): void {
    this.isAddingProject = false;
    this.editingProject = null;
    this.resetNewProject();
  }

  saveProject(): void {
    console.log("saveProject clicked")
    // debugger
    if (this.projectsForm.invalid) return;
    const dto: ProjectRequestDto = {
      title: this.projectsForm.value.title,
      category: this.projectsForm.value.category,
      description: this.projectsForm.value.description,
      technologies: (this.projectsForm.value.technologies || []) as string[],
      mediaType: this.projectsForm.value.mediaType,
      featured: this.projectsForm.value.featured
    };

    if (this.isAddingProject) {
      this.projectService.addProject(dto, this.selectedMediaFile).subscribe({
        next: () => {
          this.resetNewProject();
          this.isAddingProject = false;
          this.selectedMediaFile = null;
          this.toast.success('Project added successfully');
          this.loadProjects();
          this.loadCategories();
        },
        error: (err) => {
          console.error('Failed to add project', err);
          this.toast.error('Failed to add project');
        }
      });
    } else if (this.editingProject) {
      console.log("editing project", this.editingProject);
      this.projectService.updateProject(this.editingProject.id, this.editingProject).subscribe({
        next: () => {
          this.editingProject = null;
          this.toast.success('Project updated successfully');
          this.loadProjects();
          this.loadCategories();
        },
        error: (err) => {
          console.error('Failed to update project', err);
          this.toast.error('Failed to update project');
        }
      });
    }
  }

  selectedMediaFile: File | null = null;

  onFileSelected(evt: Event, context: 'new' | 'edit'): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedMediaFile = file; // Save it for upload later

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const isVideo = file.type.startsWith('video/');
      if (context === 'new') {
        this.newProject.image = dataUrl;
        (this.newProject as any).mediaType = isVideo ? 'video' : 'image';
      } else if (this.editingProject) {
        this.editingProject.image = dataUrl;
        (this.editingProject as any).mediaType = isVideo ? 'video' : 'image';
      }
    };

    reader.readAsDataURL(file);
  }

  // Blog CRUD
  newBlog: Omit<BlogPost, 'id' | 'createdDate'> = {
    title: '',
    content: '',
    coverImage: '',
    tags: [],
    published: false,
    instagramLink: '',
    facebookLink: '',
    linkedinLink: '',
    githubLink: ''
  };

  startAddingBlog(): void {
    this.isAddingBlog = true;
    this.editingBlog = null;
    this.resetNewBlog();
    this.blogsForm.reset({ title: '', content: '', coverImage: '', published: false ,instagramLink: '', facebookLink: '', linkedinLink: '', githubLink: ''});
    this.clearTags();
    this.selectedCoverFile = null;
  }

  startEditingBlog(post: BlogPost): void {
    this.editingBlog = { ...post };
    this.isAddingBlog = false;
    this.blogsForm.patchValue({
      title: post.title,
      content: post.content,
      coverImage: post.coverImage,
      published: post.published,
      instagramLink: post.instagramLink,
      facebookLink: post.facebookLink,
      linkedinLink: post.linkedinLink,
      githubLink: post.githubLink
    });
    this.clearTags();
    (post.tags || []).forEach(t => this.addTagControl(t));
  }

  cancelBlogEdit(): void {
    this.isAddingBlog = false;
    this.editingBlog = null;
    this.resetNewBlog();
    this.blogsForm.reset({ title: '', content: '', coverImage: '', published: false,instagramLink: '', facebookLink: '', linkedinLink: '', githubLink: '' });
    this.clearTags();
    this.selectedCoverFile = null;
  }

  saveBlog(): void {
    console.log(this.blogsForm.value);
    if (this.blogsForm.value.title.length === 0 || this.blogsForm.value.content.length === 0) 
    {this.toast.error('Blog title, content and cover image are required');return;};
    const dto: BlogRequestDto = {
      title: this.blogsForm.value.title,
      content: this.blogsForm.value.content,
      tags: (this.blogsForm.value.tags || []) as string[],
      instagramLink: this.blogsForm.value.instagramLink,
      facebookLink: this.blogsForm.value.facebookLink,
      linkedinLink: this.blogsForm.value.linkedinLink,
      githubLink: this.blogsForm.value.githubLink
    };

    if (this.isAddingBlog) {
      this.blogService.addBlog(dto, this.selectedCoverFile).subscribe({
        next: () => {
          this.blogsForm.reset();
          this.isAddingBlog = false;
          this.loadBlogs();
          this.selectedCoverFile = null;
          this.toast.success('Blog post added successfully');
        },
        error: (err) => {
          console.error('Failed to add blog', err);
          this.toast.error('Failed to add blog post');
        }
      });
    } else if (this.editingBlog) {
      this.blogService.updateBlog(this.editingBlog.id, dto as any, this.selectedCoverFile).subscribe({
        next: () => {
          this.editingBlog = null;
          this.loadBlogs();
          this.toast.success('Blog post updated successfully');
        },
        error: (err) => {
          console.error('Failed to update blog', err);
          this.toast.error('Failed to update blog post');
        }
      });
    }
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: (msg) => {
          this.loadBlogs();
          this.toast.success(msg);
        },
        error: (err) => {
          console.error('Failed to delete blog', err);
          this.toast.error('Failed to delete blog post');
        }
      });
    }
  }

  resetNewBlog(): void {
    this.newBlog = {
      title: '',
      content: '',
      coverImage: '',
      tags: [],
      published: false,
      instagramLink: '',
      facebookLink: '',
      linkedinLink: '',
      githubLink: ''
    };
  }

  // Reactive tags helpers
  get tagsFA(): FormArray {
    return this.blogsForm.get('tags') as FormArray;
  }

  addTagControl(tag: string): void {
    const t = tag.trim();
    if (!t) return;
    // prevent duplicates
    const exists = this.tagsFA.controls.some(c => c.value?.toLowerCase() === t.toLowerCase());
    if (!exists) {
      this.tagsFA.push(this.fb.control(t));
    }
  }

  removeTag(index: number): void {
    if (index > -1 && index < this.tagsFA.length) {
      this.tagsFA.removeAt(index);
    }
  }

  onTagKeyPress(evt: KeyboardEvent, input: HTMLInputElement): void {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      this.addTagControl(input.value);
      input.value = '';
    }
  }

  clearTags(): void {
    while (this.tagsFA.length) {
      this.tagsFA.removeAt(0);
    }
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: (msg) => {
          this.loadProjects();
          this.loadCategories();
          this.toast.success(msg);
        },
        error: (err) => {
          console.error('Failed to delete project', err);
          this.toast.error('Failed to delete project');
        }
      });
    }
  }

  resetNewProject(): void {
    this.newProject = {
      title: '',
      category: '',
      description: '',
      technologies: [],
      image: '',
      featured: false
    };
  }

  addTechnology(tech: string): void {
    if (tech.trim() && this.isAddingProject) {
      if (!this.newProject.technologies.includes(tech.trim())) {
        this.newProject.technologies.push(tech.trim());
      }
    } else if (tech.trim() && this.editingProject) {
      if (!this.editingProject.technologies.includes(tech.trim())) {
        this.editingProject.technologies.push(tech.trim());
      }
    }
  }

  removeTechnology(index: number): void {
    if (this.isAddingProject) {
      this.newProject.technologies.splice(index, 1);
    } else if (this.editingProject) {
      this.editingProject.technologies.splice(index, 1);
    }
  }

  onTechKeyPress(event: KeyboardEvent, input: HTMLInputElement): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTechnology(input.value);
      input.value = '';
    }
  }

  // Blog cover input
  onBlogCoverSelected(evt: Event, context: 'new' | 'edit'): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedCoverFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.blogsForm.get('coverImage')?.setValue(dataUrl);
    };

    reader.readAsDataURL(file);
  }

  removeMedia(context: 'new' | 'edit'): void {
    if (context === 'new') {
      this.newProject.image = '';
      // @ts-ignore
      delete (this.newProject as any).mediaType;
    } else if (this.editingProject) {
      this.editingProject.image = '';
      // @ts-ignore
      delete (this.editingProject as any).mediaType;
    }
  }

  removeBlogCover(context: 'new' | 'edit'): void {
    this.blogsForm.get('coverImage')?.setValue('');
    this.selectedCoverFile = null;
  }

  // Template helpers
  get formMedia(): string {
    return this.isAddingProject ? this.newProject.image : (this.editingProject?.image || '');
  }

  get formMediaType(): 'image' | 'video' | undefined {
    return this.isAddingProject
      ? (this.newProject as any).mediaType
      : (this.editingProject as any)?.mediaType;
  }

  // Blog form cover preview helper used in template
  get blogFormCover(): string {
    return (this.blogsForm?.get('coverImage')?.value as string) || '';
  }

  // Strongly-typed accessors for tracking FormArrays used in template
  get assignedTeamFA(): FormArray {
    return this.trackingForm.get('assignedTeam') as FormArray;
  }

  get techStackFA(): FormArray {
    return this.trackingForm.get('techStack') as FormArray;
  }

  removeTrackingTech(index: number) {
    const arr = this.trackingForm.get('techStack') as FormArray;
    if (index > -1 && index < arr.length) arr.removeAt(index);
  }

  addAssignedMember(name: string) {
    const n = name.trim();
    if (!n) return;
    const arr = this.trackingForm.get('assignedTeam') as FormArray;
    const exists = arr.controls.some(c => (c.value || '').toLowerCase() === n.toLowerCase());
    if (!exists) arr.push(this.fb.control(n));
  }

  removeAssignedMember(index: number) {
    const arr = this.trackingForm.get('assignedTeam') as FormArray;
    if (index > -1 && index < arr.length) arr.removeAt(index);
  }

  saveTrackedProject() {
    if (this.trackingForm.invalid) return;
    const payload = { id: this.generateId(), ...this.trackingForm.getRawValue() };
    this.trackedProjects.unshift(payload);
    this.trackingForm.reset({ status: 'Incoming', priority: 'Medium', phase: 'Planning', completion: 0 });
  }

  saveClient() {
    if (this.clientForm.invalid) return;
    const payload = { id: this.generateId(), ...this.clientForm.getRawValue(), createdAt: new Date() };
    this.clients.unshift(payload);
    this.clientForm.reset({ type: 'Individual', status: 'Active', communicationPref: 'Email', rating: 0 });
  }

  saveSalary() {
    if (this.salaryForm.invalid) return;
    const payload = { id: this.generateId(), ...this.salaryForm.getRawValue() };
    this.salaries.unshift(payload);
    this.salaryForm.reset({ salaryType: 'Monthly', currency: 'USD', paymentStatus: 'Pending', paymentMethod: 'Bank Transfer' });
  }

  saveTransaction() {
    if (this.transactionForm.invalid) return;
    const payload = { id: this.transactionForm.get('transactionId')?.value || this.generateId(), ...this.transactionForm.getRawValue() };
    this.transactions.unshift(payload);
    this.transactionForm.reset({ transactionId: this.generateId(), currency: 'USD', txType: 'Income', incomePaymentMethod: 'Bank Transfer', expensePaymentMethod: 'Bank Transfer', approvalStatus: 'Pending', incomePaymentStatus: 'Pending' });
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  }
}
