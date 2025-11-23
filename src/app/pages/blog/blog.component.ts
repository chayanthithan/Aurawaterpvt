import { Component, Input, OnInit } from '@angular/core';
import { BlogService, } from '../../services/blog.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  createdDate: string;
  tags: string[];
  category: string;
  instagramLink?: string;
  facebookLink?: string;
  linkedinLink?: string;
  githubLink?: string;
}
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
 @Input() title: string = 'Blogs';
  @Input() subtitle: string = '';
  @Input() breadcrumbs: { label: string; link?: string }[] = [];

  bubbles: Bubble[] = [];
  ripples = [0, 1, 2];

  posts: BlogPost[] = [];
  selectedTag: string = 'All';
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  // Modal state
  showPostModal = false;
  activePost: BlogPost | null = null;

  constructor(private blogService: BlogService, private toast: ToastService,private route: ActivatedRoute, private router: Router) {
    // this.load();
  }

  ngOnInit(): void {
    // this.load();
    this.generateBubbles();
    this.loadBlogs();
    
    // Check if coming from homepage with a specific blog slug
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.setFeaturedBySlug(slug);
      }
    });

    // Also check query params as alternative
    this.route.queryParamMap.subscribe(params => {
      const blogId = params.get('featured');
      if (blogId) {
        this.setFeaturedById(+blogId);
      }
    });
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

  featuredBlog: BlogPost | null = null;
  otherBlogs: BlogPost[] = [];
  
  tags: string[] = ['All'];
  pageSize = 6;

  loadBlogs(): void {
    // Replace with your actual service call
    // this.blogService.getBlogs().subscribe(blogs => {
    //   this.blogs = blogs;
    //   this.extractTags();
    //   this.updateDisplayedBlogs();
    // });
    
    // For now, after loading:
    this.extractTags();
    this.updateDisplayedBlogs();
  }

  extractTags(): void {
    const allTags = new Set<string>();
    this.blogs.forEach(blog => {
      blog.tags.forEach(tag => allTags.add(tag));
    });
    this.tags = ['All', ...Array.from(allTags)];
  }

  setFeaturedBySlug(slug: string): void {
    const blog = this.blogs.find(b => b.slug === slug);
    if (blog) {
      this.featuredBlog = blog;
      this.updateDisplayedBlogs();
    }
  }

  setFeaturedById(id: number): void {
    const blog = this.blogs.find(b => b.id === id);
    if (blog) {
      this.featuredBlog = blog;
      this.updateDisplayedBlogs();
    }
  }

  selectFeatured(blog: BlogPost): void {
    this.featuredBlog = blog;
    this.updateDisplayedBlogs();
    
    // Update URL without full navigation
    this.router.navigate(['/blog', blog.slug], { 
      replaceUrl: true,
      queryParamsHandling: 'preserve'
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFeatured(): void {
    this.featuredBlog = null;
    this.updateDisplayedBlogs();
    this.router.navigate(['/blog'], { replaceUrl: true });
  }

  updateDisplayedBlogs(): void {
    let filtered = this.blogs;
    
    // Apply tag filter
    if (this.selectedTag !== 'All') {
      filtered = filtered.filter(b => b.tags.includes(this.selectedTag));
    }
    
    // Separate featured from others
    if (this.featuredBlog) {
      this.otherBlogs = filtered.filter(b => b.id !== this.featuredBlog!.id);
    } else {
      this.otherBlogs = filtered;
    }
    
    // Pagination
    this.totalElements = this.otherBlogs.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    
    const start = this.page * this.pageSize;
    this.otherBlogs = this.otherBlogs.slice(start, start + this.pageSize);
  }

  onTagChange(): void {
    this.page = 0;
    // Check if featured blog still matches filter
    if (this.featuredBlog && this.selectedTag !== 'All') {
      if (!this.featuredBlog.tags.includes(this.selectedTag)) {
        this.featuredBlog = null;
      }
    }
    this.updateDisplayedBlogs();
  }

  // Pagination methods
  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.updateDisplayedBlogs();
    }
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.updateDisplayedBlogs();
    }
  }

  goToPage(p: number): void {
    this.page = p;
    this.updateDisplayedBlogs();
  }

  isLong(blog: BlogPost, length: number): boolean {
    return blog.content.length > length;
  }
  // load() {
  //   this.blogService.getBlogs(this.page, this.size).subscribe({
  //     next: (resp) => {
  //       this.posts = resp.content;
  //       console.log("posts loaded", this.posts);
  //       this.totalPages = resp.totalPages;
  //       this.totalElements = resp.totalElements;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load blog posts', err);
  //       this.toast.error('Failed to load blog posts');
  //     }
  //   });
  // }
  // loadCategories(): void {
  //   const projectCats = Array.from(new Set(this.posts.map(p => p.tags).filter(Boolean)));
  //   const merged = Array.from(new Set([
  //     ...projectCats
  //   ]));
  //   this.tags = ['All', ...merged];
  //   console.log('categories', this.tags);
  // }
  // nextPage() {
  //   if (this.page + 1 < this.totalPages) {
  //     this.page += 1;
  //     // this.load();
  //   }
  // }

  // prevPage() {
  //   if (this.page > 0) {
  //     this.page -= 1;
  //     // this.load();  
  //   }
  // }

  // goToPage(p: number) {
  //   if (p >= 0 && p < this.totalPages) {
  //     this.page = p;
  //     // this.load();
  //   }
  // }

  // get tags(): string[] {
  //   const all = new Set<string>();
  //   this.posts.forEach(p => p.tags.forEach(t => all.add(t)));
  //   return ['All', ...Array.from(all).sort()];
  // }

  // get filtered(): BlogPost[] {
  //   if (this.selectedTag === 'All') return this.posts;
  //   return this.posts.filter(p => p.tags.includes(this.selectedTag));
  // }

  // openPost(post: BlogPost) {
  //   this.activePost = post;
  //   this.showPostModal = true;
  // }

  // closePostModal() {
  //   this.showPostModal = false;
  //   this.activePost = null;
  // }

  // // Safely check if content is longer than preview length
  // isLong(post: BlogPost, limit = 180): boolean {
  //   const len = (post && (post as any).content) ? String((post as any).content).length : 0;
  //   return len > limit;
  // }

  blogs:BlogPost[] = [
    {
      "id": 1,
      "slug": "whole-house-water-filtration",
      "title": "Understanding Reverse Osmosis: The Gold Standard in Water Purification",
      "excerpt": "Discover how reverse osmosis technology removes up to 99% of contaminants from your drinking water.",
      "content": "Reverse osmosis (RO) has become one of the most effective and widely used water purification technologies in both residential and commercial settings. This sophisticated filtration process works by pushing water through a semi-permeable membrane that blocks contaminants while allowing pure water molecules to pass through.\n\nHow Does Reverse Osmosis Work?\n\nThe process begins when water pressure forces tap water through a series of filters. The first stage typically involves a sediment filter that removes larger particles like dirt, sand, and rust. Next, water passes through an activated carbon filter that eliminates chlorine and organic compounds that could damage the RO membrane.\n\nThe heart of the system is the RO membrane itself, which has microscopic pores measuring just 0.0001 microns. To put this in perspective, a human hair is about 75 microns wide. This incredibly fine filtration removes up to 99% of dissolved salts, bacteria, viruses, and other contaminants.\n\nBenefits of RO Systems:\n\n1. Superior Contaminant Removal: RO systems effectively remove lead, arsenic, fluoride, nitrates, and hundreds of other harmful substances.\n\n2. Improved Taste: By removing chlorine and dissolved minerals, RO water often tastes cleaner and fresher than tap water.\n\n3. Cost-Effective: While the initial investment may seem significant, RO systems provide purified water at a fraction of the cost of bottled water.\n\n4. Environmental Impact: Using an RO system reduces plastic bottle waste significantly.\n\nAt Yali Water Solutions, we offer state-of-the-art RO systems designed for Sri Lankan water conditions. Our expert technicians can assess your water quality and recommend the perfect solution for your home or business.",
      "coverImage": "assets/images/blog/blog-1.jpg",
      "author": "Dr. Kumara Perera",
      "createdDate": "2025-01-15T10:30:00Z",
      "tags": ["reverse-osmosis", "water-purification", "technology", "health"],
      "category": "Technology",
      "instagramLink": "https://instagram.com/yaliwater",
      "facebookLink": "https://facebook.com/yaliwater",
      "linkedinLink": "https://linkedin.com/company/yaliwater"
    },
    {
      "id": 2,
      "slug": "water-filter-replacement-signs",
      "title": "Water Quality Challenges in Sri Lanka: A 2025 Perspective",
      "excerpt": "An in-depth look at the current state of water quality across different regions of Sri Lanka.",
      "content": "Sri Lanka, despite being blessed with abundant water resources, faces significant challenges in ensuring clean drinking water reaches all its citizens. As we navigate through 2025, understanding these challenges is crucial for making informed decisions about water purification.\n\nRegional Water Quality Variations:\n\nThe water quality in Sri Lanka varies dramatically by region. In the North Central Province, high fluoride levels in groundwater have been linked to Chronic Kidney Disease of Unknown Etiology (CKDu), affecting thousands of farming communities. The Dry Zone faces additional challenges with hard water that contains elevated levels of calcium and magnesium.\n\nUrban areas like Colombo and Kandy deal with different issues. While municipal water treatment exists, aging infrastructure can lead to contamination through corroded pipes. Chlorine levels, while necessary for disinfection, can affect taste and potentially form harmful byproducts.\n\nKey Contaminants of Concern:\n\n- Fluoride: Especially problematic in dry zone areas\n- Arsenic: Found in certain groundwater sources\n- Nitrates: Common in agricultural regions\n- Bacterial contamination: Risk in areas with inadequate treatment\n- Heavy metals: Industrial pollution affects some water sources\n\nSolutions for Sri Lankan Households:\n\nGiven these diverse challenges, a one-size-fits-all approach doesn't work. At Yali Water Solutions, we recommend water testing as the first step. Our team provides comprehensive water analysis to identify specific contaminants in your water supply, allowing us to recommend the most effective purification system for your needs.\n\nWhether you need a simple UV purifier for bacterial concerns or a comprehensive RO system for multi-contaminant removal, understanding your local water quality is the key to choosing the right solution.",
      "coverImage": "assets/images/blog/blog-2.jpg",
      "author": "Samantha Fernando",
      "createdDate": "2025-01-10T14:00:00Z",
      "tags": ["sri-lanka", "water-quality", "health", "environment"],
      "category": "Research",
      "facebookLink": "https://facebook.com/yaliwater",
      "linkedinLink": "https://linkedin.com/company/yaliwater"
    },
    {
      "id": 3,
      "slug": "maintaining-your-water-purifier",
      "title": "Essential Maintenance Tips for Your Water Purifier",
      "excerpt": "Learn how to keep your water purification system running efficiently with these simple maintenance practices.",
      "content": "Investing in a water purifier is just the first step toward ensuring clean drinking water for your family. Regular maintenance is essential to keep your system functioning at peak efficiency and to protect your investment for years to come.\n\nFilter Replacement Schedule:\n\nDifferent filters in your purification system have varying lifespans:\n\nSediment Filter: Replace every 6-12 months depending on water quality. If your water has high sediment content, you may need more frequent changes.\n\nCarbon Filter: Typically lasts 6-12 months. This filter removes chlorine and organic compounds, and an exhausted carbon filter can allow these contaminants to pass through.\n\nRO Membrane: The most critical component, lasting 2-3 years with proper care. However, pre-filter maintenance directly affects membrane life.\n\nUV Lamp: Replace annually, even if it's still lighting up. UV effectiveness decreases over time even when the lamp appears functional.\n\nSigns Your System Needs Attention:\n\n1. Decreased water flow or pressure\n2. Strange taste or odor in purified water\n3. Unusual sounds from the system\n4. Water leakage around connections\n5. TDS levels higher than expected\n\nDIY Maintenance Tips:\n\n- Wipe down the exterior weekly to prevent dust buildup\n- Check for leaks monthly\n- Monitor your TDS meter readings\n- Keep the area around your purifier clean and dry\n- Don't place the unit in direct sunlight\n\nProfessional Servicing:\n\nWhile basic maintenance can be done at home, we recommend professional servicing every 6 months. Our Yali Water Solutions technicians will sanitize the system, check all connections, test water quality, and ensure everything is functioning optimally.\n\nRemember, a well-maintained water purifier not only provides better water quality but also saves money in the long run by preventing costly repairs and extending system life.",
      "coverImage": "assets/images/blog/blog-3.jpg",
      "author": "Ruwan Silva",
      "createdDate": "2025-01-05T09:15:00Z",
      "tags": ["maintenance", "tips", "water-purifier", "diy"],
      "category": "Guides",
      "instagramLink": "https://instagram.com/yaliwater",
      "facebookLink": "https://facebook.com/yaliwater"
    },
    {
      "id": 4,
      "slug": "uv-vs-ro-water-purifiers",
      "title": "UV vs RO Water Purifiers: Which One is Right for You?",
      "excerpt": "A comprehensive comparison of UV and RO water purification technologies to help you make the best choice.",
      "content": "When shopping for a water purifier, two technologies dominate the market: Ultraviolet (UV) purification and Reverse Osmosis (RO). Understanding the differences between these systems is crucial for making the right choice for your household.\n\nUV Water Purification:\n\nUV purifiers use ultraviolet light to kill or inactivate microorganisms in water. When water passes through the UV chamber, the light damages the DNA of bacteria, viruses, and parasites, rendering them unable to reproduce and cause illness.\n\nAdvantages of UV:\n- Excellent for killing microorganisms\n- No water wastage\n- Retains essential minerals\n- Lower maintenance costs\n- No change in water taste\n- Environmentally friendly\n\nLimitations of UV:\n- Cannot remove dissolved impurities\n- Ineffective against chemicals and heavy metals\n- Requires clear water to work effectively\n- Needs electricity to operate\n\nRO Water Purification:\n\nRO systems force water through a semi-permeable membrane that removes the vast majority of contaminants, including dissolved salts, heavy metals, and microorganisms.\n\nAdvantages of RO:\n- Removes up to 99% of contaminants\n- Effective against TDS, heavy metals, and chemicals\n- Improves taste significantly\n- Works on any water source\n\nLimitations of RO:\n- Produces wastewater (typically 3:1 ratio)\n- Removes beneficial minerals\n- Higher maintenance costs\n- Requires adequate water pressure\n\nMaking Your Decision:\n\nChoose UV if:\n- Your water source has low TDS (below 300 ppm)\n- Main concern is microbial contamination\n- You want to retain minerals\n- Water wastage is a concern\n\nChoose RO if:\n- Your water has high TDS (above 500 ppm)\n- You need to remove heavy metals or chemicals\n- Water hardness is a problem\n- You want the purest possible water\n\nConsider RO+UV if:\n- You want comprehensive protection\n- Your water has both high TDS and microbial risks\n\nAt Yali Water Solutions, we can test your water and recommend the perfect system. Many of our customers in Colombo do well with UV systems, while those in the dry zone often benefit more from RO technology.",
      "coverImage": "assets/images/blog/blog-4.png",
      "author": "Dr. Kumara Perera",
      "createdDate": "2024-12-28T11:45:00Z",
      "tags": ["uv-purifier", "reverse-osmosis", "comparison", "buying-guide"],
      "category": "Guides",
      "instagramLink": "https://instagram.com/yaliwater",
      "facebookLink": "https://facebook.com/yaliwater",
      "linkedinLink": "https://linkedin.com/company/yaliwater"
    },
    {
      "id": 5,
      "slug": "benefits-of-drinking-purified-water",
      "title": "10 Amazing Health Benefits of Drinking Purified Water",
      "excerpt": "Discover how switching to purified water can transform your health and well-being.",
      "content": "Water is essential for life, but not all water is created equal. Drinking purified water offers numerous health benefits that can significantly improve your overall well-being. Here are ten compelling reasons to make the switch to purified water.\n\n1. Improved Digestion\nPure water aids in breaking down food more efficiently and helps your body absorb nutrients better. It also helps prevent constipation by keeping things moving smoothly through your digestive system.\n\n2. Enhanced Kidney Function\nYour kidneys filter about 200 liters of blood daily. Purified water, free from contaminants, reduces the workload on your kidneys and helps prevent kidney stones.\n\n3. Better Skin Health\nHydration with clean water helps maintain skin elasticity and can reduce the appearance of wrinkles. Contaminant-free water also means fewer skin irritations and breakouts.\n\n4. Increased Energy Levels\nDehydration is a major cause of fatigue. Drinking pure water helps maintain optimal cellular function, keeping you energized throughout the day.\n\n5. Stronger Immune System\nPurified water supports your immune system by ensuring your body's natural defenses aren't compromised by waterborne pathogens or chemicals.\n\n6. Better Cognitive Function\nYour brain is 73% water. Drinking purified water improves concentration, memory, and overall cognitive performance.\n\n7. Healthy Weight Management\nDrinking water before meals can reduce appetite, and pure water contains zero calories while helping your metabolism function efficiently.\n\n8. Detoxification\nClean water helps flush toxins from your body through urine and sweat, supporting your liver and kidneys in their natural detoxification processes.\n\n9. Joint Health\nWater lubricates and cushions your joints. Purified water ensures this lubrication isn't contaminated with substances that could cause inflammation.\n\n10. Better Taste Leads to More Consumption\nLet's be honest - purified water simply tastes better. When water tastes good, you're more likely to drink adequate amounts, ensuring you stay properly hydrated.\n\nMake the switch today with Yali Water Solutions and experience these benefits for yourself. Your body will thank you!",
      "coverImage": "assets/images/blog/blog-5.png",
      "author": "Dr. Nishani Jayawardena",
      "createdDate": "2024-12-20T08:30:00Z",
      "tags": ["health", "benefits", "hydration", "wellness"],
      "category": "Health",
      "instagramLink": "https://instagram.com/yaliwater",
      "facebookLink": "https://facebook.com/yaliwater"
    },
    {
      "id": 6,
      "slug": "whole-house-water-filtration",
      "title": "Why Every Home Needs a Whole House Water Filtration System",
      "excerpt": "Learn why filtering water at every tap in your home is a smart investment for your family's health.",
      "content": "While point-of-use water purifiers for drinking water are common, many homeowners overlook the importance of filtering water throughout their entire home. A whole house water filtration system offers comprehensive protection that goes beyond just your kitchen tap.\n\nWhat is Whole House Filtration?\n\nA whole house water filtration system, also known as a point-of-entry (POE) system, is installed where water enters your home. This means every drop of water - whether from your kitchen faucet, shower, washing machine, or garden hose - passes through the filtration system.\n\nWhy Your Shower Water Matters:\n\nMany people don't realize that we absorb more chlorine and chemicals through our skin during a 10-minute shower than from drinking 8 glasses of tap water. Hot water opens our pores, allowing greater absorption of contaminants. Chlorine in shower water can also vaporize, and we inhale these fumes.\n\nBenefits of Whole House Filtration:\n\nHealthier Skin and Hair: Filtered shower water reduces chlorine exposure that can dry out skin and damage hair. Many users report softer skin and more manageable hair within weeks of installation.\n\nProtected Appliances: Hard water and sediment damage water heaters, washing machines, and dishwashers. Filtered water extends appliance life and reduces energy consumption.\n\nCleaner Clothes: Washing clothes in filtered water helps them last longer, stay brighter, and feel softer. Chlorine can fade colors and weaken fabric fibers.\n\nReduced Plumbing Issues: Sediment and scale buildup in pipes leads to reduced water pressure and costly repairs. Filtration prevents this buildup.\n\nBetter Indoor Air Quality: Chlorine and other volatile compounds can evaporate from tap water and affect indoor air quality. Whole house filtration reduces these airborne contaminants.\n\nConsistent Water Quality: Every tap delivers the same high-quality water, so you never have to worry about which faucet to use.\n\nInvestment Considerations:\n\nWhile whole house systems require a larger upfront investment than point-of-use purifiers, the long-term benefits often outweigh the costs. Reduced appliance repairs, lower energy bills, and health benefits provide significant returns.\n\nYali Water Solutions offers customized whole house filtration systems designed for Sri Lankan water conditions. Contact us for a free home assessment.",
      "coverImage": "assets/images/blog/blog-6.jpg",
      "author": "Ashan Bandara",
      "createdDate": "2024-12-15T16:00:00Z",
      "tags": ["whole-house", "filtration", "home-improvement", "health"],
      "category": "Products",
      "facebookLink": "https://facebook.com/yaliwater",
      "linkedinLink": "https://linkedin.com/company/yaliwater"
    },
    {
      "id": 7,
      "slug": "water-purification-for-businesses",
      "title": "Commercial Water Purification: Solutions for Sri Lankan Businesses",
      "excerpt": "How restaurants, hotels, and offices can ensure safe, great-tasting water for customers and employees.",
      "content": "For businesses in Sri Lanka, water quality isn't just about health - it's about reputation, operational efficiency, and customer satisfaction. Whether you run a restaurant, hotel, office, or manufacturing facility, the right water purification solution can make a significant difference to your bottom line.\n\nRestaurants and Cafes:\n\nWater quality directly affects food and beverage taste. Coffee and tea made with purified water taste significantly better because there's no chlorine or mineral interference. Ice machines using filtered water produce cleaner, better-tasting ice. Many high-end restaurants in Colombo have discovered that switching to purified water noticeably improves their cuisine.\n\nKey considerations:\n- High-capacity RO systems for cooking and beverages\n- Ice machine filters\n- Drinking water dispensers for customers\n- Hot water systems with built-in filtration\n\nHotels and Resorts:\n\nGuest experience is paramount in hospitality. International tourists often have concerns about local water quality. Providing safe, great-tasting water throughout your property - from drinking water to shower water - enhances guest satisfaction and reviews.\n\nSolutions include:\n- Central water treatment systems\n- In-room water purifiers\n- Swimming pool water treatment\n- Spa and wellness water filtration\n\nOffice Buildings:\n\nEmployee health and productivity are directly linked to hydration. Providing clean drinking water reduces sick days and shows you care about your team's well-being.\n\nPopular options:\n- Water cooler systems with built-in purification\n- Under-sink RO units for pantry areas\n- Touchless water dispensers (post-COVID essential)\n\nManufacturing and Industrial:\n\nMany industries require specific water quality standards. Electronics manufacturing, pharmaceuticals, food processing, and textile industries all have unique water requirements.\n\nWe provide:\n- Industrial RO systems\n- Deionization units\n- Custom water treatment solutions\n- Wastewater treatment systems\n\nWhy Choose Yali Water Solutions for Your Business?\n\nWe understand that business needs differ from residential requirements. Our commercial division offers:\n- Free water quality assessment\n- Customized system design\n- Professional installation with minimal disruption\n- Annual maintenance contracts\n- 24/7 emergency support\n- Flexible payment options\n\nContact our commercial team today to discuss your business water needs.",
      "coverImage": "assets/images/blog/blog-7.png",
      "author": "Dinesh Rajapaksa",
      "createdDate": "2024-12-08T13:20:00Z",
      "tags": ["commercial", "business", "restaurants", "hotels"],
      "category": "Business",
      "linkedinLink": "https://linkedin.com/company/yaliwater",
      "facebookLink": "https://facebook.com/yaliwater"
    },
    {
      "id": 8,
      "slug": "water-filter-replacement-signs",
      "title": "Why Water Testing Should Be Your First Step",
      "excerpt": "Before buying any water purifier, understanding your water quality through professional testing is essential.",
      "content": "Many homeowners make the mistake of purchasing a water purifier based on marketing claims or recommendations from friends, without first understanding their specific water quality issues. This often leads to either over-spending on unnecessary features or under-protecting their family from actual contaminants present in their water.\n\nWhat Water Testing Reveals:\n\nA comprehensive water test examines multiple parameters that determine both the safety and aesthetic quality of your water:\n\nPhysical Parameters:\n- Total Dissolved Solids (TDS)\n- Turbidity (cloudiness)\n- Color and odor\n- Temperature\n\nChemical Parameters:\n- pH level\n- Hardness (calcium and magnesium)\n- Chlorine levels\n- Heavy metals (lead, arsenic, mercury)\n- Fluoride\n- Nitrates and nitrites\n- Iron and manganese\n\nBiological Parameters:\n- Total coliform bacteria\n- E. coli\n- Other pathogens\n\nWhy Different Areas Need Different Solutions:\n\nIn Sri Lanka, water quality varies dramatically:\n\nColombo Municipal Water: Generally treated but may have high chlorine, potential pipe contamination, and moderate TDS.\n\nWell Water in Dry Zone: Often has high fluoride, elevated TDS, and hardness issues requiring comprehensive RO treatment.\n\nCoastal Areas: May experience saltwater intrusion requiring specialized desalination.\n\nEstate Areas: Often uses surface water that may have agricultural chemical contamination.\n\nHow to Get Your Water Tested:\n\nYali Water Solutions offers free basic water testing as part of our consultation service. For customers requiring detailed analysis, we provide comprehensive laboratory testing that examines over 30 parameters.\n\nOur testing process:\n1. Schedule a convenient appointment\n2. Our technician collects samples properly\n3. Samples are analyzed in certified laboratories\n4. You receive a detailed report with explanations\n5. We recommend appropriate solutions based on results\n\nDon't guess about your water quality. Know exactly what you're dealing with before investing in a purification system. Contact Yali Water Solutions today to schedule your free water assessment.",
      "coverImage": "assets/images/blog/blog-8.jpg",
      "author": "Samantha Fernando",
      "createdDate": "2024-12-01T10:00:00Z",
      "tags": ["water-testing", "water-quality", "buying-guide", "health"],
      "category": "Education",
      "instagramLink": "https://instagram.com/yaliwater",
      "facebookLink": "https://facebook.com/yaliwater",
      "linkedinLink": "https://linkedin.com/company/yaliwater",
      "githubLink": ""
    }
  ]

}


