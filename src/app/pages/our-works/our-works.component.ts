import { Component, Input, OnInit } from '@angular/core';
import { ProjectService, Project } from '../../services/project.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}
interface GalleryImage {
  id: number;
  image: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string; // e.g., 'Residential', 'Commercial', 'Industrial'
}

@Component({
  selector: 'app-our-works',
  templateUrl: './our-works.component.html',
  styleUrls: ['./our-works.component.scss']
})
export class OurWorksComponent implements OnInit {
  @Input() title: string = 'Our Works';
  @Input() subtitle: string = '';
  @Input() breadcrumbs: { label: string; link?: string }[] = [];


  bubbles: Bubble[] = [];
  ripples = [0, 1, 2];

  
  works: Project[] = [];
  categories: string[] = [];
  selectedCategory = 'All';

  // Modal state
  showWorkModal = false;
  activeWork: Project | null = null;

  // Gallery properties
  galleryImages: GalleryImage[] = [];
  galleryCategories: string[] = [];
  selectedGalleryCategory = 'All';
  
  showGalleryModal = false;
  activeGalleryImage: GalleryImage | null = null;
  currentGalleryIndex = 0;

  constructor(private projectService: ProjectService,private toast: ToastService) { }

  ngOnInit(): void {
    // this.loadWorks();
    this.generateBubbles();
     this.loadGalleryImages();
  }

  generateBubbles(): void {
    this.bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 15,
      left: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4
    }));
  }
  loadGalleryImages(): void {
    // Sample gallery data - replace with actual API call
    this.galleryImages = [
      {
        id: 1,
        image: 'assets/images/gallery/install-1.png',
        title: 'RO System Installation - Colombo Residence',
        description: 'Complete 7-stage reverse osmosis system installed for a luxury apartment in Colombo 7. The system includes pre-filters, RO membrane, post carbon filter, and mineralization stage.',
        location: 'Colombo 7',
        date: '2025-01-15',
        category: 'Residential'
      },
      {
        id: 2,
        image: 'assets/images/gallery/install-2.png',
        title: 'Commercial Water Treatment - Hotel Project',
        description: 'Industrial-grade water purification system for a 5-star hotel including central filtration, softener, and point-of-use RO units in all rooms.',
        location: 'Galle Face, Colombo',
        date: '2025-01-10',
        category: 'Commercial'
      },
      {
        id: 3,
        image: 'assets/images/gallery/install-3.png',
        title: 'Whole House Filtration - Negombo Villa',
        description: 'Complete whole house water treatment system with sediment filter, carbon filter, and UV sterilization protecting all water outlets.',
        location: 'Negombo',
        date: '2024-12-28',
        category: 'Residential'
      },
      {
        id: 4,
        image: 'assets/images/gallery/install-4.png',
        title: 'Restaurant Kitchen Installation',
        description: 'High-capacity RO system for restaurant kitchen use, ensuring pure water for cooking and ice making. Includes dedicated lines for drinking water dispensers.',
        location: 'Kandy',
        date: '2024-12-20',
        category: 'Commercial'
      },
      {
        id: 5,
        image: 'assets/images/gallery/install-5.png',
        title: 'Industrial Water System - Factory',
        description: 'Large-scale water treatment plant for manufacturing facility requiring high-purity water for production processes.',
        location: 'Katunayake EPZ',
        date: '2024-12-15',
        category: 'Industrial'
      },
      {
        id: 6,
        image: 'assets/images/gallery/install-6.jpg',
        title: 'Under-Sink RO Unit - Modern Kitchen',
        description: 'Compact under-sink RO system with dedicated designer faucet, perfect for modern kitchens with limited space.',
        location: 'Mount Lavinia',
        date: '2024-12-10',
        category: 'Residential'
      }
    ];

    this.loadGalleryCategories();
  }
  loadGalleryCategories(): void {
    const cats = Array.from(new Set(this.galleryImages.map(img => img.category)));
    this.galleryCategories = ['All', ...cats];
  }

  loadCategories(): void {
    const projectCats = Array.from(new Set(this.works.map(p => p.category).filter(Boolean)));
    this.categories = ['All', ...projectCats];
  }

  filterWorks(category: string): void {
    this.selectedCategory = category;
  }

  filterGallery(category: string): void {
    this.selectedGalleryCategory = category;
  }

  get filteredWorks(): Project[] {
    if (this.selectedCategory === 'All') {
      return this.works;
    }
    return this.works.filter(work => work.category === this.selectedCategory);
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === 'All') {
      return this.galleryImages;
    }
    return this.galleryImages.filter(img => img.category === this.selectedGalleryCategory);
  }

  // Work modal methods
  openWork(work: Project): void {
    this.activeWork = work;
    this.showWorkModal = true;
  }

  closeWorkModal(): void {
    this.showWorkModal = false;
    this.activeWork = null;
  }

  // Gallery modal methods
  openGalleryImage(image: GalleryImage): void {
    this.activeGalleryImage = image;
    this.currentGalleryIndex = this.filteredGalleryImages.indexOf(image);
    this.showGalleryModal = true;
  }

  closeGalleryModal(): void {
    this.showGalleryModal = false;
    this.activeGalleryImage = null;
  }

  nextGalleryImage(): void {
    const filtered = this.filteredGalleryImages;
    if (this.currentGalleryIndex < filtered.length - 1) {
      this.currentGalleryIndex++;
      this.activeGalleryImage = filtered[this.currentGalleryIndex];
    }
  }

  prevGalleryImage(): void {
    if (this.currentGalleryIndex > 0) {
      this.currentGalleryIndex--;
      this.activeGalleryImage = this.filteredGalleryImages[this.currentGalleryIndex];
    }
  }

  // Keyboard navigation for gallery
  handleKeyPress(event: KeyboardEvent): void {
    if (!this.showGalleryModal) return;
    
    if (event.key === 'ArrowRight') {
      this.nextGalleryImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevGalleryImage();
    } else if (event.key === 'Escape') {
      this.closeGalleryModal();
    }
  }

  isLongDescription(work: Project, limit = 140): boolean {
    const len = (work && (work as any).description) ? String((work as any).description).length : 0;
    return len > limit;
  }
  // loadWorks(): void {
  //   this.projectService.getProjects().subscribe({
  //     next: (resp) => {
  //       this.works = resp.content;
  //       console.log('works loaded', this.works);
  //       this.loadCategories();
  //     },
  //     error: (err) => {
  //       console.error('Failed to load works', err);
  //       this.toast.error('Failed to load works');
  //     }
  //   });
  // }

  // loadCategories(): void {
  //   const projectCats = Array.from(new Set(this.works.map(p => p.category).filter(Boolean)));
  //   const merged = Array.from(new Set([
  //     ...projectCats
  //   ]));
  //   this.categories = ['All', ...merged];
  //   console.log('categories', this.categories);
  // }

  // filterWorks(category: string) {
  //   this.selectedCategory = category;
  // }

  // get filteredWorks() {
  //   if (this.selectedCategory === 'All') {
  //     return this.works;
  //   }
  //   return this.works.filter(work => work.category === this.selectedCategory);
  // }

  // openWork(work: Project) {
  //   this.activeWork = work;
  //   this.showWorkModal = true;
  // }

  // closeWorkModal() {
  //   this.showWorkModal = false;
  //   this.activeWork = null;
  // }

  // // Safe description length check for template
  // isLongDescription(work: Project, limit = 140): boolean {
  //   const len = (work && (work as any).description) ? String((work as any).description).length : 0;
  //   return len > limit;
  // }

}
